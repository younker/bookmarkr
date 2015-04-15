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

  // If we have a url, open it up. Otherwise, treat as a dir and open
  // it up (showing children of the node)
  dispatch() {
    let sel = this.list.selected();

    if ( sel.hasData('url') ) {
      this.openURL();
    } else if ( sel.hasData('id') ) {
      this.getChildren();
    } else {
      console.log('dispatch: no action taken');
    }
  }

  openURL() {
    let sel = this.list.selected();
    let url = sel.data('url');
    if ( url ) chrome.tabs.create({ url: url });
  }  

  moveUp() {
    var sel = this.list.selected();
    var prev = this.list.previous(sel);

    if ( prev && sel != prev ) {
      this.list.unselect(sel);
      this.list.select(prev);
    }
  }

  moveDown() {
    var sel = this.list.selected();
    var next = this.list.next(sel);

    if ( next && sel != next ) {
      this.list.unselect(sel);
      this.list.select(next);
    }
  }

  getChildren() {
    let sel = this.list.selected();

    if ( sel.data('id') ) {
      chrome.runtime.sendMessage({
        type: 'getChildren',
        id: sel.data('id')
      });
    }
  }

  getParent() {
    console.log('getParent');
  }

};

module.exports = Meta;
