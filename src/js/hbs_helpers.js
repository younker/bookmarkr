Handlebars.registerHelper('child_count', function() {
  return this.children ? this.children.length : 0;
});

Handlebars.registerHelper('highlight', function(type) {
  var x = this[type];

  // What can we do if this type of value does not exist?
  if ( !x ) return '';

  if ( this.matcher ) {
    // Details simply holds an array, the values of which are the locations
    // of the characters that matched a given query
    var indices = (this.matcher.details || {})[type] || [];

    // Sort in desc order so the introduction of span elements do not throw
    // off the indices
    var desc = indices.sort(function(a, b) { return b - a; });

    for ( var j in desc ) {
      var i = desc[j];
      x = x.substr(0, i) + '<span class="em">'+ x.substr(i, 1) +'</span>' + x.substr(i + 1);
    }
  }

  return x;
});
