'use strict';

import Matcher from './matcher';

let PATH_BONUS = 2;

class NodePath {
  constructor(id, url, pieces, source='bookmark') {
    this.id = id;
    this.url = url;
    this.pieces = pieces;
    this.path = pieces.join('/');
    this.source = source;
    this.matchers = {
      path: new Matcher(this.path),
      url: new Matcher(this.url)
    };
  }

  isExcluded(exclusions) {
    return exclusions[this.source];
  }

  looseMatch(q) {
    var a = this.matchFor('path', q);
    var b = this.matchFor('url', q);
    return a || b;
  }

  matchFor(type, q) {
    return this.matchers[type].matches(q, this.id);
  }

  matchScore(q) {
    var a = (this.matchDataFor('path', q) || {score:0}).score;

    // Give the path an arbitrary "bonus" so a path match will carry
    // greater weight than a url match.
    if ( a > 0 ) a = a + PATH_BONUS;

    var b = (this.matchDataFor('url', q) || {score:0}).score;
    return Math.max(a,b);
  }

  matchDataFor(type, q) {
    return this.matchers[type].matchData(q, this.id);
  }
}

module.exports = NodePath;
