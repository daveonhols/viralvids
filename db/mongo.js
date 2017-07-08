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
    }

  };
}

exports.getDb = getDb;
exports.getMongoStorageProvider = getMongoStorageProvider;
