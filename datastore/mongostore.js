const mongo = require("mongodb").MongoClient;
const Secrets = require("../secrets/secret.js");
const getTopsOverall = require("../code/processors/aggregator.js").getTopsOverall;
const videoForDisplay = require("../code/helpers/display.js").videoForDisplay;

const connection = Secrets.getSecret("mongo_url");

let raw_connection;

function connect() {
  raw_connection = mongo.connect(connection);
}

function getDb() {
  if (raw_connection === undefined) {
    connect();
  }
  return raw_connection;
}

function getMongoStorageProvider(collection) {
  return {
    clearAll: function clearAll() {
      const done =
        getDb()
          .then(db => db.collection(collection))
          .then(col => col.deleteMany({}));

      return done;
    },

    insertAll: function insertAll(items) {
      const done =
        getDb()
          .then(db => db.collection(collection))
          .then(col => items.forEach(item => col.insertOne(item)));

      return done;
    },

    getAll: function getAll() {
      const done =
        getDb()
          .then(db => db.collection(collection))
          .then(col => col.find({}, { _id: 0 }).toArray());

      return done;
    },

    getAllCategories: function getAllCategories() {
      const done =
        getDb()
          .then(db => db.listCollections({ name: /^cleaned.*/ }).toArray())
          .then(collections => collections.map(col => col.name.substr("cleaned.".length)));

      return done;
    },

    getTopForCategory: function getTopForCategory(limit, category) {
      const done =
        getDb()
          .then(db => db.collection(`cleaned.${category}`))
          .then(col => col.find({ }, { key: "true", value: "true" }, { limit, sort: [["key.num", "desc"]] }).map(item => videoForDisplay(item, col.collectionName)))
          .then(videos => videos.toArray());

      return done;
    },

    getVideoTweets: function getVideoTweets(category, video_id) {
      const done =
        getDb()
          .then(db => db.collection(`cleaned.${category}`))
          .then(col => col.findOne({ "key.id": video_id }))
          .then(video => video.value);

      return done;
    },

    getTopOverall: function getTopOverall(limit) {
      const done =
        getDb()
          .then(db => Promise.all([db, db.listCollections({ name: /^cleaned.*/ }).toArray()]))
          .then(items => Promise.all(items[1].map(item => items[0].collection(item.name))))
          .then(collections => Promise.all(collections.map(col => col.find({}, { key: "true", value: "true" }, { limit, sort: [["key.num", "desc"]] }).map(item => videoForDisplay(item, col.collectionName)))))
          .then(tops => Promise.all(tops.map(top => top.toArray())))
          .then(tops => getTopsOverall(limit, tops));

      return done;
    }

  };
}

exports.getDb = getDb;
exports.getMongoStorageProvider = getMongoStorageProvider;
