'use strict';

import Meta from './meta';
import Keyboard from './keyboard';
import Updater from './updater';

(() => {
  // Set up the keyboard to listen for key presses and interpret their keycodes
  var keyboard = new Keyboard();
  var input = document.getElementById('input');
  keyboard.listen(input);

  // Handle any list updates that are needed
  var results = document.getElementById('results');
  var updater = new Updater(input, results);

  // Responsible for selection movement, action cancellations, etc
  var meta = new Meta(results);

  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log('onMessage', message);
    switch ( message.type ) {
      case 'getChildren':
        updater.getChildren(message.id);
        break;

      case 'update':
        var query = input.value
        updater.search(query);
        break;

      case 'meta':
        meta.perform(message.action);
        break;

      default:
        console.log('unhandled message', message, sender);
    }
  });
})();
