'use strict';

import Keycodes from './keycodes';

module.exports = class Keyboard {
  listen(el) {
    el.onkeydown = Keycodes.onkeydown;
  }
};
