const mongo = require("mongodb").MongoClient;

const connection = "mongodb://localhost:27017/theratio";

let db = undefined;

function connect() {
  db = mongo.connect(connection);
}

function getDb() {
  if (db === undefined) {
    connect();
  }
  return db;
}

exports.getDb = getDb;
