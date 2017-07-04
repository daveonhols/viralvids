const Twitter = require("twitter");
const moment = require("moment");

const UrlCounter = require("./code/objcounter.js").OCounter;
const mongo = require("./code/mongo.js");

const client = new Twitter({
  consumer_key: "niXGKMgdQalUtb7l128twvH5W",
  consumer_secret: "Fae4Lz2Hi5eSV4DTby9xiIoPbsle0EDgsiqwZkNZ6TNkHyfeZh",
  access_token_key: "1017813937-3CPVDR2Sj1s5zEVGUVgwVsiCzN4vLqTMIQ5uqQO",
  access_token_secret: "AU6cwhnYeo0VnVituDGWBpCDlEwhDB4l9LnqZVzTlfeia"
});

function save(items) {
  mongo.getDb()
    .then(db => db.collection("start"))
    .then(col => col.deleteMany({}));
  mongo.getDb()
    .then(db => db.collection("start"))
    .then(col => items.forEach(item => col.insertOne(item)));
}

function initStream(docs) {
  const count_tweets = new UrlCounter(docs);

  const stream = client.stream("statuses/filter", { track: "youtube London", language: "en" });

  stream.on("data", (event) => {
    if (!event) {
      return;
    }

    const tweet_meta = { text: event.text, id: event.id_str, user: event.user.name };
    const expiry_time = moment().add(36, "hours").valueOf();

    event.entities.urls.forEach(
      url => count_tweets.incr(
        url.expanded_url,
        { tweet: tweet_meta, expires: expiry_time })
    );

    console.log(count_tweets.max());
    count_tweets.purge(moment());
    save(count_tweets.flatten());
  });

  stream.on("error", (error) => {
    console.log(error);
    throw error;
  });
}

mongo.getDb()
  .then(db => db.collection("start"))
  .then(col => col.find({}, { _id: 0 }).toArray())
  .then(docs => initStream(docs));

