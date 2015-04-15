'use strict';

import Matcher from './matcher';

class NodePath {
  constructor(url, pieces) {
    this.url = url;
    this.pieces = pieces;
    this.path = pieces.join('/');
    this.matchers = {
      path: new Matcher(this.path),
      url: new Matcher(this.url)
    };
  }

  looseMatch(q) {
    // Match both so we have match locations (for the UI)
    var a = this.matchFor('path', q);

    // TODO: Until we get a better matcher algo or add a checkbox
    // option to the UI to only search on titles, matching on
    // urls just introduces too much noise since the matching
    // is so imprecise
    var b = false; // this.matchFor('url', q);
    return a || b;
  }

  matchDataFor(type, q) {
    return this.matchers[type].matchData(q);
  }

  matchFor(type, q) {
    return this.matchers[type].matches(q);
  }
}

module.exports = NodePath;
