var H5P = H5P || {};

H5P.Text = function (options, contentId) {
  this.options = options;
  this.contentId = contentId;
};

H5P.Text.prototype.attach = function ($container) {
  $container.html(this.options.text || "<p>No text content available.</p>");
};
