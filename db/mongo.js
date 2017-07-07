const mongo = require("mongodb").MongoClient;
const Secrets = require("../secrets/secret.js");

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
      getDb()
        .then(db => db.collection(collection))
        .then(col => col.deleteMany({}));
    },

    insertAll: function insertAll(items) {
      getDb()
        .then(db => db.collection(collection))
        .then(col => items.forEach(item => col.insertOne(item)));
    }
  };
}

exports.getDb = getDb;
exports.getMongoStorageProvider = getMongoStorageProvider;
