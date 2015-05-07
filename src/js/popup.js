'use strict';

import Keyboard from './keyboard';
import Meta from './meta';
import NodePath from './node_path';
import Payload from './payload';
import Results from './results';
import Selections from './selections';
import TreeMapper from './tree_mapper';
import Updater from './updater';

(() => {
  var input = document.getElementById('input');
  var resultEl = document.getElementById('results');

  let updater;
  new Promise((resolve, reject) => {
    chrome.bookmarks.getTree((tree) => {
      resolve(new TreeMapper(tree));
    });
  }).then((treemap) => {
    chrome.history.search({text: '', maxResults: 10}, (hx) => {
      hx.forEach((r) => {
        treemap.addNode(new NodePath(r.id, r.url, [r.url], 'history'));
      });
      updater = new Updater(treemap, input, resultEl);
    });
  });

  // Pulls some stored data about past selections into memory for use
  // when calculating scores later on.
  Selections.initialize();

  // Set up the keyboard to listen for key presses and interpret their keycodes
  var keyboard = new Keyboard();
  keyboard.listen(input);

  // Responsible for selection movement & actions within the result set
  var results = new Results(resultEl);
  var meta = new Meta(results);

  chrome.runtime.onMessage.addListener(function(message, sender, _resp) {
    // console.log('received message: ', message);
    switch ( message.type ) {
      case 'filter':
        updater.filter(input.value);
        break;

      case 'meta':
        meta.perform(message.action);
        break;

      case 'payload':
        Payload.saveAndOpen(input.value, results.selected());
        break;

      default:
        console.log('unhandled message', message, sender);
    }
  });
})();
