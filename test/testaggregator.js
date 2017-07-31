const expect = require("chai").expect;
const aggregator = require("./../code/processors/aggregator.js").getTopsOverall;

it("test agg, limit not available", function() {

  const collections = [[{ id: 1}, { id: 2}, {id: 3}], [{id: 4}], [{id: 5}]];
  const result = aggregator(10, collections);
  const sum_ids = result.reduce((state, item) => state += item.id, 0);
  expect(result.length).to.equal(5);
  expect(sum_ids).to.equal(15);
})

it("test agg, limit available", function() {

  const collections = [[{ id: 1}, { id: 2}, {id: 3}], [{id: 4}, {id: 5}, {id: 6}], [{id: 7}, {id: 8}, {id: 9}]];
  const result = aggregator(6, collections);
  const sum_ids = result.reduce((state, item) => state += item.id, 0);
  expect(result.length).to.equal(6);
  expect(sum_ids).to.equal(27);
})