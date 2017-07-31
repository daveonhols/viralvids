
function handle_category(request, response, template, provider) {
  const category = request.params.category;

  const done =
    provider.getTopForCategory(10, category)
      .then(videos =>
        provider.getAllCategories()
          .then(categories => response.render(template, { videos, categories, category })));

  return done;
}

exports.handler = handle_category;
