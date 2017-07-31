const expect = require("chai").expect;
const store = require("./../datastore/arraystore.js");
const cleaner = require("./../code/processors/cleaner.js");

it("test cleaner can consolidate", function() {

  const source = [
    { key: { num: 3, url: "http://youtu.be/abcdef?a"  },
      value: [
        { tweet: { text: "t1", id: "i1", user: "u1" }, expires: 0 },
        { tweet: { text: "t2", id: "i2", user: "u2" }, expires: 0 },
        { tweet: { text: "t3", id: "i3", user: "u3" }, expires: 0 }
      ]
    },
    { key: { num: 2, url: "http://www.youtube.com/watch?v=abcdef&feature=share"  },
      value: [
        { tweet: { text: "t4", id: "i4", user: "u4" }, expires: 0 },
        { tweet: { text: "t5", id: "i5", user: "u5" }, expires: 0 }
      ]
    }
  ];
  const dest = [];

  const validate_write = function() {
    expect(dest.length).to.equal(1);
    expect(dest[0].key.url).to.equal("http://youtu.be/abcdef");
    expect(dest[0].value.length).to.equal(5);
    return Promise.resolve();
  }

  const validate_fail = function(error) {
    console.log(`Failed with error:  ${error}`);
    expect(true).to.equal(false);
  }

  const done = cleaner.clean_collection(store.getArrayStorageProvider(source), store.getArrayStorageProvider(dest));
  return done.then(() => validate_write());

})

it("test cleaner can not consolidate", function() {

  const source = [
    { key: { num: 3, url: "http://youtu.be/defghi?a"  },
      value: [
        { tweet: { text: "t1", id: "i1", user: "u1" }, expires: 0 },
        { tweet: { text: "t2", id: "i2", user: "u2" }, expires: 0 },
        { tweet: { text: "t3", id: "i3", user: "u3" }, expires: 0 }
      ]
    },
    { key: { num: 2, url: "http://www.youtube.com/watch?v=abcdef&feature=share"  },
      value: [
        { tweet: { text: "t4", id: "i4", user: "u4" }, expires: 0 },
        { tweet: { text: "t5", id: "i5", user: "u5" }, expires: 0 }
      ]
    }
  ];
  const dest = [];

  const validate_write = function() {
    expect(dest.length).to.equal(2);
    expect(dest[0].key.url).to.equal("http://youtu.be/abcdef");
    expect(dest[0].value.length).to.equal(2);
    expect(dest[1].key.url).to.equal("http://youtu.be/defghi");
    expect(dest[1].value.length).to.equal(3);
    return Promise.resolve();
  }

  const validate_fail = function(error) {
    console.log(`Failed with error:  ${error}`);
    expect(true).to.equal(false);
  }

  const done = cleaner.clean_collection(store.getArrayStorageProvider(source), store.getArrayStorageProvider(dest));
  return done.then(() => validate_write());

})

it("test cleaner can drop", function() {

  const source = [
    { key: { num: 3, url: "http://youtube.com/watch?v=abcdef&a=x"  },
      value: [
        { tweet: { text: "t1", id: "i1", user: "u1" }, expires: 0 },
        { tweet: { text: "t2", id: "i2", user: "u2" }, expires: 0 },
        { tweet: { text: "t3", id: "i3", user: "u3" }, expires: 0 }
      ]
    },
    { key: { num: 2, url: "http://www.yahoo.com/watch?v=abcdef&feature=share"  },
      value: [
        { tweet: { text: "t4", id: "i4", user: "u4" }, expires: 0 },
        { tweet: { text: "t5", id: "i5", user: "u5" }, expires: 0 }
      ]
    }
  ];

  const dest = [];

  const validate_write = function() {
    expect(dest.length).to.equal(1);
    expect(dest[0].key.url).to.equal("http://youtu.be/abcdef");
    expect(dest[0].value.length).to.equal(3);
    return Promise.resolve();
  }

  const validate_fail = function(error) {
    console.log(`Failed with error:  ${error}`);
    expect(true).to.equal(false);
  }

  const done = cleaner.clean_collection(store.getArrayStorageProvider(source), store.getArrayStorageProvider(dest));
  return done.then(() => validate_write());
})

it("test cleaner can drop null", function() {

  const source = [
    { key: { num: 3, url: "http://youtube.com/watch?v=abcdef&a=x"  },
      value: [
        { tweet: { text: "t1", id: "i1", user: "u1" }, expires: 0 },
        { tweet: { text: "t2", id: "i2", user: "u2" }, expires: 0 },
        { tweet: { text: "t3", id: "i3", user: "u3" }, expires: 0 }
      ]
    },
    { key: { num: 2, url: "http://youtube.com/c/notavideo"  },
      value: [
        { tweet: { text: "t4", id: "i4", user: "u4" }, expires: 0 },
        { tweet: { text: "t5", id: "i5", user: "u5" }, expires: 0 }
      ]
    }
  ];

  const dest = [];

  const validate_write = function() {
    console.log("XXXXXX last test");
    console.log(dest);
    expect(dest.length).to.equal(1);
    expect(dest[0].key.url).to.equal("http://youtu.be/abcdef");
    expect(dest[0].value.length).to.equal(3);
    return Promise.resolve();
  }

  const validate_fail = function(error) {
    console.log(`Failed with error:  ${error}`);
    expect(true).to.equal(false);
  }

  const done = cleaner.clean_collection(store.getArrayStorageProvider(source), store.getArrayStorageProvider(dest));
  return done.then(() => validate_write());
})