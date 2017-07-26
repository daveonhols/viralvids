function getTopsOverall(limit, per_collection) {
  const result = [];
  console.log(per_collection);
  const available = per_collection.reduce((sum, collection) => sum + collection.length, 0);
  const max_limit = Math.min(available, limit);

  let take_from = 0;
  while (result.length < max_limit) {
    if (per_collection[take_from].length > 0) {
      result.push(per_collection[take_from].shift());
    }
    take_from = (take_from + 1) % per_collection.length;
  }
  console.log("result::");
  console.log(result);
  return result;
}

exports.getTopsOverall = getTopsOverall;
