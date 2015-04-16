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
  var desc = indices.sort(function(a, b) { return b[0] - a[0]; });

  for ( var j in desc ) {
    var start = desc[j][0];
    var end = desc[j][1];
    string = string.substr(0, start) + '<span class="em">'+ string.slice(start, end) +'</span>' + string.substr(end);
  }

  return string;
});
