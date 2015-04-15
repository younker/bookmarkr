'use strict';

class Keycodes {
  static onkeydown(e) {
    // Assume any keystroke is meant to further filter results. Any other
    // action must be explicitly handled for here.
    var message = {
      keycode: e.keyCode,
      type: 'filter',
      action: null
    };

    switch ( e.keyCode ) {
      case 13: // enter
        message.type = 'meta';
        message.action = 'openURL';
        break;

      case 17: // ctrl
      case 93: // cmd
        message.type = 'noop';
        break;

      case 38: // up arrow
        message.type = 'meta';
        message.action = 'moveUp';
        break;

      case 40: // down arrow
        message.type = 'meta';
        message.action = 'moveDown';
        break;

      case 78: // n
        if ( e.ctrlKey ) {
          message.type = 'meta';
          message.action = 'moveDown';
        }
        break;

      case 80: // p
        if ( e.ctrlKey ) {
          message.type = 'meta';
          message.action = 'moveUp';
        }
        break;

      default:
        console.log(`keyCode: ${e.keyCode}`);
    };

    // Emit message so the proper action can be taken
    if ( message.type != 'noop' ) {
      chrome.runtime.sendMessage(message) 
    }
  }
};

module.exports = Keycodes;
