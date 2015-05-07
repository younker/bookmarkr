'use strict';

class Meta {
  constructor(results) {
    this.results = results;
  }

  perform(action) {
    // console.log(`perform: ${action}`);
    this[action]();
  }

  moveUp() {
    var item = this.results.selected();
    var prev = this.results.previous(item);

    if ( prev && item != prev ) {
      this.results.unselect(item);
      this.results.select(prev);
    }
  }

  moveDown() {
    var item = this.results.selected();
    var next = this.results.next(item);

    if ( next && item != next ) {
      this.results.unselect(item);
      this.results.select(next);
    }
  }
};

module.exports = Meta;
