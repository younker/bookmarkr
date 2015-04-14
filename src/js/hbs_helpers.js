Handlebars.registerHelper('child_count', function() {
  return this.children ? this.children.length : 0;
});
