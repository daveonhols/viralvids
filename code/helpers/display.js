function videoForDisplay(item, collection) {
  const result = { id: item.key.id, num: item.key.num, tweets: item.value };
  result.source = collection.substr("cleaned.".length);
  return result;
}

exports.videoForDisplay = videoForDisplay;
