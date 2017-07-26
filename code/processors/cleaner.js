const Url = require("url");

const Counter = require("../helpers/urlcounter.js").OCounter;

function store(cleaned_storage_provider, cleaned_tweets) {
  const done =
    cleaned_storage_provider
      .clearAll()
      .then(() => cleaned_storage_provider.insertAll(cleaned_tweets));

  return done;
}

function is_youtube(t_url) {
  const url = Url.parse(t_url, true);
  const result = ["youtube.com", "youtu.be"].some(pattern => url.hostname.endsWith(pattern));

  if (!result) {
    console.log(`discarding: ${t_url}`);
  }
  return result;
}

function get_video_id(url) {
  let video_id = "";

  const parse_url = Url.parse(url, true);

  if (parse_url.hostname.endsWith("youtube.com")) {
    video_id = parse_url.query.v;
  }
  if (parse_url.hostname.endsWith("youtu.be")) {
    video_id = parse_url.pathname.slice(1);
  }
  if (video_id === null || video_id === undefined) {
    return null;
  }
  return video_id;
}

function enrich(item) {
  const enriched = item;
  const video_id = get_video_id(item.key.url);
  enriched.key.id = video_id;
  return enriched;
}

function deduplicate(collection) {
  const counter = new Counter([]);

  // since we have made urls canonical, we may end up with less entries but larger counts.
  // leverage existing counter code to rebuild structure.
  collection.forEach(
    item => item.value.forEach(
      tweet_meta => counter.incr(item.key.url, tweet_meta)));

  return counter.flatten().map(item => enrich(item));
}

function canonical_url(url) {
  const base = "http://youtu.be/";
  const video_id = get_video_id(url);
  if (video_id === null) {
    return null;
  }
  return base + video_id;
}

function canonical(tweet) {
  return { key: { url: canonical_url(tweet.key.url), num: tweet.key.num }, value: tweet.value };
}

function process_tweets(tweets) {
  return deduplicate(
    tweets
      .filter(tweet => is_youtube(tweet.key.url))
      .map(tweet => canonical(tweet))
  );
}

function clean_collection(raw_storage_provider, cleaned_storage_provider) {
  const done =
    raw_storage_provider
      .getAll()
      .then(tweets => store(cleaned_storage_provider, process_tweets(tweets)));

  return done;
}

exports.clean_collection = clean_collection;
