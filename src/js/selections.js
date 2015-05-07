'use strict';

let STORED_ITEMS = null;
let STORAGE_KEY = 'sel';

class Selections {
  static initialize() {
    if ( STORED_ITEMS ) return;

    chrome.storage.sync.get(null, (stored_items) => {
      STORED_ITEMS = stored_items;
    });
  }

  static getCount(query, id) {
    let a = this.get(query);
    if ( a && a[id] ) {
      return a[id];
    } else {
      return 0;
    }
  }

  static get(query) {
    let key = this._namespace(query);
    return STORED_ITEMS[key];
  }

  static set(query, value) {
    let key = this._namespace(query);
    STORED_ITEMS[key] = value;
  }

  static add(query, id) {
    let obj = this.get(query);

    if ( !obj ) obj = {};
    if ( !obj[id] ) obj[id] = 0;
    obj[id] += 1;

    this.set(query, obj);
    this._save(query, obj);
  }

  static _namespace(query) {
    return [STORAGE_KEY, query].join('.');
  }

  static _save(query, value) {
    let key = this._namespace(query);
    let tmp = {};
    tmp[key] = value;
    chrome.storage.sync.set(tmp);
  }
};

module.exports = Selections;
