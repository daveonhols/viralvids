
function handle_about(request, response, template, provider) {
  const done =
    provider.getAllCategories()
      .then(categories => response.render(template, { categories }));

  return done;
}

exports.handler = handle_about;
