'use strict';

import Meta from './meta';
import Keyboard from './keyboard';
import Updater from './updater';
import TreeMapper from './tree_mapper';

(() => {
  var input = document.getElementById('input');
  var results = document.getElementById('results');

  // Handle any list updates that are needed
  let updater;
  var tree = chrome.bookmarks.getTree((tree) => {
    let treemap = new TreeMapper(tree);
    updater = new Updater(treemap, input, results);
  });

  // Set up the keyboard to listen for key presses and interpret their keycodes
  var keyboard = new Keyboard();
  keyboard.listen(input);

  // Responsible for selection movement & actions within the result set
  var meta = new Meta(results);

  chrome.runtime.onMessage.addListener(function(message, sender, _resp) {
    console.log('onMessage', message);
    switch ( message.type ) {
      case 'filter':
        updater.filter(input.value);
        break;

      case 'meta':
        meta.perform(message.action);
        break;

      default:
        console.log('unhandled message', message, sender);
    }
  });
})();
