const moment = require("moment");
const commandLineArgs = require("command-line-args");

const UrlCounter = require("../code/helpers/urlcounter.js").OCounter;
const mongo = require("../datastore/mongostore.js");
const client = require("../code/tweetsource/client.js").client;
const handleTweetEvent = require("../code/tweetsource/eventhandler.js").handleTweetEvent;

const optionDefinitions = [
  { name: "search", alias: "s", type: String }
];

const options = commandLineArgs(optionDefinitions);

const search_key = options.search;
console.log(search_key);


function initStream(docs, storage_provider) {
  const count_tweets = new UrlCounter(docs, storage_provider);

  const stream = client.stream("statuses/filter", { track: `youtube ${search_key}`, language: "en" });

  stream.on("data", (event) => {
    if (!event) {
      return;
    }

    handleTweetEvent(
      count_tweets,
      event.text,
      event.id_str,
      event.user.name,
      event.entities.urls,
      moment());

    console.log(count_tweets.max());
  });

  stream.on("error", (error) => {
    console.log(error);
    throw error;
  });
}

mongo.getDb()
  .then(db => db.collection(`raw.${search_key}`))
  .then(col => col.find({}, { _id: 0 }).toArray())
  .then(docs => initStream(docs, mongo.getMongoStorageProvider(`raw.${search_key}`)));

