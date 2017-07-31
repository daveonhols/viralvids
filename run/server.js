const express = require("express");
const templating = require("express-handlebars");
const path = require("path");

const root_handler = require("../code/handlers/root.js").handler;
const categories_handler = require("../code/handlers/categories.js").handler;
const category_handler = require("../code/handlers/category.js").handler;
const video_handler = require("../code/handlers/video.js").handler;
const about_handler = require("../code/handlers/about.js").handler;

const data_provider = require("../datastore/mongostore.js");

const app = express();

app.engine("html", templating());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "./../views"));

app.use(express.static("public"));


app.get("/", (request, response) => root_handler(request, response, "index.html", data_provider.getMongoStorageProvider()));
app.get("/categories", (request, response) => categories_handler(request, response, "categories.html", data_provider.getMongoStorageProvider()));
app.get("/category/:category", (request, response) => category_handler(request, response, "category.html", data_provider.getMongoStorageProvider()));
app.get("/video/:category/:id", (request, response) => video_handler(request, response, "video.html", data_provider.getMongoStorageProvider()));
app.get("/about/", (request, response) => about_handler(request, response, "about.html", data_provider.getMongoStorageProvider()));

app.listen(3000, "0.0.0.0", () => console.log("starting up"));
