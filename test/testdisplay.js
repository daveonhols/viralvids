const expect = require("chai").expect;
const display = require("./../code/helpers/display.js").videoForDisplay;

it("video for display", function() {

  const collection = "cleaned.collection";
  const video = { key: { id: 1, num: 10 }, value: [ {}, {}, {} ] }
  const result = display(video, collection);
  expect(result.id).to.equal(1);
  expect(result.num).to.equal(10);
  expect(result.tweets.length).to.equal(3);

});