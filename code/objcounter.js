
const moment = require("moment");
const AVLTree = require("dsjslib").AVLTree;

function OCounter(docs) {
  function compNum(a, b) {
    if (b.num === a.num) {
      const objComp = (a.url === b.url);
      if (objComp) {
        return 0;
      }
      return (a.url < b.url) ? -1 : 1;
    }
    return (b.num - a.num) < 0 ? -1 : 1;
  }

  const counter = new AVLTree(compNum);
  const flat = {};

  function toString() {
    return `${JSON.stringify(flat)} :: ${JSON.stringify(counter)}`;
  }

  console.log(`initialising with docs:: ${docs.length} :: ${JSON.stringify(docs)}`);
  docs.forEach(doc => counter.put(doc.key, doc.value));
  docs.forEach((doc) => { flat[doc.key.url] = doc.key.num; });

  console.log(`initialised to :: ${toString()}`);

  this.incr = function incr(url, tweet_meta) {
    console.log(`putting url | tweet_meta:  ${JSON.stringify([url, JSON.stringify(tweet_meta)])}`);
    let num = (url in flat) ? flat[url] : 0;
    const prev_key = { num, url };
    num += 1;
    const new_key = { num, url };

    let meta = [tweet_meta];

    if (num > 1) {
      const found = counter.get(prev_key);
      if (found === undefined) {
        console.log("FOUND UNDEFINED");
        console.log(toString());
        return;
      }
      Array.prototype.push.apply(found.value, meta);
      meta = found.value;
      counter.delete(prev_key);
    }
    flat[url] = num;
    counter.put(new_key, meta);
  };

  this.min = function min() { return counter.min(); };
  this.max = function max() { return counter.max(); };

  this.flatten = function flatten() {
    const result = [];
    counter.traverse(item => result.push({ key: item.key, value: item.value }));
    return result;
  };

  function purge_one(purge_key, purge_after) {
    const new_score = purge_key.num - 1;

    if (new_score === 0) {
      delete flat[purge_key.url];
    } else {
      flat[purge_key.url] = new_score;
    }

    const old_value = counter.get(purge_key).value;
    const new_value = old_value.filter(item => !moment(item.expires).isAfter(purge_after));
    counter.delete(purge_key);

    if (new_score > 0) {
      counter.put({ url: purge_key.url, num: new_score }, new_value);
    }
  }

  this.purge = function purge(purge_after) {
    const to_purge = [];
    const check_purge = function check_purge(item) {
      if (item.value.some(check_tweet => !moment(check_tweet.expires).isAfter(purge_after))) {
        to_purge.push(item.key);
      }
    };

    counter.traverse(to_check => check_purge(to_check));

    if (to_purge.length > 0) {
      console.log(`purging entries:: ${to_purge.length}`);
      to_purge.forEach(item => purge_one(item, purge_after));
    }
  };
}
exports.OCounter = OCounter;
