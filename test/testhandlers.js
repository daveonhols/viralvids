const expect = require("chai").expect;
const store = require("./../datastore/arraystore.js");
const about = require("./../code/handlers/about.js").handler;
const categories = require("./../code/handlers/categories.js").handler;
const category = require("./../code/handlers/category.js").handler;
const root = require("./../code/handlers/root.js").handler;
const video = require("./../code/handlers/video.js").handler;


it("about handler", function() {

  const rendered = { };
  const response = { render: (template, data) => rendered.data = data };

  const done =
    about({}, response, {}, store.getArrayStorageProvider([], ["One", "Two", "Three"]))
      .then(done => validate_about(rendered));

  return done;

});

it("categories handler", function() {

  const rendered = { };
  const response = { render: (template, data) => rendered.data = data };

  const done =
    categories({}, response, {}, store.getArrayStorageProvider([], ["Two", "Three", "Four", "Five"]))
      .then(done => validate_categories(rendered));

  return done;

});

it("category handler", function() {

  const request = { params : { category: "One" } };
  const rendered = { };
  const response = { render: (template, data) => rendered.data = data };

  const videos = [
    { id: 0, num: 10, tweets: [ {}, {}, {} ] },
    { id: 1, num: 8, tweets: [ {}, {}, {} ] },
    { id: 2, num: 3, tweets: [ {}, {}, {} ] },
    { id: 3, num: 1, tweets: [ {}, {}, {} ] },
    { id: 4, num: 1, tweets: [ {}, {}, {} ] } ];

  const done =
    category(request, response, {}, store.getArrayStorageProvider(videos, ["Five", "Siz", "Seven"]))
      .then(done => validate_category(rendered));

  return done;

});

it("root handler", function() {

  const rendered = { };
  const response = { render: (template, data) => rendered.data = data };

  const videos = [
    { id: 0, num: 10, tweets: [ {}, {}, {} ] },
    { id: 1, num: 8, tweets: [ {}, {}, {} ] },
    { id: 3, num: 1, tweets: [ {}, {}, {} ] },
    { id: 4, num: 1, tweets: [ {}, {}, {} ] } ];

  const done =
    root({}, response, {}, store.getArrayStorageProvider(videos, ["Nine", "Eight"]))
      .then(done => validate_root(rendered));

  return done;

});

it("video handler", function() {

  const request = { params : { category: "One", id: 0 } };

  const rendered = { };
  const response = { render: (template, data) => rendered.data = data };

  const tweets = [{}, {}, {}, {}];

  const done =
    video(request, response, {}, store.getArrayStorageProvider(tweets, ["One", "Two"]))
    .then(done => validate_video(rendered));

  return done;

});

function validate_about(rendered) {
  expect(rendered.data.categories.length).to.equal(3);
  expect(rendered.data.categories[0]).to.equal("One");
}

function validate_categories(rendered) {
  expect(rendered.data.categories.length).to.equal(4);
  expect(rendered.data.categories[0]).to.equal("Two");
  expect(rendered.data.categories[3]).to.equal("Five");
}

function validate_category(rendered) {
  expect(rendered.data.videos.length).to.equal(5);
  expect(rendered.data.category).to.equal("One");
  expect(rendered.data.categories.length).to.equal(3);
}

function validate_root(rendered) {
  expect(rendered.data.videos.length).to.equal(4);
  expect(rendered.data.categories.length).to.equal(2);
}

function validate_video(rendered) {
  expect(rendered.data.video_id).to.equal(0);
  expect(rendered.data.tweets.length).to.equal(4);
  expect(rendered.data.categories.length).to.equal(2);
}

