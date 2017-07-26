const cleaner = require("./../code/processors/cleaner.js");
const db = require("./../datastore/mongostore.js");
const commandLineArgs = require("command-line-args");

const optionDefinitions = [
  { name: "collection", alias: "c", type: String }
];

const options = commandLineArgs(optionDefinitions);

const clean_key = options.collection;
console.log(clean_key);

const clean_src = db.getMongoStorageProvider(`raw.${clean_key}`);
const clean_dest = db.getMongoStorageProvider(`cleaned.${clean_key}`);

function cleanOnTimer() {
  console.log(" :: cleaning :: ");
  cleaner.clean_collection(clean_src, clean_dest);
}

setInterval(cleanOnTimer, 1000 * 60);

