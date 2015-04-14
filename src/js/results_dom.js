'use strict';

import DOMElement from './dom_element';

class ResultsDOM {
  constructor(container) {
    this.container = container;
  }

  first() {
    let f = this.container.getElementsByTagName('li')[0];
    return this.domElOrNull(f);
  }

  last() {
    let list = this.container.getElementsByTagName('li');
    let last = list[list.length - 1];
    return this.domElOrNull(last);
  }

  selected() {
    let sel = this.container.getElementsByClassName('selected')[0];
    return this.domElOrNull(sel);
  }

  // Get the next element in the list relative to the provided domEl
  next(domEl) {
    if ( !domEl ) return this.first();

    let index = this.indexOf(domEl);
    let items = this.container.getElementsByTagName('li'); 
    let next = items[index + 1];
    if ( !next ) next = this.last();
    return this.domElOrNull(next);
  }

  previous(domEl) {
    if ( !domEl ) return null;

    let index = this.indexOf(domEl);
    let items = this.container.getElementsByTagName('li'); 
    let prev = items[index - 1];
    return this.domElOrNull(prev);
  }

  domElOrNull(el) {
    if ( !el ) return null;
    // el is already a DOMELement
    if ( !!(typeof el == 'object' && el['el']) ) return el;
    return new DOMElement(el);
  }

  // Add 'selected' class to the provided domEl
  select(domEl) {
    if ( !domEl ) domEl = this.last();
    domEl.addClass('selected');
  }

  // Remove 'selected' class from the provided domEl
  unselect(domEl) {
    if ( !domEl ) return;
    domEl.removeClass('selected');
  }

  unselectAll() {
    this.each((domEl) => { this.unselect(domEl) });
  }

  each(fn, args={}) {
    let bound = fn.bind(this);
    let items = this.container.getElementsByTagName('li');
    for ( let i = 0; i < items.length; i++ ) {
      bound(new DOMElement(items[i]), args, i);
    }
  }

  indexOf(domEl) {
    let items = this.container.getElementsByTagName('li');
    let index;
    for ( let i = 0; !index && i < items.length; i++ ) {
      if ( domEl.el == items[i] ) index = i;
    }
    return index;
  }
}

module.exports = ResultsDOM;
