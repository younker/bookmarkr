'use strict';

class DOMElement {
  static for(el) {
    return new DOMElement(el);
  }

  constructor(el) {
    this.el = el;
  }

  addClass(klass) {
    if ( this.hasClass(klass) ) return;
    this.el.classList.add(klass);
  }

  hasClass(klass) {
    return this.el.classList.contains(klass);
  }

  removeClass(klass) {
    this.el.classList.remove(klass);
  }

  match(domEl) {
    return this.el == domEl.el;
  }

  url() {
    let anchor = this.el.querySelector('a');
    if ( !anchor ) return null;

    return anchor.getAttribute('href');
  }
}

module.exports = DOMElement;
