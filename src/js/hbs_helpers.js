Handlebars.registerHelper('child_count', function() {
  return this.children ? this.children.length : 0;
});

Handlebars.registerHelper('highlight', function(type, query) {
  var string = this[type];
  if ( !string ) return '';

  var matchData = this.matchDataFor(type, query);
  if ( !matchData ) return string;

  // Details simply holds an array, the values of which are the locations
  // of the characters that matched a given query
  var indices = matchData.locations;

  // Sort in desc order so the introduction of span elements do not throw
  // off the indices
  var desc = indices.sort(function(a, b) { return b - a; });

  for ( var j in desc ) {
    var i = desc[j];
    string = string.substr(0, i) + '<span class="em">'+ string.substr(i, 1) +'</span>' + string.substr(i + 1);
  }

  return string;
});
