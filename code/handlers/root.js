
function handle_root(request, response, template, provider) {
  const overall_top = provider.getTopOverall(10);
  const categories = provider.getAllCategories();

  const done =
    Promise.all([overall_top, categories])
      .then(ready => response.render(template, { videos: ready[0], categories: ready[1] }));

  return done;
}

exports.handler = handle_root;
