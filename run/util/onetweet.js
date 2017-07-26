const client = require("./../../code/tweetsource/client.js").client;

client.get(
  "statuses/show",
  { id: "883809397977350144" },
  (error, tweet) => {
    if (error) throw error;
    console.log(tweet.entities.urls);  // Tweet body.
  });
