"use strict";

const expect = require("chai").expect;
const moment = require("moment");
const urlCounter = require("./../code/objcounter.js").OCounter;

it("try adding to the counter", function() {
  const countTweets = new urlCounter([]);
  const ten_hours = moment().add(10, "hours");
  countTweets.incr("http://www.site.com/abc", { tweet: { text: "text 1", id: "001", user: "whoever" }, expires: ten_hours });
  countTweets.incr("http://www.site.com/def", { tweet: { text: "text 2", id: "002", user: "somoene" }, expires: ten_hours });
  countTweets.incr("http://www.site.com/abc", { tweet: { text: "text 3", id: "003", user: "somoene" }, expires: ten_hours });
  countTweets.incr("http://www.site.com/xyz", { tweet: { text: "text 4", id: "004", user: "somoene" }, expires: ten_hours });
  countTweets.incr("http://www.site.com/def", { tweet: { text: "text 5", id: "005", user: "somoene" }, expires: ten_hours });
  countTweets.incr("http://www.site.com/abc", { tweet: { text: "text 6", id: "006", user: "somoene" }, expires: ten_hours });
  const biggest = countTweets.max();
  console.log("max=" + JSON.stringify(biggest));
  expect(biggest.value.length).to.equal(3);
  expect(biggest.value[0].tweet.text).to.equal("text 1");
  expect(biggest.value[1].tweet.text).to.equal("text 3");
  expect(biggest.value[2].tweet.text).to.equal("text 6");
  expect(countTweets.min().value[0].tweet.text).to.equal("text 4");
});


it("flatten for storage", function() {
  const countTweets = new urlCounter([]);
  const ten_hours = moment().add(10, "hours");
  countTweets.incr("http://www.site.com/111", { tweet: { text: "text 5", id: "005", user: "somoene" }, expires: ten_hours });
  countTweets.incr("http://www.site.com/222", { tweet: { text: "text 6", id: "006", user: "somoene" }, expires: ten_hours });
  countTweets.incr("http://www.site.com/222", { tweet: { text: "text 7", id: "007", user: "otheruser" }, expires: ten_hours });
  const flat = countTweets.flatten();
  flat.forEach(item => console.log(JSON.stringify(item)));
  expect(flat.length).to.equal(2);
})


it("with purging, expire one simple", function() {

  const thirty_mins = moment().add(30, "minutes");
  const one_hour = moment().add(1, "hours");
  const two_hours = moment().add(2, "hours");
  const three_hours = moment().add(3, "hours");
  const four_hours = moment().add(4, "hours");

  const countTweets = new urlCounter([]);

  countTweets.incr("url_one", {tweet: { text: "text_1", id: "001", user: "one" }, expires: one_hour });
  expect(countTweets.max().value.length).to.equal(1);
  countTweets.purge(thirty_mins);
  expect(countTweets.max().value.length).to.equal(1);
  countTweets.purge(two_hours);
  expect(countTweets.max()).to.equal(null);
  countTweets.incr("url_two", {tweet: { text: "text_2", id: "002", user: "two" }, expires: one_hour });
  expect(countTweets.max().value.length).to.equal(1);
  expect(countTweets.max().value[0].tweet.text).to.equal("text_2");

})


it("with purging, expire multi", function() {

  const thirty_mins = moment().add(30, "minutes");
  const one_hour = moment().add(1, "hours");
  const two_hours = moment().add(2, "hours");
  const three_hours = moment().add(3, "hours");
  const four_hours = moment().add(4, "hours");

  const countTweets = new urlCounter([]);

  countTweets.incr("url_one", {tweet: { text: "text_1", id: "001", user: "one" }, expires: four_hours });
  countTweets.incr("url_one", {tweet: { text: "text_2", id: "002", user: "two" }, expires: four_hours });
  countTweets.incr("url_two", {tweet: { text: "text_3", id: "003", user: "three" }, expires: thirty_mins });
  countTweets.incr("url_two", {tweet: { text: "text_4", id: "004", user: "four" }, expires: one_hour });
  countTweets.incr("url_two", {tweet: { text: "text_5", id: "005", user: "five" }, expires: four_hours });
  expect(countTweets.max().value.length).to.equal(3);
  expect(countTweets.max().value[0].tweet.text).to.equal("text_3");
  expect(countTweets.max().value[1].tweet.text).to.equal("text_4");
  expect(countTweets.max().value[2].tweet.text).to.equal("text_5");
  countTweets.purge(two_hours);
  expect(countTweets.max().value.length).to.equal(2);
  expect(countTweets.max().value[0].tweet.text).to.equal("text_1");
  expect(countTweets.max().value[1].tweet.text).to.equal("text_2");
})

it("flatten and load", function() {

  const thirty_mins = moment().add(30, "minutes");
  const one_hour = moment().add(1, "hours");
  const two_hours = moment().add(2, "hours");
  const three_hours = moment().add(3, "hours");
  const four_hours = moment().add(4, "hours");

  const countTweets = new urlCounter([]);

  countTweets.incr("url_one", {tweet: { text: "text_1", id: "001", user: "one" }, expires: one_hour });
  expect(countTweets.max().value.length).to.equal(1);
  countTweets.purge(thirty_mins);
  expect(countTweets.max().value.length).to.equal(1);

  const flat = countTweets.flatten();

  countTweets.purge(two_hours);
  expect(countTweets.max()).to.equal(null);

  const c2 = new urlCounter(flat);
  expect(c2.max().value.length).to.equal(1);
  expect(c2.max().value[0].tweet.text).to.equal("text_1");

});
