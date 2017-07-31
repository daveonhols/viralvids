
function getArrayStorageProvider(store_to, categories) {
  return {
    clearAll: function clearAll() {
      // used for testing, this array is simulating a mongo collection, so we need to modify it
      // eslint-disable-next-line no-param-reassign
      store_to.length = 0; // apparently this is legit according to spec.
      return Promise.resolve();
    },

    insertAll: function insertAll(items) {
      items.forEach(item => store_to.push(item));
      return Promise.resolve();
    },

    getAllCategories: function getAllCategories() {
      return new Promise(resolve => resolve(categories));
    },

    getTopForCategory: function getTopForCategory() {
      return new Promise(resolve => resolve(store_to));
    },

    getTopOverall: function getTopOverall() {
      return new Promise(resolve => resolve(store_to));
    },

    getVideoTweets: function getVideoTweets() {
      return new Promise(resolve => resolve(store_to));
    },

    getAll: function getAll() {
      return new Promise(resolve => resolve(store_to));
    }
  };
}

exports.getArrayStorageProvider = getArrayStorageProvider;
