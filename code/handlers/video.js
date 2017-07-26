
function handle_video(request, response, template, provider) {
  const category = request.params.category;
  const video_id = request.params.id;

  const done =
    provider.getVideoTweets(category, video_id)
      .then(tweets =>
        provider.getAllCategories()
          .then(categories => response.render(template, { video_id, tweets, categories })));

  return done;
}

exports.handler = handle_video;
