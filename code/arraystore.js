
function getArrayStorageProvider(store_to) {
  return {
    clearAll: function clearAll() {
      // used for testing, this array is simulating a mongo collection, so we need to modify it
      // eslint-disable-next-line no-param-reassign
      store_to.length = 0; // apparently this is legit according to spec.
    },

    insertAll: function insertAll(items) {
      items.forEach(item => store_to.push(item));
    }
  };
}

exports.getArrayStorageProvider = getArrayStorageProvider;
