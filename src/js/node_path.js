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
    var a = this.matchFor('path', q);
    var b = this.matchFor('url', q);
    return a || b;
  }

  matchFor(type, q) {
    return this.matchers[type].matches(q);
  }

  matchScore(q) {
    var a = (this.matchDataFor('path', q) || {score:0}).score;
    var b = (this.matchDataFor('url', q) || {score:0}).score;
    return Math.max(a,b);
  }

  matchDataFor(type, q) {
    return this.matchers[type].matchData(q);
  }
}

module.exports = NodePath;
