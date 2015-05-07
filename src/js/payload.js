'use strict';

import Selections from './selections';

class Payload {
  static saveAndOpen(query, selected) {
    let url = selected.url();
    if ( !url ) return;

    Selections.add(query, selected.id());
    // chrome.storage.sync.get(null, (i) => { console.log(i); });

    if ( url ) {
      chrome.tabs.create({ url: url });
    }
  }
};

module.exports = Payload;
