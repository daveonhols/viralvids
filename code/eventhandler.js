const moment = require("moment");

function handleTweetEvent(counter, text, id, user, urls, purge_after) {
  const tweet_meta = { text, id, user };
  const expiry_time = moment().add(36, "hours").valueOf();

  urls.forEach(
    url => counter.incr(
      url.expanded_url,
      { tweet: tweet_meta, expires: expiry_time })
  );

  counter.purge(purge_after);
  counter.save();
}

exports.handleTweetEvent = handleTweetEvent;
