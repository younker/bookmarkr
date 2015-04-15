'use strict';

import ResultsDOM from './results_dom';

class Meta {
  constructor(list) {
    this.list = new ResultsDOM(list);
  }

  perform(action) {
    console.log(`perform: ${action}`);
    this[action]();
  }

  openURL() {
    let item = this.list.selected();
    let url = item.url();
    if ( url ) chrome.tabs.create({ url: url });
  }  

  moveUp() {
    var item = this.list.selected();
    var prev = this.list.previous(item);

    if ( prev && item != prev ) {
      this.list.unselect(item);
      this.list.select(prev);
    }
  }

  moveDown() {
    var item = this.list.selected();
    var next = this.list.next(item);

    if ( next && item != next ) {
      this.list.unselect(item);
      this.list.select(next);
    }
  }
};

module.exports = Meta;
