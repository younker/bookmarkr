'use strict';

class Keycodes {
  static onkeydown(e) {
    // Assume the action is an update. Any other type of action must be
    // handled for here.
    var message = {
      keycode: e.keyCode,
      type: 'update',
      action: null
    };

    switch ( e.keyCode ) {
      case 13: // enter
        message.type = 'meta';
        message.action = 'trigger';
        break;

      case 17: // ctrl
      case 93: // cmd
        message.type = 'noop';
        break;

      case 37: // left arrow
        message.type = 'meta';
        message.action = 'moveBack';
        break;

      case 38: // up arrow
        message.type = 'meta';
        message.action = 'moveUp';
        break;

      case 39: // right arrow
        message.type = 'meta';
        message.action = 'moveForward';
        break;

      case 40: // down arrow
        message.type = 'meta';
        message.action = 'moveDown';
        break;

      case 66: // b
        if ( e.ctrlKey ) {
          message.type = 'meta';
          message.action = 'moveBack';
          break;
        }

      case 70: // f
        if ( e.ctrlKey ) {
          message.type = 'meta';
          message.action = 'moveForward';
        }
        break;

      case 71: // g
        if ( e.ctrlKey ) {
          message.type = 'meta';
          message.action = 'cancel';
        }
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
        console.log(e.keyCode);
    };

    // Emit message so the proper action can be taken
    if ( message.type != 'noop' ) {
      chrome.runtime.sendMessage(message) 
    }
  }
};

module.exports = Keycodes;
