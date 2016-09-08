(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _keyboard = require('./keyboard');

var _keyboard2 = _interopRequireDefault(_keyboard);

var _meta = require('./meta');

var _meta2 = _interopRequireDefault(_meta);

var _node_path = require('./node_path');

var _node_path2 = _interopRequireDefault(_node_path);

var _payload = require('./payload');

var _payload2 = _interopRequireDefault(_payload);

var _results = require('./results');

var _results2 = _interopRequireDefault(_results);

var _selections = require('./selections');

var _selections2 = _interopRequireDefault(_selections);

var _tree_mapper = require('./tree_mapper');

var _tree_mapper2 = _interopRequireDefault(_tree_mapper);

var _updater = require('./updater');

var _updater2 = _interopRequireDefault(_updater);

(function () {
  var input = document.getElementById('input');
  var resultEl = document.getElementById('results');

  var updater = undefined;
  new Promise(function (resolve, reject) {
    chrome.bookmarks.getTree(function (tree) {
      resolve(new _tree_mapper2['default'](tree));
    });
  }).then(function (treemap) {
    chrome.history.search({ text: '', maxResults: 10 }, function (hx) {
      hx.forEach(function (r) {
        treemap.addNode(new _node_path2['default'](r.id, r.url, [r.url], 'history'));
      });
      updater = new _updater2['default'](treemap, input, resultEl);
    });
  });

  // Pulls some stored data about past selections into memory for use
  // when calculating scores later on.
  _selections2['default'].initialize();

  // Set up the keyboard to listen for key presses and interpret their keycodes
  var keyboard = new _keyboard2['default']();
  keyboard.listen(input);

  // Responsible for selection movement & actions within the result set
  var results = new _results2['default'](resultEl);
  var meta = new _meta2['default'](results);

  chrome.runtime.onMessage.addListener(function (message, sender, _resp) {
    // console.log('received message: ', message);
    switch (message.type) {
      case 'filter':
        updater.filter(input.value);
        break;

      case 'meta':
        meta.perform(message.action);
        break;

      case 'payload':
        _payload2['default'].saveAndOpen(input.value, results.selected());
        break;

      default:
        console.log('unhandled message', message, sender);
    }
  });
})();

},{"./keyboard":3,"./meta":6,"./node_path":7,"./payload":8,"./results":9,"./selections":10,"./tree_mapper":11,"./updater":12}],2:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var DOMElement = (function () {
  _createClass(DOMElement, null, [{
    key: 'for',
    value: function _for(el) {
      return new DOMElement(el);
    }
  }]);

  function DOMElement(el) {
    _classCallCheck(this, DOMElement);

    this.el = el;
  }

  _createClass(DOMElement, [{
    key: 'id',
    value: function id() {
      return this.el.getAttribute('data-id');
    }
  }, {
    key: 'addClass',
    value: function addClass(klass) {
      if (this.hasClass(klass)) return;
      this.el.classList.add(klass);
    }
  }, {
    key: 'hasClass',
    value: function hasClass(klass) {
      return this.el.classList.contains(klass);
    }
  }, {
    key: 'removeClass',
    value: function removeClass(klass) {
      this.el.classList.remove(klass);
    }
  }, {
    key: 'match',
    value: function match(domEl) {
      return this.el == domEl.el;
    }
  }, {
    key: 'url',
    value: function url() {
      var anchor = this.el.querySelector('a');
      if (!anchor) return null;

      return anchor.getAttribute('href');
    }
  }]);

  return DOMElement;
})();

module.exports = DOMElement;

},{}],3:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _keycodes = require('./keycodes');

var _keycodes2 = _interopRequireDefault(_keycodes);

module.exports = (function () {
  function Keyboard() {
    _classCallCheck(this, Keyboard);
  }

  _createClass(Keyboard, [{
    key: 'listen',
    value: function listen(el) {
      el.onkeydown = _keycodes2['default'].onkeydown;
    }
  }]);

  return Keyboard;
})();

},{"./keycodes":4}],4:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Keycodes = (function () {
  function Keycodes() {
    _classCallCheck(this, Keycodes);
  }

  _createClass(Keycodes, null, [{
    key: 'onkeydown',
    value: function onkeydown(e) {
      // Assume any keystroke is meant to further filter results. Any other
      // action must be explicitly handled for here.
      var message = {
        keycode: e.keyCode,
        type: 'filter',
        action: null
      };

      switch (e.keyCode) {
        case 13:
          // enter
          message.type = 'payload';
          break;

        case 17: // ctrl
        case 93:
          // cmd
          message.type = 'noop';
          break;

        case 38:
          // up arrow
          message.type = 'meta';
          message.action = 'moveUp';
          break;

        case 40:
          // down arrow
          message.type = 'meta';
          message.action = 'moveDown';
          break;

        case 78:
          // n
          if (e.ctrlKey) {
            message.type = 'meta';
            message.action = 'moveDown';
          }
          break;

        case 80:
          // p
          if (e.ctrlKey) {
            message.type = 'meta';
            message.action = 'moveUp';
          }
          break;
      };

      console.log('keycodes.js: ', message);

      // Emit message so the proper action can be taken
      if (message.type != 'noop') {
        chrome.runtime.sendMessage(message);
      }
    }
  }]);

  return Keycodes;
})();

;

module.exports = Keycodes;

},{}],5:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _selections = require('./selections');

var _selections2 = _interopRequireDefault(_selections);

var Matcher = (function () {
  function Matcher(string) {
    _classCallCheck(this, Matcher);

    this.string = (string || '').toLowerCase();
    this.previousMatches = {};
  }

  _createClass(Matcher, [{
    key: 'matches',
    value: function matches(query, queryId) {
      if (this.hasMatchData(query)) return this.matchData(query);

      var match = false;
      var locations = [];
      var q = query.toLowerCase();
      var qlen = q.length;
      var j = 0;

      // Was the last character a match?
      var run = false;

      for (var i = 0; i < this.string.length && !match; i++) {
        var strChar = this.charAt(i);
        var queryChar = q[j];

        if (strChar != queryChar) {
          // We failed to match so if we were on a run, it has ended
          run = false;
        } else if (run) {
          // The previous iteration found a match. That means we are currently
          // on a run of matching characters. This is an easy step since we
          // just want to increment the end position for the most recent
          // locData object (in locations)
          var last = locations.pop();
          last[1]++;
          j++;
          locations.push(last);
        } else {
          // First match we have seen in at least 1 full iteration. If the
          // next iteration matches, be sure to append to this locData
          run = true;

          // Think slice(). Location data will be an array where the first
          // value is the index of the first match and the second value is
          // the index of the last match.
          var locData = [i, i + 1];

          // Match the largest chunks of matching text together!
          // Check to see if the last character in the query string matches
          // the last character in this.string. If so, steal that characters
          // location data (from the previous locData found at locations.last)
          // and prepend it to this match data.
          // For example, if we want to match 'dm', doing a "first come, first
          // match" would produce this match (matches are in caps):
          //   '/Dz/a/dMoz'
          // However, we want to match as many consecutive strings as possible,
          // thus the match should be:
          //   '/dz/a/DM'
          var cont = true;
          for (var k = 1; k <= i && cont; k++) {
            var prevStrChar = this.charAt(i - k);
            var prevQueryChar = q[j - k];
            cont = prevStrChar == prevQueryChar;
            if (cont) {
              // query: dm
              // string: fsdlsdmoz
              // prev: [2,3] --> [2,2] --> remove it
              // curr: [6,7] --> [5,7]
              var prevLocData = locations.pop();
              prevLocData[1]--;

              // Only persist the previous location data if it has at least 1 match
              if (prevLocData[0] < prevLocData[1]) locations.push(prevLocData);

              // Now, move the start position back 1 for the current match
              locData[0]--;
            }
          }
          locations.push(locData);
          j++;
        }

        match = j == qlen;
      }

      if (match) {
        this.setMatchData(query, queryId, match, locations);
      }

      return match;
    }
  }, {
    key: 'setMatchData',
    value: function setMatchData(query, queryId, bool, locations) {
      var score = this.calcLocationScore(locations);
      var selectionCount = this.previousSelectionCount(query, queryId);
      switch (true) {
        case selectionCount > 1 && selectionCount < 4:
          score = score * selectionCount;
          break;
        case selectionCount >= 4 && selectionCount < 6:
          score = score * 4;
          break;
        case selectionCount >= 6 && selectionCount < 10:
          score = score * 5;
          break;
        case selectionCount >= 10:
          score = score * 6;
          break;
      }

      this.previousMatches[query] = {
        match: bool,
        locations: locations,
        score: score
      };
    }
  }, {
    key: 'calcLocationScore',
    value: function calcLocationScore(locations) {
      var _this = this;

      // Simply double the length of each match length.
      return locations.map(function (match) {
        var matchLength = Math.abs(match[0] - match[1]);
        var multiplier = matchLength == 1 ? 1 : 2;

        var startsWithSlash = _this.string[match[0]] == '/';
        if (startsWithSlash && matchLength > 1) multiplier += 1;
        return matchLength * multiplier;
      }, this).reduce(function (a, b) {
        return a + b;
      }, 0);
    }
  }, {
    key: 'previousSelectionCount',
    value: function previousSelectionCount(query, queryId) {
      return _selections2['default'].getCount(query, queryId);
    }
  }, {
    key: 'hasMatchData',
    value: function hasMatchData(query) {
      return !!this.matchData(query);
    }
  }, {
    key: 'matchData',
    value: function matchData(query) {
      return this.previousMatches[query];
    }
  }, {
    key: 'charAt',
    value: function charAt(i) {
      return this.string.charAt(i);
    }
  }]);

  return Matcher;
})();

module.exports = Matcher;

},{"./selections":10}],6:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Meta = (function () {
  function Meta(results) {
    _classCallCheck(this, Meta);

    this.results = results;
  }

  _createClass(Meta, [{
    key: 'perform',
    value: function perform(action) {
      // console.log(`perform: ${action}`);
      this[action]();
    }
  }, {
    key: 'moveUp',
    value: function moveUp() {
      var item = this.results.selected();
      var prev = this.results.previous(item);

      if (prev && item != prev) {
        this.results.unselect(item);
        this.results.select(prev);
        prev.el.scrollIntoViewIfNeeded(false);
      } else {
        document.body.scrollIntoViewIfNeeded(true);
      }
    }
  }, {
    key: 'moveDown',
    value: function moveDown() {
      var item = this.results.selected();
      var next = this.results.next(item);

      if (next && item != next) {
        this.results.unselect(item);
        this.results.select(next);
        next.el.scrollIntoViewIfNeeded(false);
      }
    }
  }]);

  return Meta;
})();

;

module.exports = Meta;

},{}],7:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _matcher = require('./matcher');

var _matcher2 = _interopRequireDefault(_matcher);

var PATH_BONUS = 2;

var NodePath = (function () {
  function NodePath(id, url, pieces) {
    var source = arguments.length <= 3 || arguments[3] === undefined ? 'bookmark' : arguments[3];

    _classCallCheck(this, NodePath);

    this.id = id;
    this.url = url;
    this.pieces = pieces;
    this.path = pieces.join('/');
    this.source = source;
    this.matchers = {
      path: new _matcher2['default'](this.path),
      url: new _matcher2['default'](this.url)
    };
  }

  _createClass(NodePath, [{
    key: 'isExcluded',
    value: function isExcluded(exclusions) {
      return exclusions[this.source];
    }
  }, {
    key: 'looseMatch',
    value: function looseMatch(q) {
      var a = this.matchFor('path', q);
      var b = this.matchFor('url', q);
      return a || b;
    }
  }, {
    key: 'matchFor',
    value: function matchFor(type, q) {
      return this.matchers[type].matches(q, this.id);
    }
  }, {
    key: 'matchScore',
    value: function matchScore(q) {
      var a = (this.matchDataFor('path', q) || { score: 0 }).score;

      // Give the path an arbitrary "bonus" so a path match will carry
      // greater weight than a url match.
      if (a > 0) a = a + PATH_BONUS;

      var b = (this.matchDataFor('url', q) || { score: 0 }).score;
      return Math.max(a, b);
    }
  }, {
    key: 'matchDataFor',
    value: function matchDataFor(type, q) {
      return this.matchers[type].matchData(q, this.id);
    }
  }]);

  return NodePath;
})();

module.exports = NodePath;

},{"./matcher":5}],8:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _selections = require('./selections');

var _selections2 = _interopRequireDefault(_selections);

var Payload = (function () {
  function Payload() {
    _classCallCheck(this, Payload);
  }

  _createClass(Payload, null, [{
    key: 'saveAndOpen',
    value: function saveAndOpen(query, selected) {
      var url = selected.url();
      if (!url) return;

      _selections2['default'].add(query, selected.id());
      // chrome.storage.sync.get(null, (i) => { console.log(i); });

      if (url) {
        chrome.tabs.create({ url: url });
      }
    }
  }]);

  return Payload;
})();

;

module.exports = Payload;

},{"./selections":10}],9:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _dom_element = require('./dom_element');

var _dom_element2 = _interopRequireDefault(_dom_element);

var ResultsDOM = (function () {
  function ResultsDOM(container) {
    _classCallCheck(this, ResultsDOM);

    this.container = container;
  }

  _createClass(ResultsDOM, [{
    key: 'items',
    value: function items() {
      return this.container.querySelectorAll('.result.box');
    }
  }, {
    key: 'first',
    value: function first() {
      var item = this.items[0];
      return this.domElOrNull(item);
    }
  }, {
    key: 'last',
    value: function last() {
      var list = this.items();
      var item = list[list.length - 1];
      return this.domElOrNull(item);
    }
  }, {
    key: 'selected',
    value: function selected() {
      var item = this.container.getElementsByClassName('selected')[0];
      return this.domElOrNull(item);
    }
  }, {
    key: 'next',

    // Get the next element in the list relative to the provided domEl
    value: function next(domEl) {
      if (!domEl) return this.first();

      var index = this.indexOf(domEl);
      var items = this.items();
      var next = items[index + 1];
      if (!next) next = this.last();
      return this.domElOrNull(next);
    }
  }, {
    key: 'previous',
    value: function previous(domEl) {
      if (!domEl) return null;

      var index = this.indexOf(domEl);
      var items = this.items();
      var prev = items[index - 1];
      return this.domElOrNull(prev);
    }
  }, {
    key: 'domElOrNull',
    value: function domElOrNull(el) {
      if (!el) return null;
      // el is already a DOMELement
      if (!!(typeof el == 'object' && el['el'])) return el;
      return new _dom_element2['default'](el);
    }
  }, {
    key: 'select',

    // Add 'selected' class to the provided domEl
    value: function select(domEl) {
      if (!domEl) domEl = this.last();
      domEl.addClass('selected');
    }
  }, {
    key: 'unselect',

    // Remove 'selected' class from the provided domEl
    value: function unselect(domEl) {
      if (!domEl) return;
      domEl.removeClass('selected');
    }
  }, {
    key: 'unselectAll',
    value: function unselectAll() {
      var _this = this;

      this.each(function (domEl) {
        _this.unselect(domEl);
      });
    }
  }, {
    key: 'each',
    value: function each(fn) {
      var args = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var bound = fn.bind(this);
      var items = this.items();
      for (var i = 0; i < items.length; i++) {
        bound(new _dom_element2['default'](items[i]), args, i);
      }
    }
  }, {
    key: 'indexOf',
    value: function indexOf(domEl) {
      var items = this.items();
      var index = undefined;
      for (var i = 0; !index && i < items.length; i++) {
        if (domEl.el == items[i]) index = i;
      }
      return index;
    }
  }]);

  return ResultsDOM;
})();

module.exports = ResultsDOM;

},{"./dom_element":2}],10:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var STORED_ITEMS = null;
var STORAGE_KEY = 'sel';

var Selections = (function () {
  function Selections() {
    _classCallCheck(this, Selections);
  }

  _createClass(Selections, null, [{
    key: 'initialize',
    value: function initialize() {
      if (STORED_ITEMS) return;

      chrome.storage.sync.get(null, function (stored_items) {
        STORED_ITEMS = stored_items;
      });
    }
  }, {
    key: 'getCount',
    value: function getCount(query, id) {
      var a = this.get(query);
      if (a && a[id]) {
        return a[id];
      } else {
        return 0;
      }
    }
  }, {
    key: 'get',
    value: function get(query) {
      var key = this._namespace(query);
      return STORED_ITEMS[key];
    }
  }, {
    key: 'set',
    value: function set(query, value) {
      var key = this._namespace(query);
      STORED_ITEMS[key] = value;
    }
  }, {
    key: 'add',
    value: function add(query, id) {
      var obj = this.get(query);

      if (!obj) obj = {};
      if (!obj[id]) obj[id] = 0;
      obj[id] += 1;

      this.set(query, obj);
      this._save(query, obj);
    }
  }, {
    key: '_namespace',
    value: function _namespace(query) {
      return [STORAGE_KEY, query].join('.');
    }
  }, {
    key: '_save',
    value: function _save(query, value) {
      var key = this._namespace(query);
      var tmp = {};
      tmp[key] = value;
      chrome.storage.sync.set(tmp);
    }
  }]);

  return Selections;
})();

;

module.exports = Selections;

},{}],11:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _node_path = require('./node_path');

var _node_path2 = _interopRequireDefault(_node_path);

var TreeMapper = (function () {
  function TreeMapper(tree) {
    _classCallCheck(this, TreeMapper);

    this.tree = tree;
    this.collection = this.parse();
  }

  _createClass(TreeMapper, [{
    key: 'filter',
    value: function filter(query, exclusions) {
      return this.collection.filter(function (nodepath) {
        return !nodepath.isExcluded(exclusions) && nodepath.looseMatch(query);
      }).sort(function (a, b) {
        return b.matchScore(query) - a.matchScore(query);
      });
    }
  }, {
    key: 'parse',
    value: function parse() {
      var _this = this;

      var collection = [];

      var b = function b(node, path) {
        path.push(node.title);

        if (_this.nodeHasChildren(node)) {
          node.children.forEach(function (child) {
            var copy = path.slice(0);
            b(child, copy);
          });
        } else {
          var nodePath = new _node_path2['default'](node.id, node.url, path, 'bookmark');
          collection.push(nodePath);
        }
      };

      b(this.tree[0], []);

      return collection;
    }
  }, {
    key: 'nodeHasChildren',
    value: function nodeHasChildren(node) {
      return node['children'] && node.children.length > 0;
    }
  }, {
    key: 'addNode',
    value: function addNode(node) {
      this.collection.push(node);
    }
  }]);

  return TreeMapper;
})();

module.exports = TreeMapper;

},{"./node_path":7}],12:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Updater = (function () {
  function Updater(treemap, inputEl, resultsEl) {
    _classCallCheck(this, Updater);

    this.treemap = treemap;
    this.inputEl = inputEl;
    this.resultsEl = resultsEl;
  }

  _createClass(Updater, [{
    key: 'filter',
    value: function filter(query) {
      var _exclusions = this.exclusions(query);

      var modq = _exclusions.modq;
      var exclusions = _exclusions.exclusions;

      console.log('exclusions', modq, exclusions);

      this.bookmarks = this.treemap.filter(modq, exclusions);
      this.render(query);
      this.resize();
    }
  }, {
    key: 'exclusions',
    value: function exclusions(query) {
      var modq = query;
      var defaults = {
        history: false,
        bookmark: false
      };

      // The following regex SHOULD capture just the flag. See:
      //   https://regex101.com/r/mG2tH0/3
      var capture = this.inputEl.value.match(/^(h|b):(.*)|(.*)(?:\s)-(h|b)$/);

      if (capture) {
        if (capture[1]) {
          // inclusion notation (b:foo)
          var flag = capture[1];
          modq = capture[2];
          var flag_name = ({
            h: 'history',
            b: 'bookmark'
          })[flag];

          if (flag_name && defaults[flag_name] != undefined) {
            defaults = {
              history: true,
              bookmark: true
            };
            defaults[flag_name] = false;
          }
        } else if (capture[4]) {
          // exclusion notation (foo -b)
          modq = capture[3];
          var flag = capture[4];
          var flag_name = ({
            h: 'history',
            b: 'bookmark'
          })[flag];

          if (flag_name && defaults[flag_name] != undefined) {
            defaults[flag_name] = true;
          }
        }
      }

      return {
        modq: modq,
        exclusions: defaults
      };
    }
  }, {
    key: 'render',
    value: function render(query) {
      var content = Findr.templates.results({
        query: query,
        bookmarks: this.bookmarks
      });
      this.resultsEl.innerHTML = content;
    }
  }, {
    key: 'resize',

    // TODO: This really is just thrown in here and likely does not belong
    // in this class. Clean it up!
    value: function resize() {
      var docHeight = document.documentElement.offsetHeight;
      var contentHeight = document.querySelector('#main').offsetHeight;
      if (contentHeight < docHeight) {
        var h = contentHeight + 'px';
        document.body.style.height = h;
        document.getElementsByTagName('html')[0].style.height = h;
      }
    }
  }]);

  return Updater;
})();

module.exports = Updater;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMveW91bmtlci9wcm9qZWN0cy9maW5kci9zcmMvanMvcG9wdXAuanMiLCIvVXNlcnMveW91bmtlci9wcm9qZWN0cy9maW5kci9zcmMvanMvZG9tX2VsZW1lbnQuanMiLCIvVXNlcnMveW91bmtlci9wcm9qZWN0cy9maW5kci9zcmMvanMva2V5Ym9hcmQuanMiLCIvVXNlcnMveW91bmtlci9wcm9qZWN0cy9maW5kci9zcmMvanMva2V5Y29kZXMuanMiLCIvVXNlcnMveW91bmtlci9wcm9qZWN0cy9maW5kci9zcmMvanMvbWF0Y2hlci5qcyIsIi9Vc2Vycy95b3Vua2VyL3Byb2plY3RzL2ZpbmRyL3NyYy9qcy9tZXRhLmpzIiwiL1VzZXJzL3lvdW5rZXIvcHJvamVjdHMvZmluZHIvc3JjL2pzL25vZGVfcGF0aC5qcyIsIi9Vc2Vycy95b3Vua2VyL3Byb2plY3RzL2ZpbmRyL3NyYy9qcy9wYXlsb2FkLmpzIiwiL1VzZXJzL3lvdW5rZXIvcHJvamVjdHMvZmluZHIvc3JjL2pzL3Jlc3VsdHMuanMiLCIvVXNlcnMveW91bmtlci9wcm9qZWN0cy9maW5kci9zcmMvanMvc2VsZWN0aW9ucy5qcyIsIi9Vc2Vycy95b3Vua2VyL3Byb2plY3RzL2ZpbmRyL3NyYy9qcy90cmVlX21hcHBlci5qcyIsIi9Vc2Vycy95b3Vua2VyL3Byb2plY3RzL2ZpbmRyL3NyYy9qcy91cGRhdGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsWUFBWSxDQUFDOzs7O3dCQUVRLFlBQVk7Ozs7b0JBQ2hCLFFBQVE7Ozs7eUJBQ0osYUFBYTs7Ozt1QkFDZCxXQUFXOzs7O3VCQUNYLFdBQVc7Ozs7MEJBQ1IsY0FBYzs7OzsyQkFDZCxlQUFlOzs7O3VCQUNsQixXQUFXOzs7O0FBRS9CLENBQUMsWUFBTTtBQUNMLE1BQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0MsTUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFbEQsTUFBSSxPQUFPLFlBQUEsQ0FBQztBQUNaLE1BQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBSztBQUMvQixVQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBSztBQUNqQyxhQUFPLENBQUMsNkJBQWUsSUFBSSxDQUFDLENBQUMsQ0FBQztLQUMvQixDQUFDLENBQUM7R0FDSixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsT0FBTyxFQUFLO0FBQ25CLFVBQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFDLEVBQUUsVUFBQyxFQUFFLEVBQUs7QUFDeEQsUUFBRSxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQUMsRUFBSztBQUNoQixlQUFPLENBQUMsT0FBTyxDQUFDLDJCQUFhLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO09BQ2hFLENBQUMsQ0FBQztBQUNILGFBQU8sR0FBRyx5QkFBWSxPQUFPLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ2pELENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQzs7OztBQUlILDBCQUFXLFVBQVUsRUFBRSxDQUFDOzs7QUFHeEIsTUFBSSxRQUFRLEdBQUcsMkJBQWMsQ0FBQztBQUM5QixVQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDOzs7QUFHdkIsTUFBSSxPQUFPLEdBQUcseUJBQVksUUFBUSxDQUFDLENBQUM7QUFDcEMsTUFBSSxJQUFJLEdBQUcsc0JBQVMsT0FBTyxDQUFDLENBQUM7O0FBRTdCLFFBQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxVQUFTLE9BQU8sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFOztBQUVwRSxZQUFTLE9BQU8sQ0FBQyxJQUFJO0FBQ25CLFdBQUssUUFBUTtBQUNYLGVBQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzVCLGNBQU07O0FBQUEsQUFFUixXQUFLLE1BQU07QUFDVCxZQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QixjQUFNOztBQUFBLEFBRVIsV0FBSyxTQUFTO0FBQ1osNkJBQVEsV0FBVyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFDckQsY0FBTTs7QUFBQSxBQUVSO0FBQ0UsZUFBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFBQSxLQUNyRDtHQUNGLENBQUMsQ0FBQztDQUNKLENBQUEsRUFBRyxDQUFDOzs7QUM1REwsWUFBWSxDQUFDOzs7Ozs7SUFFUCxVQUFVO2VBQVYsVUFBVTs7V0FDSixjQUFDLEVBQUUsRUFBRTtBQUNiLGFBQU8sSUFBSSxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDM0I7OztBQUVVLFdBTFAsVUFBVSxDQUtGLEVBQUUsRUFBRTswQkFMWixVQUFVOztBQU1aLFFBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO0dBQ2Q7O2VBUEcsVUFBVTs7V0FTWixjQUFHO0FBQ0gsYUFBTyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUN4Qzs7O1dBRU8sa0JBQUMsS0FBSyxFQUFFO0FBQ2QsVUFBSyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFHLE9BQU87QUFDbkMsVUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzlCOzs7V0FFTyxrQkFBQyxLQUFLLEVBQUU7QUFDZCxhQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUMxQzs7O1dBRVUscUJBQUMsS0FBSyxFQUFFO0FBQ2pCLFVBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNqQzs7O1dBRUksZUFBQyxLQUFLLEVBQUU7QUFDWCxhQUFPLElBQUksQ0FBQyxFQUFFLElBQUksS0FBSyxDQUFDLEVBQUUsQ0FBQztLQUM1Qjs7O1dBRUUsZUFBRztBQUNKLFVBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3hDLFVBQUssQ0FBQyxNQUFNLEVBQUcsT0FBTyxJQUFJLENBQUM7O0FBRTNCLGFBQU8sTUFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUNwQzs7O1NBbkNHLFVBQVU7OztBQXNDaEIsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUM7OztBQ3hDNUIsWUFBWSxDQUFDOzs7Ozs7Ozt3QkFFUSxZQUFZOzs7O0FBRWpDLE1BQU0sQ0FBQyxPQUFPO1dBQVMsUUFBUTswQkFBUixRQUFROzs7ZUFBUixRQUFROztXQUN2QixnQkFBQyxFQUFFLEVBQUU7QUFDVCxRQUFFLENBQUMsU0FBUyxHQUFHLHNCQUFTLFNBQVMsQ0FBQztLQUNuQzs7O1NBSG9CLFFBQVE7SUFJOUIsQ0FBQzs7O0FDUkYsWUFBWSxDQUFDOzs7Ozs7SUFFUCxRQUFRO1dBQVIsUUFBUTswQkFBUixRQUFROzs7ZUFBUixRQUFROztXQUNJLG1CQUFDLENBQUMsRUFBRTs7O0FBR2xCLFVBQUksT0FBTyxHQUFHO0FBQ1osZUFBTyxFQUFFLENBQUMsQ0FBQyxPQUFPO0FBQ2xCLFlBQUksRUFBRSxRQUFRO0FBQ2QsY0FBTSxFQUFFLElBQUk7T0FDYixDQUFDOztBQUVGLGNBQVMsQ0FBQyxDQUFDLE9BQU87QUFDaEIsYUFBSyxFQUFFOztBQUNMLGlCQUFPLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztBQUN6QixnQkFBTTs7QUFBQSxBQUVSLGFBQUssRUFBRSxDQUFDO0FBQ1IsYUFBSyxFQUFFOztBQUNMLGlCQUFPLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztBQUN0QixnQkFBTTs7QUFBQSxBQUVSLGFBQUssRUFBRTs7QUFDTCxpQkFBTyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7QUFDdEIsaUJBQU8sQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO0FBQzFCLGdCQUFNOztBQUFBLEFBRVIsYUFBSyxFQUFFOztBQUNMLGlCQUFPLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztBQUN0QixpQkFBTyxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUM7QUFDNUIsZ0JBQU07O0FBQUEsQUFFUixhQUFLLEVBQUU7O0FBQ0wsY0FBSyxDQUFDLENBQUMsT0FBTyxFQUFHO0FBQ2YsbUJBQU8sQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO0FBQ3RCLG1CQUFPLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQztXQUM3QjtBQUNELGdCQUFNOztBQUFBLEFBRVIsYUFBSyxFQUFFOztBQUNMLGNBQUssQ0FBQyxDQUFDLE9BQU8sRUFBRztBQUNmLG1CQUFPLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztBQUN0QixtQkFBTyxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUM7V0FDM0I7QUFDRCxnQkFBTTtBQUFBLE9BQ1QsQ0FBQzs7QUFFRixhQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQzs7O0FBR3RDLFVBQUssT0FBTyxDQUFDLElBQUksSUFBSSxNQUFNLEVBQUc7QUFDNUIsY0FBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUE7T0FDcEM7S0FDRjs7O1NBbkRHLFFBQVE7OztBQW9EYixDQUFDOztBQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDOzs7Ozs7Ozs7OzswQkN4REgsY0FBYzs7OztJQUUvQixPQUFPO0FBQ0MsV0FEUixPQUFPLENBQ0UsTUFBTSxFQUFFOzBCQURqQixPQUFPOztBQUVULFFBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFBLENBQUUsV0FBVyxFQUFFLENBQUM7QUFDM0MsUUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUM7R0FDM0I7O2VBSkcsT0FBTzs7V0FNSixpQkFBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO0FBQ3RCLFVBQUssSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBRyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRTdELFVBQUksS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNsQixVQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7QUFDbkIsVUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQzVCLFVBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDcEIsVUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDOzs7QUFHVixVQUFJLEdBQUcsR0FBRyxLQUFLLENBQUM7O0FBRWhCLFdBQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN0RCxZQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzdCLFlBQUksU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFckIsWUFBSyxPQUFPLElBQUksU0FBUyxFQUFHOztBQUUxQixhQUFHLEdBQUcsS0FBSyxDQUFDO1NBQ2IsTUFBTSxJQUFLLEdBQUcsRUFBRzs7Ozs7QUFLaEIsY0FBSSxJQUFJLEdBQUcsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzNCLGNBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQ1YsV0FBQyxFQUFFLENBQUM7QUFDSixtQkFBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN0QixNQUFNOzs7QUFHTCxhQUFHLEdBQUcsSUFBSSxDQUFDOzs7OztBQUtYLGNBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7OztBQWF2QixjQUFJLElBQUksR0FBRyxJQUFJLENBQUM7QUFDaEIsZUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDcEMsZ0JBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3JDLGdCQUFJLGFBQWEsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzdCLGdCQUFJLEdBQUcsV0FBVyxJQUFJLGFBQWEsQ0FBQztBQUNwQyxnQkFBSyxJQUFJLEVBQUc7Ozs7O0FBS1Ysa0JBQUksV0FBVyxHQUFHLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNsQyx5QkFBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7OztBQUdqQixrQkFBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7OztBQUduRSxxQkFBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7YUFDZDtXQUNGO0FBQ0QsbUJBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDeEIsV0FBQyxFQUFFLENBQUM7U0FDTDs7QUFFRCxhQUFLLEdBQUssQ0FBQyxJQUFJLElBQUksQUFBRSxDQUFDO09BQ3ZCOztBQUVELFVBQUssS0FBSyxFQUFHO0FBQ1gsWUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztPQUNyRDs7QUFFRCxhQUFPLEtBQUssQ0FBQztLQUNkOzs7V0FFVyxzQkFBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUU7QUFDNUMsVUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzlDLFVBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDakUsY0FBUyxJQUFJO0FBQ1gsYUFBTyxjQUFjLEdBQUcsQ0FBQyxJQUFJLGNBQWMsR0FBRyxDQUFDO0FBQzdDLGVBQUssR0FBRyxLQUFLLEdBQUcsY0FBYyxDQUFDO0FBQy9CLGdCQUFNO0FBQUEsQUFDUixhQUFPLGNBQWMsSUFBSSxDQUFDLElBQUksY0FBYyxHQUFHLENBQUM7QUFDOUMsZUFBSyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDbEIsZ0JBQU07QUFBQSxBQUNSLGFBQU8sY0FBYyxJQUFJLENBQUMsSUFBSSxjQUFjLEdBQUcsRUFBRTtBQUMvQyxlQUFLLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQztBQUNsQixnQkFBTTtBQUFBLEFBQ1IsYUFBTyxjQUFjLElBQUksRUFBRTtBQUN6QixlQUFLLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQztBQUNsQixnQkFBTTtBQUFBLE9BQ1Q7O0FBRUQsVUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsR0FBRztBQUM1QixhQUFLLEVBQUUsSUFBSTtBQUNYLGlCQUFTLEVBQUUsU0FBUztBQUNwQixhQUFLLEVBQUUsS0FBSztPQUNiLENBQUM7S0FDSDs7O1dBRWdCLDJCQUFDLFNBQVMsRUFBRTs7OztBQUUzQixhQUFPLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBQyxLQUFLLEVBQUs7QUFDOUIsWUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEQsWUFBSSxVQUFVLEdBQUcsV0FBVyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUUxQyxZQUFJLGVBQWUsR0FBRyxNQUFLLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUE7QUFDbEQsWUFBSyxlQUFlLElBQUksV0FBVyxHQUFHLENBQUMsRUFBRyxVQUFVLElBQUksQ0FBQyxDQUFDO0FBQzFELGVBQU8sV0FBVyxHQUFHLFVBQVUsQ0FBQztPQUVqQyxFQUFFLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDLEVBQUs7QUFDeEIsZUFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQ2QsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUNQOzs7V0FFcUIsZ0NBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRTtBQUNyQyxhQUFPLHdCQUFXLFFBQVEsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDNUM7OztXQUVXLHNCQUFDLEtBQUssRUFBRTtBQUNsQixhQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ2hDOzs7V0FFUSxtQkFBQyxLQUFLLEVBQUU7QUFDZixhQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDcEM7OztXQUVLLGdCQUFDLENBQUMsRUFBRTtBQUNSLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDOUI7OztTQS9JRyxPQUFPOzs7QUFrSmIsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7OztBQ3BKekIsWUFBWSxDQUFDOzs7Ozs7SUFFUCxJQUFJO0FBQ0csV0FEUCxJQUFJLENBQ0ksT0FBTyxFQUFFOzBCQURqQixJQUFJOztBQUVOLFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0dBQ3hCOztlQUhHLElBQUk7O1dBS0QsaUJBQUMsTUFBTSxFQUFFOztBQUVkLFVBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO0tBQ2hCOzs7V0FFSyxrQkFBRztBQUNQLFVBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDbkMsVUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXZDLFVBQUssSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLEVBQUc7QUFDMUIsWUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDNUIsWUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDMUIsWUFBSSxDQUFDLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUN2QyxNQUFNO0FBQ0wsZ0JBQVEsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDNUM7S0FDRjs7O1dBRU8sb0JBQUc7QUFDVCxVQUFJLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ25DLFVBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVuQyxVQUFLLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxFQUFHO0FBQzFCLFlBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzVCLFlBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzFCLFlBQUksQ0FBQyxFQUFFLENBQUMsc0JBQXNCLENBQUMsS0FBSyxDQUFDLENBQUM7T0FDdkM7S0FDRjs7O1NBaENHLElBQUk7OztBQWlDVCxDQUFDOztBQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDOzs7QUNyQ3RCLFlBQVksQ0FBQzs7Ozs7Ozs7dUJBRU8sV0FBVzs7OztBQUUvQixJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7O0lBRWIsUUFBUTtBQUNELFdBRFAsUUFBUSxDQUNBLEVBQUUsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFxQjtRQUFuQixNQUFNLHlEQUFDLFVBQVU7OzBCQUQxQyxRQUFROztBQUVWLFFBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ2IsUUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDZixRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNyQixRQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDN0IsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsUUFBSSxDQUFDLFFBQVEsR0FBRztBQUNkLFVBQUksRUFBRSx5QkFBWSxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQzVCLFNBQUcsRUFBRSx5QkFBWSxJQUFJLENBQUMsR0FBRyxDQUFDO0tBQzNCLENBQUM7R0FDSDs7ZUFYRyxRQUFROztXQWFGLG9CQUFDLFVBQVUsRUFBRTtBQUNyQixhQUFPLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDaEM7OztXQUVTLG9CQUFDLENBQUMsRUFBRTtBQUNaLFVBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2pDLFVBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2hDLGFBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNmOzs7V0FFTyxrQkFBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFO0FBQ2hCLGFBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUNoRDs7O1dBRVMsb0JBQUMsQ0FBQyxFQUFFO0FBQ1osVUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFDLEtBQUssRUFBQyxDQUFDLEVBQUMsQ0FBQSxDQUFFLEtBQUssQ0FBQzs7OztBQUkxRCxVQUFLLENBQUMsR0FBRyxDQUFDLEVBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxVQUFVLENBQUM7O0FBRWhDLFVBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBQyxLQUFLLEVBQUMsQ0FBQyxFQUFDLENBQUEsQ0FBRSxLQUFLLENBQUM7QUFDekQsYUFBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztLQUN0Qjs7O1dBRVcsc0JBQUMsSUFBSSxFQUFFLENBQUMsRUFBRTtBQUNwQixhQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDbEQ7OztTQXhDRyxRQUFROzs7QUEyQ2QsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUM7OztBQ2pEMUIsWUFBWSxDQUFDOzs7Ozs7OzswQkFFVSxjQUFjOzs7O0lBRS9CLE9BQU87V0FBUCxPQUFPOzBCQUFQLE9BQU87OztlQUFQLE9BQU87O1dBQ08scUJBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRTtBQUNsQyxVQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDekIsVUFBSyxDQUFDLEdBQUcsRUFBRyxPQUFPOztBQUVuQiw4QkFBVyxHQUFHLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDOzs7QUFHckMsVUFBSyxHQUFHLEVBQUc7QUFDVCxjQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO09BQ2xDO0tBQ0Y7OztTQVhHLE9BQU87OztBQVlaLENBQUM7O0FBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7OztBQ2xCekIsWUFBWSxDQUFDOzs7Ozs7OzsyQkFFVSxlQUFlOzs7O0lBRWhDLFVBQVU7QUFDSCxXQURQLFVBQVUsQ0FDRixTQUFTLEVBQUU7MEJBRG5CLFVBQVU7O0FBRVosUUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7R0FDNUI7O2VBSEcsVUFBVTs7V0FLVCxpQkFBRztBQUNOLGFBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztLQUN2RDs7O1dBRUksaUJBQUc7QUFDTixVQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pCLGFBQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUMvQjs7O1dBRUcsZ0JBQUc7QUFDTCxVQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDeEIsVUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDakMsYUFBTyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQy9COzs7V0FFTyxvQkFBRztBQUNULFVBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsc0JBQXNCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEUsYUFBTyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQy9COzs7OztXQUdHLGNBQUMsS0FBSyxFQUFFO0FBQ1YsVUFBSyxDQUFDLEtBQUssRUFBRyxPQUFPLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQzs7QUFFbEMsVUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNoQyxVQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDekIsVUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztBQUM1QixVQUFLLENBQUMsSUFBSSxFQUFHLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDaEMsYUFBTyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQy9COzs7V0FFTyxrQkFBQyxLQUFLLEVBQUU7QUFDZCxVQUFLLENBQUMsS0FBSyxFQUFHLE9BQU8sSUFBSSxDQUFDOztBQUUxQixVQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2hDLFVBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUN6QixVQUFJLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzVCLGFBQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUMvQjs7O1dBRVUscUJBQUMsRUFBRSxFQUFFO0FBQ2QsVUFBSyxDQUFDLEVBQUUsRUFBRyxPQUFPLElBQUksQ0FBQzs7QUFFdkIsVUFBSyxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksUUFBUSxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQSxBQUFDLEVBQUcsT0FBTyxFQUFFLENBQUM7QUFDdkQsYUFBTyw2QkFBZSxFQUFFLENBQUMsQ0FBQztLQUMzQjs7Ozs7V0FHSyxnQkFBQyxLQUFLLEVBQUU7QUFDWixVQUFLLENBQUMsS0FBSyxFQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDbEMsV0FBSyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUM1Qjs7Ozs7V0FHTyxrQkFBQyxLQUFLLEVBQUU7QUFDZCxVQUFLLENBQUMsS0FBSyxFQUFHLE9BQU87QUFDckIsV0FBSyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUMvQjs7O1dBRVUsdUJBQUc7OztBQUNaLFVBQUksQ0FBQyxJQUFJLENBQUMsVUFBQyxLQUFLLEVBQUs7QUFBRSxjQUFLLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtPQUFFLENBQUMsQ0FBQztLQUNoRDs7O1dBRUcsY0FBQyxFQUFFLEVBQVc7VUFBVCxJQUFJLHlEQUFDLEVBQUU7O0FBQ2QsVUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMxQixVQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDekIsV0FBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUc7QUFDdkMsYUFBSyxDQUFDLDZCQUFlLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztPQUMxQztLQUNGOzs7V0FFTSxpQkFBQyxLQUFLLEVBQUU7QUFDYixVQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDekIsVUFBSSxLQUFLLFlBQUEsQ0FBQztBQUNWLFdBQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFHO0FBQ2pELFlBQUssS0FBSyxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQztPQUN2QztBQUNELGFBQU8sS0FBSyxDQUFDO0tBQ2Q7OztTQW5GRyxVQUFVOzs7QUFzRmhCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDOzs7QUMxRjVCLFlBQVksQ0FBQzs7Ozs7O0FBRWIsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDO0FBQ3hCLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQzs7SUFFbEIsVUFBVTtXQUFWLFVBQVU7MEJBQVYsVUFBVTs7O2VBQVYsVUFBVTs7V0FDRyxzQkFBRztBQUNsQixVQUFLLFlBQVksRUFBRyxPQUFPOztBQUUzQixZQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFVBQUMsWUFBWSxFQUFLO0FBQzlDLG9CQUFZLEdBQUcsWUFBWSxDQUFDO09BQzdCLENBQUMsQ0FBQztLQUNKOzs7V0FFYyxrQkFBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO0FBQ3pCLFVBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDeEIsVUFBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFHO0FBQ2hCLGVBQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO09BQ2QsTUFBTTtBQUNMLGVBQU8sQ0FBQyxDQUFDO09BQ1Y7S0FDRjs7O1dBRVMsYUFBQyxLQUFLLEVBQUU7QUFDaEIsVUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNqQyxhQUFPLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUMxQjs7O1dBRVMsYUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQ3ZCLFVBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDakMsa0JBQVksQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7S0FDM0I7OztXQUVTLGFBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRTtBQUNwQixVQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUUxQixVQUFLLENBQUMsR0FBRyxFQUFHLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDckIsVUFBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzVCLFNBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRWIsVUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDckIsVUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7S0FDeEI7OztXQUVnQixvQkFBQyxLQUFLLEVBQUU7QUFDdkIsYUFBTyxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDdkM7OztXQUVXLGVBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtBQUN6QixVQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2pDLFVBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUNiLFNBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7QUFDakIsWUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQzlCOzs7U0FoREcsVUFBVTs7O0FBaURmLENBQUM7O0FBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUM7OztBQ3hENUIsWUFBWSxDQUFDOzs7Ozs7Ozt5QkFFUSxhQUFhOzs7O0lBRTVCLFVBQVU7QUFDSCxXQURQLFVBQVUsQ0FDRixJQUFJLEVBQUU7MEJBRGQsVUFBVTs7QUFFWixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztHQUNoQzs7ZUFKRyxVQUFVOztXQU1SLGdCQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7QUFDeEIsYUFBTyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFDLFFBQVEsRUFBSztBQUMxQyxlQUFPLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxRQUFRLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQ3ZFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3JCLGVBQU8sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQ2xELENBQUMsQ0FBQztLQUNKOzs7V0FFSSxpQkFBRzs7O0FBQ04sVUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDOztBQUVwQixVQUFJLENBQUMsR0FBRyxTQUFKLENBQUMsQ0FBSSxJQUFJLEVBQUUsSUFBSSxFQUFLO0FBQ3RCLFlBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUV0QixZQUFLLE1BQUssZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFHO0FBQ2hDLGNBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSyxFQUFLO0FBQy9CLGdCQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pCLGFBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7V0FDaEIsQ0FBQyxDQUFDO1NBQ0osTUFBTTtBQUNMLGNBQUksUUFBUSxHQUFHLDJCQUFhLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDakUsb0JBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDM0I7T0FDRixDQUFDOztBQUVGLE9BQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDOztBQUVwQixhQUFPLFVBQVUsQ0FBQztLQUNuQjs7O1dBRWMseUJBQUMsSUFBSSxFQUFFO0FBQ3BCLGFBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztLQUNyRDs7O1dBRU0saUJBQUMsSUFBSSxFQUFFO0FBQ1osVUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDNUI7OztTQTFDRyxVQUFVOzs7QUE2Q2hCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDOzs7Ozs7Ozs7SUNqRHRCLE9BQU87QUFDQSxXQURQLE9BQU8sQ0FDQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRTswQkFEckMsT0FBTzs7QUFFVCxRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixRQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztHQUM1Qjs7ZUFMRyxPQUFPOztXQU9MLGdCQUFDLEtBQUssRUFBRTt3QkFDYSxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQzs7VUFBMUMsSUFBSSxlQUFKLElBQUk7VUFBRSxVQUFVLGVBQVYsVUFBVTs7QUFFckIsYUFBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDOztBQUU1QyxVQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN2RCxVQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ25CLFVBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUNmOzs7V0FFUyxvQkFBQyxLQUFLLEVBQUU7QUFDaEIsVUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDO0FBQ2pCLFVBQUksUUFBUSxHQUFHO0FBQ2IsZUFBTyxFQUFFLEtBQUs7QUFDZCxnQkFBUSxFQUFFLEtBQUs7T0FDaEIsQ0FBQzs7OztBQUlGLFVBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFDOztBQUV4RSxVQUFLLE9BQU8sRUFBRztBQUNiLFlBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFHOztBQUNoQixjQUFJLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEIsY0FBSSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixjQUFJLFNBQVMsR0FBRyxDQUFBO0FBQ2QsYUFBQyxFQUFFLFNBQVM7QUFDWixhQUFDLEVBQUUsVUFBVTtZQUNkLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRVIsY0FBSyxTQUFTLElBQUksUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLFNBQVMsRUFBRztBQUNuRCxvQkFBUSxHQUFHO0FBQ1QscUJBQU8sRUFBRSxJQUFJO0FBQ2Isc0JBQVEsRUFBRSxJQUFJO2FBQ2YsQ0FBQztBQUNGLG9CQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsS0FBSyxDQUFDO1dBQzdCO1NBRUYsTUFBTSxJQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRzs7QUFDdkIsY0FBSSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixjQUFJLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEIsY0FBSSxTQUFTLEdBQUcsQ0FBQTtBQUNkLGFBQUMsRUFBRSxTQUFTO0FBQ1osYUFBQyxFQUFFLFVBQVU7WUFDZCxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVSLGNBQUssU0FBUyxJQUFJLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxTQUFTLEVBQUc7QUFDbkQsb0JBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLENBQUM7V0FDNUI7U0FDRjtPQUNGOztBQUVELGFBQU87QUFDTCxZQUFJLEVBQUUsSUFBSTtBQUNWLGtCQUFVLEVBQUUsUUFBUTtPQUNyQixDQUFDO0tBQ0g7OztXQUVLLGdCQUFDLEtBQUssRUFBRTtBQUNaLFVBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO0FBQ3BDLGFBQUssRUFBRSxLQUFLO0FBQ1osaUJBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztPQUMxQixDQUFDLENBQUM7QUFDSCxVQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7S0FDcEM7Ozs7OztXQUlLLGtCQUFHO0FBQ1AsVUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUM7QUFDdEQsVUFBSSxhQUFhLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxZQUFZLENBQUM7QUFDakUsVUFBSyxhQUFhLEdBQUcsU0FBUyxFQUFHO0FBQy9CLFlBQUksQ0FBQyxHQUFNLGFBQWEsT0FBSSxDQUFDO0FBQzdCLGdCQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQy9CLGdCQUFRLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7T0FDM0Q7S0FDRjs7O1NBbkZHLE9BQU87OztBQXNGYixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBLZXlib2FyZCBmcm9tICcuL2tleWJvYXJkJztcbmltcG9ydCBNZXRhIGZyb20gJy4vbWV0YSc7XG5pbXBvcnQgTm9kZVBhdGggZnJvbSAnLi9ub2RlX3BhdGgnO1xuaW1wb3J0IFBheWxvYWQgZnJvbSAnLi9wYXlsb2FkJztcbmltcG9ydCBSZXN1bHRzIGZyb20gJy4vcmVzdWx0cyc7XG5pbXBvcnQgU2VsZWN0aW9ucyBmcm9tICcuL3NlbGVjdGlvbnMnO1xuaW1wb3J0IFRyZWVNYXBwZXIgZnJvbSAnLi90cmVlX21hcHBlcic7XG5pbXBvcnQgVXBkYXRlciBmcm9tICcuL3VwZGF0ZXInO1xuXG4oKCkgPT4ge1xuICB2YXIgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5wdXQnKTtcbiAgdmFyIHJlc3VsdEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3VsdHMnKTtcblxuICBsZXQgdXBkYXRlcjtcbiAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNocm9tZS5ib29rbWFya3MuZ2V0VHJlZSgodHJlZSkgPT4ge1xuICAgICAgcmVzb2x2ZShuZXcgVHJlZU1hcHBlcih0cmVlKSk7XG4gICAgfSk7XG4gIH0pLnRoZW4oKHRyZWVtYXApID0+IHtcbiAgICBjaHJvbWUuaGlzdG9yeS5zZWFyY2goe3RleHQ6ICcnLCBtYXhSZXN1bHRzOiAxMH0sIChoeCkgPT4ge1xuICAgICAgaHguZm9yRWFjaCgocikgPT4ge1xuICAgICAgICB0cmVlbWFwLmFkZE5vZGUobmV3IE5vZGVQYXRoKHIuaWQsIHIudXJsLCBbci51cmxdLCAnaGlzdG9yeScpKTtcbiAgICAgIH0pO1xuICAgICAgdXBkYXRlciA9IG5ldyBVcGRhdGVyKHRyZWVtYXAsIGlucHV0LCByZXN1bHRFbCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIC8vIFB1bGxzIHNvbWUgc3RvcmVkIGRhdGEgYWJvdXQgcGFzdCBzZWxlY3Rpb25zIGludG8gbWVtb3J5IGZvciB1c2VcbiAgLy8gd2hlbiBjYWxjdWxhdGluZyBzY29yZXMgbGF0ZXIgb24uXG4gIFNlbGVjdGlvbnMuaW5pdGlhbGl6ZSgpO1xuXG4gIC8vIFNldCB1cCB0aGUga2V5Ym9hcmQgdG8gbGlzdGVuIGZvciBrZXkgcHJlc3NlcyBhbmQgaW50ZXJwcmV0IHRoZWlyIGtleWNvZGVzXG4gIHZhciBrZXlib2FyZCA9IG5ldyBLZXlib2FyZCgpO1xuICBrZXlib2FyZC5saXN0ZW4oaW5wdXQpO1xuXG4gIC8vIFJlc3BvbnNpYmxlIGZvciBzZWxlY3Rpb24gbW92ZW1lbnQgJiBhY3Rpb25zIHdpdGhpbiB0aGUgcmVzdWx0IHNldFxuICB2YXIgcmVzdWx0cyA9IG5ldyBSZXN1bHRzKHJlc3VsdEVsKTtcbiAgdmFyIG1ldGEgPSBuZXcgTWV0YShyZXN1bHRzKTtcblxuICBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoZnVuY3Rpb24obWVzc2FnZSwgc2VuZGVyLCBfcmVzcCkge1xuICAgIC8vIGNvbnNvbGUubG9nKCdyZWNlaXZlZCBtZXNzYWdlOiAnLCBtZXNzYWdlKTtcbiAgICBzd2l0Y2ggKCBtZXNzYWdlLnR5cGUgKSB7XG4gICAgICBjYXNlICdmaWx0ZXInOlxuICAgICAgICB1cGRhdGVyLmZpbHRlcihpbnB1dC52YWx1ZSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdtZXRhJzpcbiAgICAgICAgbWV0YS5wZXJmb3JtKG1lc3NhZ2UuYWN0aW9uKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3BheWxvYWQnOlxuICAgICAgICBQYXlsb2FkLnNhdmVBbmRPcGVuKGlucHV0LnZhbHVlLCByZXN1bHRzLnNlbGVjdGVkKCkpO1xuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgY29uc29sZS5sb2coJ3VuaGFuZGxlZCBtZXNzYWdlJywgbWVzc2FnZSwgc2VuZGVyKTtcbiAgICB9XG4gIH0pO1xufSkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY2xhc3MgRE9NRWxlbWVudCB7XG4gIHN0YXRpYyBmb3IoZWwpIHtcbiAgICByZXR1cm4gbmV3IERPTUVsZW1lbnQoZWwpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoZWwpIHtcbiAgICB0aGlzLmVsID0gZWw7XG4gIH1cblxuICBpZCgpIHtcbiAgICByZXR1cm4gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnKTtcbiAgfVxuXG4gIGFkZENsYXNzKGtsYXNzKSB7XG4gICAgaWYgKCB0aGlzLmhhc0NsYXNzKGtsYXNzKSApIHJldHVybjtcbiAgICB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoa2xhc3MpO1xuICB9XG5cbiAgaGFzQ2xhc3Moa2xhc3MpIHtcbiAgICByZXR1cm4gdGhpcy5lbC5jbGFzc0xpc3QuY29udGFpbnMoa2xhc3MpO1xuICB9XG5cbiAgcmVtb3ZlQ2xhc3Moa2xhc3MpIHtcbiAgICB0aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUoa2xhc3MpO1xuICB9XG5cbiAgbWF0Y2goZG9tRWwpIHtcbiAgICByZXR1cm4gdGhpcy5lbCA9PSBkb21FbC5lbDtcbiAgfVxuXG4gIHVybCgpIHtcbiAgICBsZXQgYW5jaG9yID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yKCdhJyk7XG4gICAgaWYgKCAhYW5jaG9yICkgcmV0dXJuIG51bGw7XG5cbiAgICByZXR1cm4gYW5jaG9yLmdldEF0dHJpYnV0ZSgnaHJlZicpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRE9NRWxlbWVudDtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IEtleWNvZGVzIGZyb20gJy4va2V5Y29kZXMnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEtleWJvYXJkIHtcbiAgbGlzdGVuKGVsKSB7XG4gICAgZWwub25rZXlkb3duID0gS2V5Y29kZXMub25rZXlkb3duO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBLZXljb2RlcyB7XG4gIHN0YXRpYyBvbmtleWRvd24oZSkge1xuICAgIC8vIEFzc3VtZSBhbnkga2V5c3Ryb2tlIGlzIG1lYW50IHRvIGZ1cnRoZXIgZmlsdGVyIHJlc3VsdHMuIEFueSBvdGhlclxuICAgIC8vIGFjdGlvbiBtdXN0IGJlIGV4cGxpY2l0bHkgaGFuZGxlZCBmb3IgaGVyZS5cbiAgICB2YXIgbWVzc2FnZSA9IHtcbiAgICAgIGtleWNvZGU6IGUua2V5Q29kZSxcbiAgICAgIHR5cGU6ICdmaWx0ZXInLFxuICAgICAgYWN0aW9uOiBudWxsXG4gICAgfTtcblxuICAgIHN3aXRjaCAoIGUua2V5Q29kZSApIHtcbiAgICAgIGNhc2UgMTM6IC8vIGVudGVyXG4gICAgICAgIG1lc3NhZ2UudHlwZSA9ICdwYXlsb2FkJztcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgMTc6IC8vIGN0cmxcbiAgICAgIGNhc2UgOTM6IC8vIGNtZFxuICAgICAgICBtZXNzYWdlLnR5cGUgPSAnbm9vcCc7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIDM4OiAvLyB1cCBhcnJvd1xuICAgICAgICBtZXNzYWdlLnR5cGUgPSAnbWV0YSc7XG4gICAgICAgIG1lc3NhZ2UuYWN0aW9uID0gJ21vdmVVcCc7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIDQwOiAvLyBkb3duIGFycm93XG4gICAgICAgIG1lc3NhZ2UudHlwZSA9ICdtZXRhJztcbiAgICAgICAgbWVzc2FnZS5hY3Rpb24gPSAnbW92ZURvd24nO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSA3ODogLy8gblxuICAgICAgICBpZiAoIGUuY3RybEtleSApIHtcbiAgICAgICAgICBtZXNzYWdlLnR5cGUgPSAnbWV0YSc7XG4gICAgICAgICAgbWVzc2FnZS5hY3Rpb24gPSAnbW92ZURvd24nO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIDgwOiAvLyBwXG4gICAgICAgIGlmICggZS5jdHJsS2V5ICkge1xuICAgICAgICAgIG1lc3NhZ2UudHlwZSA9ICdtZXRhJztcbiAgICAgICAgICBtZXNzYWdlLmFjdGlvbiA9ICdtb3ZlVXAnO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH07XG5cbiAgICBjb25zb2xlLmxvZygna2V5Y29kZXMuanM6ICcsIG1lc3NhZ2UpO1xuXG4gICAgLy8gRW1pdCBtZXNzYWdlIHNvIHRoZSBwcm9wZXIgYWN0aW9uIGNhbiBiZSB0YWtlblxuICAgIGlmICggbWVzc2FnZS50eXBlICE9ICdub29wJyApIHtcbiAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKG1lc3NhZ2UpXG4gICAgfVxuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEtleWNvZGVzO1xuIiwiaW1wb3J0IFNlbGVjdGlvbnMgZnJvbSAnLi9zZWxlY3Rpb25zJztcblxuY2xhc3MgTWF0Y2hlciB7XG4gIGNvbnN0cnVjdG9yIChzdHJpbmcpIHtcbiAgICB0aGlzLnN0cmluZyA9IChzdHJpbmcgfHwgJycpLnRvTG93ZXJDYXNlKCk7XG4gICAgdGhpcy5wcmV2aW91c01hdGNoZXMgPSB7fTtcbiAgfVxuXG4gIG1hdGNoZXMocXVlcnksIHF1ZXJ5SWQpIHtcbiAgICBpZiAoIHRoaXMuaGFzTWF0Y2hEYXRhKHF1ZXJ5KSApIHJldHVybiB0aGlzLm1hdGNoRGF0YShxdWVyeSk7XG5cbiAgICBsZXQgbWF0Y2ggPSBmYWxzZTtcbiAgICBsZXQgbG9jYXRpb25zID0gW107XG4gICAgbGV0IHEgPSBxdWVyeS50b0xvd2VyQ2FzZSgpO1xuICAgIGxldCBxbGVuID0gcS5sZW5ndGg7XG4gICAgbGV0IGogPSAwO1xuXG4gICAgLy8gV2FzIHRoZSBsYXN0IGNoYXJhY3RlciBhIG1hdGNoP1xuICAgIGxldCBydW4gPSBmYWxzZTtcblxuICAgIGZvciAoIGxldCBpID0gMDsgaSA8IHRoaXMuc3RyaW5nLmxlbmd0aCAmJiAhbWF0Y2g7IGkrKykge1xuICAgICAgdmFyIHN0ckNoYXIgPSB0aGlzLmNoYXJBdChpKTtcbiAgICAgIHZhciBxdWVyeUNoYXIgPSBxW2pdO1xuXG4gICAgICBpZiAoIHN0ckNoYXIgIT0gcXVlcnlDaGFyICkge1xuICAgICAgICAvLyBXZSBmYWlsZWQgdG8gbWF0Y2ggc28gaWYgd2Ugd2VyZSBvbiBhIHJ1biwgaXQgaGFzIGVuZGVkXG4gICAgICAgIHJ1biA9IGZhbHNlO1xuICAgICAgfSBlbHNlIGlmICggcnVuICkge1xuICAgICAgICAvLyBUaGUgcHJldmlvdXMgaXRlcmF0aW9uIGZvdW5kIGEgbWF0Y2guIFRoYXQgbWVhbnMgd2UgYXJlIGN1cnJlbnRseVxuICAgICAgICAvLyBvbiBhIHJ1biBvZiBtYXRjaGluZyBjaGFyYWN0ZXJzLiBUaGlzIGlzIGFuIGVhc3kgc3RlcCBzaW5jZSB3ZVxuICAgICAgICAvLyBqdXN0IHdhbnQgdG8gaW5jcmVtZW50IHRoZSBlbmQgcG9zaXRpb24gZm9yIHRoZSBtb3N0IHJlY2VudFxuICAgICAgICAvLyBsb2NEYXRhIG9iamVjdCAoaW4gbG9jYXRpb25zKVxuICAgICAgICB2YXIgbGFzdCA9IGxvY2F0aW9ucy5wb3AoKTtcbiAgICAgICAgbGFzdFsxXSsrO1xuICAgICAgICBqKys7XG4gICAgICAgIGxvY2F0aW9ucy5wdXNoKGxhc3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gRmlyc3QgbWF0Y2ggd2UgaGF2ZSBzZWVuIGluIGF0IGxlYXN0IDEgZnVsbCBpdGVyYXRpb24uIElmIHRoZVxuICAgICAgICAvLyBuZXh0IGl0ZXJhdGlvbiBtYXRjaGVzLCBiZSBzdXJlIHRvIGFwcGVuZCB0byB0aGlzIGxvY0RhdGFcbiAgICAgICAgcnVuID0gdHJ1ZTtcblxuICAgICAgICAvLyBUaGluayBzbGljZSgpLiBMb2NhdGlvbiBkYXRhIHdpbGwgYmUgYW4gYXJyYXkgd2hlcmUgdGhlIGZpcnN0XG4gICAgICAgIC8vIHZhbHVlIGlzIHRoZSBpbmRleCBvZiB0aGUgZmlyc3QgbWF0Y2ggYW5kIHRoZSBzZWNvbmQgdmFsdWUgaXNcbiAgICAgICAgLy8gdGhlIGluZGV4IG9mIHRoZSBsYXN0IG1hdGNoLlxuICAgICAgICBsZXQgbG9jRGF0YSA9IFtpLCBpKzFdO1xuXG4gICAgICAgIC8vIE1hdGNoIHRoZSBsYXJnZXN0IGNodW5rcyBvZiBtYXRjaGluZyB0ZXh0IHRvZ2V0aGVyIVxuICAgICAgICAvLyBDaGVjayB0byBzZWUgaWYgdGhlIGxhc3QgY2hhcmFjdGVyIGluIHRoZSBxdWVyeSBzdHJpbmcgbWF0Y2hlc1xuICAgICAgICAvLyB0aGUgbGFzdCBjaGFyYWN0ZXIgaW4gdGhpcy5zdHJpbmcuIElmIHNvLCBzdGVhbCB0aGF0IGNoYXJhY3RlcnNcbiAgICAgICAgLy8gbG9jYXRpb24gZGF0YSAoZnJvbSB0aGUgcHJldmlvdXMgbG9jRGF0YSBmb3VuZCBhdCBsb2NhdGlvbnMubGFzdClcbiAgICAgICAgLy8gYW5kIHByZXBlbmQgaXQgdG8gdGhpcyBtYXRjaCBkYXRhLlxuICAgICAgICAvLyBGb3IgZXhhbXBsZSwgaWYgd2Ugd2FudCB0byBtYXRjaCAnZG0nLCBkb2luZyBhIFwiZmlyc3QgY29tZSwgZmlyc3RcbiAgICAgICAgLy8gbWF0Y2hcIiB3b3VsZCBwcm9kdWNlIHRoaXMgbWF0Y2ggKG1hdGNoZXMgYXJlIGluIGNhcHMpOlxuICAgICAgICAvLyAgICcvRHovYS9kTW96J1xuICAgICAgICAvLyBIb3dldmVyLCB3ZSB3YW50IHRvIG1hdGNoIGFzIG1hbnkgY29uc2VjdXRpdmUgc3RyaW5ncyBhcyBwb3NzaWJsZSxcbiAgICAgICAgLy8gdGh1cyB0aGUgbWF0Y2ggc2hvdWxkIGJlOlxuICAgICAgICAvLyAgICcvZHovYS9ETSdcbiAgICAgICAgbGV0IGNvbnQgPSB0cnVlO1xuICAgICAgICBmb3IgKCB2YXIgayA9IDE7IGsgPD0gaSAmJiBjb250OyBrKyspIHtcbiAgICAgICAgICBsZXQgcHJldlN0ckNoYXIgPSB0aGlzLmNoYXJBdChpIC0gayk7XG4gICAgICAgICAgbGV0IHByZXZRdWVyeUNoYXIgPSBxW2ogLSBrXTtcbiAgICAgICAgICBjb250ID0gcHJldlN0ckNoYXIgPT0gcHJldlF1ZXJ5Q2hhcjtcbiAgICAgICAgICBpZiAoIGNvbnQgKSB7XG4gICAgICAgICAgICAvLyBxdWVyeTogZG1cbiAgICAgICAgICAgIC8vIHN0cmluZzogZnNkbHNkbW96XG4gICAgICAgICAgICAvLyBwcmV2OiBbMiwzXSAtLT4gWzIsMl0gLS0+IHJlbW92ZSBpdFxuICAgICAgICAgICAgLy8gY3VycjogWzYsN10gLS0+IFs1LDddXG4gICAgICAgICAgICBsZXQgcHJldkxvY0RhdGEgPSBsb2NhdGlvbnMucG9wKCk7XG4gICAgICAgICAgICBwcmV2TG9jRGF0YVsxXS0tO1xuXG4gICAgICAgICAgICAvLyBPbmx5IHBlcnNpc3QgdGhlIHByZXZpb3VzIGxvY2F0aW9uIGRhdGEgaWYgaXQgaGFzIGF0IGxlYXN0IDEgbWF0Y2hcbiAgICAgICAgICAgIGlmICggcHJldkxvY0RhdGFbMF0gPCBwcmV2TG9jRGF0YVsxXSApIGxvY2F0aW9ucy5wdXNoKHByZXZMb2NEYXRhKTtcblxuICAgICAgICAgICAgLy8gTm93LCBtb3ZlIHRoZSBzdGFydCBwb3NpdGlvbiBiYWNrIDEgZm9yIHRoZSBjdXJyZW50IG1hdGNoXG4gICAgICAgICAgICBsb2NEYXRhWzBdLS07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxvY2F0aW9ucy5wdXNoKGxvY0RhdGEpO1xuICAgICAgICBqKys7XG4gICAgICB9XG5cbiAgICAgIG1hdGNoID0gKCBqID09IHFsZW4gKTtcbiAgICB9XG5cbiAgICBpZiAoIG1hdGNoICkge1xuICAgICAgdGhpcy5zZXRNYXRjaERhdGEocXVlcnksIHF1ZXJ5SWQsIG1hdGNoLCBsb2NhdGlvbnMpO1xuICAgIH1cblxuICAgIHJldHVybiBtYXRjaDtcbiAgfVxuXG4gIHNldE1hdGNoRGF0YShxdWVyeSwgcXVlcnlJZCwgYm9vbCwgbG9jYXRpb25zKSB7XG4gICAgbGV0IHNjb3JlID0gdGhpcy5jYWxjTG9jYXRpb25TY29yZShsb2NhdGlvbnMpO1xuICAgIGxldCBzZWxlY3Rpb25Db3VudCA9IHRoaXMucHJldmlvdXNTZWxlY3Rpb25Db3VudChxdWVyeSwgcXVlcnlJZCk7XG4gICAgc3dpdGNoICggdHJ1ZSApIHtcbiAgICAgIGNhc2UgKCBzZWxlY3Rpb25Db3VudCA+IDEgJiYgc2VsZWN0aW9uQ291bnQgPCA0ICk6XG4gICAgICAgIHNjb3JlID0gc2NvcmUgKiBzZWxlY3Rpb25Db3VudDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICggc2VsZWN0aW9uQ291bnQgPj0gNCAmJiBzZWxlY3Rpb25Db3VudCA8IDYgKTpcbiAgICAgICAgc2NvcmUgPSBzY29yZSAqIDQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAoIHNlbGVjdGlvbkNvdW50ID49IDYgJiYgc2VsZWN0aW9uQ291bnQgPCAxMCApOlxuICAgICAgICBzY29yZSA9IHNjb3JlICogNTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICggc2VsZWN0aW9uQ291bnQgPj0gMTAgKTpcbiAgICAgICAgc2NvcmUgPSBzY29yZSAqIDY7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHRoaXMucHJldmlvdXNNYXRjaGVzW3F1ZXJ5XSA9IHtcbiAgICAgIG1hdGNoOiBib29sLFxuICAgICAgbG9jYXRpb25zOiBsb2NhdGlvbnMsXG4gICAgICBzY29yZTogc2NvcmVcbiAgICB9O1xuICB9XG5cbiAgY2FsY0xvY2F0aW9uU2NvcmUobG9jYXRpb25zKSB7XG4gICAgLy8gU2ltcGx5IGRvdWJsZSB0aGUgbGVuZ3RoIG9mIGVhY2ggbWF0Y2ggbGVuZ3RoLlxuICAgIHJldHVybiBsb2NhdGlvbnMubWFwKChtYXRjaCkgPT4ge1xuICAgICAgbGV0IG1hdGNoTGVuZ3RoID0gTWF0aC5hYnMobWF0Y2hbMF0gLSBtYXRjaFsxXSk7XG4gICAgICBsZXQgbXVsdGlwbGllciA9IG1hdGNoTGVuZ3RoID09IDEgPyAxIDogMjtcblxuICAgICAgbGV0IHN0YXJ0c1dpdGhTbGFzaCA9IHRoaXMuc3RyaW5nW21hdGNoWzBdXSA9PSAnLydcbiAgICAgIGlmICggc3RhcnRzV2l0aFNsYXNoICYmIG1hdGNoTGVuZ3RoID4gMSApIG11bHRpcGxpZXIgKz0gMTtcbiAgICAgIHJldHVybiBtYXRjaExlbmd0aCAqIG11bHRpcGxpZXI7XG5cbiAgICB9LCB0aGlzKS5yZWR1Y2UoKGEsIGIpID0+IHtcbiAgICAgIHJldHVybiBhICsgYjtcbiAgICB9LCAwKTtcbiAgfVxuXG4gIHByZXZpb3VzU2VsZWN0aW9uQ291bnQocXVlcnksIHF1ZXJ5SWQpIHtcbiAgICByZXR1cm4gU2VsZWN0aW9ucy5nZXRDb3VudChxdWVyeSwgcXVlcnlJZCk7XG4gIH1cblxuICBoYXNNYXRjaERhdGEocXVlcnkpIHtcbiAgICByZXR1cm4gISF0aGlzLm1hdGNoRGF0YShxdWVyeSk7XG4gIH1cblxuICBtYXRjaERhdGEocXVlcnkpIHtcbiAgICByZXR1cm4gdGhpcy5wcmV2aW91c01hdGNoZXNbcXVlcnldO1xuICB9XG5cbiAgY2hhckF0KGkpIHtcbiAgICByZXR1cm4gdGhpcy5zdHJpbmcuY2hhckF0KGkpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWF0Y2hlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuY2xhc3MgTWV0YSB7XG4gIGNvbnN0cnVjdG9yKHJlc3VsdHMpIHtcbiAgICB0aGlzLnJlc3VsdHMgPSByZXN1bHRzO1xuICB9XG5cbiAgcGVyZm9ybShhY3Rpb24pIHtcbiAgICAvLyBjb25zb2xlLmxvZyhgcGVyZm9ybTogJHthY3Rpb259YCk7XG4gICAgdGhpc1thY3Rpb25dKCk7XG4gIH1cblxuICBtb3ZlVXAoKSB7XG4gICAgdmFyIGl0ZW0gPSB0aGlzLnJlc3VsdHMuc2VsZWN0ZWQoKTtcbiAgICB2YXIgcHJldiA9IHRoaXMucmVzdWx0cy5wcmV2aW91cyhpdGVtKTtcblxuICAgIGlmICggcHJldiAmJiBpdGVtICE9IHByZXYgKSB7XG4gICAgICB0aGlzLnJlc3VsdHMudW5zZWxlY3QoaXRlbSk7XG4gICAgICB0aGlzLnJlc3VsdHMuc2VsZWN0KHByZXYpO1xuICAgICAgcHJldi5lbC5zY3JvbGxJbnRvVmlld0lmTmVlZGVkKGZhbHNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZG9jdW1lbnQuYm9keS5zY3JvbGxJbnRvVmlld0lmTmVlZGVkKHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIG1vdmVEb3duKCkge1xuICAgIHZhciBpdGVtID0gdGhpcy5yZXN1bHRzLnNlbGVjdGVkKCk7XG4gICAgdmFyIG5leHQgPSB0aGlzLnJlc3VsdHMubmV4dChpdGVtKTtcblxuICAgIGlmICggbmV4dCAmJiBpdGVtICE9IG5leHQgKSB7XG4gICAgICB0aGlzLnJlc3VsdHMudW5zZWxlY3QoaXRlbSk7XG4gICAgICB0aGlzLnJlc3VsdHMuc2VsZWN0KG5leHQpO1xuICAgICAgbmV4dC5lbC5zY3JvbGxJbnRvVmlld0lmTmVlZGVkKGZhbHNlKTtcbiAgICB9XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTWV0YTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IE1hdGNoZXIgZnJvbSAnLi9tYXRjaGVyJztcblxubGV0IFBBVEhfQk9OVVMgPSAyO1xuXG5jbGFzcyBOb2RlUGF0aCB7XG4gIGNvbnN0cnVjdG9yKGlkLCB1cmwsIHBpZWNlcywgc291cmNlPSdib29rbWFyaycpIHtcbiAgICB0aGlzLmlkID0gaWQ7XG4gICAgdGhpcy51cmwgPSB1cmw7XG4gICAgdGhpcy5waWVjZXMgPSBwaWVjZXM7XG4gICAgdGhpcy5wYXRoID0gcGllY2VzLmpvaW4oJy8nKTtcbiAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICB0aGlzLm1hdGNoZXJzID0ge1xuICAgICAgcGF0aDogbmV3IE1hdGNoZXIodGhpcy5wYXRoKSxcbiAgICAgIHVybDogbmV3IE1hdGNoZXIodGhpcy51cmwpXG4gICAgfTtcbiAgfVxuXG4gIGlzRXhjbHVkZWQoZXhjbHVzaW9ucykge1xuICAgIHJldHVybiBleGNsdXNpb25zW3RoaXMuc291cmNlXTtcbiAgfVxuXG4gIGxvb3NlTWF0Y2gocSkge1xuICAgIHZhciBhID0gdGhpcy5tYXRjaEZvcigncGF0aCcsIHEpO1xuICAgIHZhciBiID0gdGhpcy5tYXRjaEZvcigndXJsJywgcSk7XG4gICAgcmV0dXJuIGEgfHwgYjtcbiAgfVxuXG4gIG1hdGNoRm9yKHR5cGUsIHEpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaGVyc1t0eXBlXS5tYXRjaGVzKHEsIHRoaXMuaWQpO1xuICB9XG5cbiAgbWF0Y2hTY29yZShxKSB7XG4gICAgdmFyIGEgPSAodGhpcy5tYXRjaERhdGFGb3IoJ3BhdGgnLCBxKSB8fCB7c2NvcmU6MH0pLnNjb3JlO1xuXG4gICAgLy8gR2l2ZSB0aGUgcGF0aCBhbiBhcmJpdHJhcnkgXCJib251c1wiIHNvIGEgcGF0aCBtYXRjaCB3aWxsIGNhcnJ5XG4gICAgLy8gZ3JlYXRlciB3ZWlnaHQgdGhhbiBhIHVybCBtYXRjaC5cbiAgICBpZiAoIGEgPiAwICkgYSA9IGEgKyBQQVRIX0JPTlVTO1xuXG4gICAgdmFyIGIgPSAodGhpcy5tYXRjaERhdGFGb3IoJ3VybCcsIHEpIHx8IHtzY29yZTowfSkuc2NvcmU7XG4gICAgcmV0dXJuIE1hdGgubWF4KGEsYik7XG4gIH1cblxuICBtYXRjaERhdGFGb3IodHlwZSwgcSkge1xuICAgIHJldHVybiB0aGlzLm1hdGNoZXJzW3R5cGVdLm1hdGNoRGF0YShxLCB0aGlzLmlkKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5vZGVQYXRoO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgU2VsZWN0aW9ucyBmcm9tICcuL3NlbGVjdGlvbnMnO1xuXG5jbGFzcyBQYXlsb2FkIHtcbiAgc3RhdGljIHNhdmVBbmRPcGVuKHF1ZXJ5LCBzZWxlY3RlZCkge1xuICAgIGxldCB1cmwgPSBzZWxlY3RlZC51cmwoKTtcbiAgICBpZiAoICF1cmwgKSByZXR1cm47XG5cbiAgICBTZWxlY3Rpb25zLmFkZChxdWVyeSwgc2VsZWN0ZWQuaWQoKSk7XG4gICAgLy8gY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQobnVsbCwgKGkpID0+IHsgY29uc29sZS5sb2coaSk7IH0pO1xuXG4gICAgaWYgKCB1cmwgKSB7XG4gICAgICBjaHJvbWUudGFicy5jcmVhdGUoeyB1cmw6IHVybCB9KTtcbiAgICB9XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUGF5bG9hZDtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IERPTUVsZW1lbnQgZnJvbSAnLi9kb21fZWxlbWVudCc7XG5cbmNsYXNzIFJlc3VsdHNET00ge1xuICBjb25zdHJ1Y3Rvcihjb250YWluZXIpIHtcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgfVxuXG4gIGl0ZW1zKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcucmVzdWx0LmJveCcpO1xuICB9XG5cbiAgZmlyc3QoKSB7XG4gICAgbGV0IGl0ZW0gPSB0aGlzLml0ZW1zWzBdO1xuICAgIHJldHVybiB0aGlzLmRvbUVsT3JOdWxsKGl0ZW0pO1xuICB9XG5cbiAgbGFzdCgpIHtcbiAgICBsZXQgbGlzdCA9IHRoaXMuaXRlbXMoKTtcbiAgICBsZXQgaXRlbSA9IGxpc3RbbGlzdC5sZW5ndGggLSAxXTtcbiAgICByZXR1cm4gdGhpcy5kb21FbE9yTnVsbChpdGVtKTtcbiAgfVxuXG4gIHNlbGVjdGVkKCkge1xuICAgIGxldCBpdGVtID0gdGhpcy5jb250YWluZXIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc2VsZWN0ZWQnKVswXTtcbiAgICByZXR1cm4gdGhpcy5kb21FbE9yTnVsbChpdGVtKTtcbiAgfVxuXG4gIC8vIEdldCB0aGUgbmV4dCBlbGVtZW50IGluIHRoZSBsaXN0IHJlbGF0aXZlIHRvIHRoZSBwcm92aWRlZCBkb21FbFxuICBuZXh0KGRvbUVsKSB7XG4gICAgaWYgKCAhZG9tRWwgKSByZXR1cm4gdGhpcy5maXJzdCgpO1xuXG4gICAgbGV0IGluZGV4ID0gdGhpcy5pbmRleE9mKGRvbUVsKTtcbiAgICBsZXQgaXRlbXMgPSB0aGlzLml0ZW1zKCk7XG4gICAgbGV0IG5leHQgPSBpdGVtc1tpbmRleCArIDFdO1xuICAgIGlmICggIW5leHQgKSBuZXh0ID0gdGhpcy5sYXN0KCk7XG4gICAgcmV0dXJuIHRoaXMuZG9tRWxPck51bGwobmV4dCk7XG4gIH1cblxuICBwcmV2aW91cyhkb21FbCkge1xuICAgIGlmICggIWRvbUVsICkgcmV0dXJuIG51bGw7XG5cbiAgICBsZXQgaW5kZXggPSB0aGlzLmluZGV4T2YoZG9tRWwpO1xuICAgIGxldCBpdGVtcyA9IHRoaXMuaXRlbXMoKTtcbiAgICBsZXQgcHJldiA9IGl0ZW1zW2luZGV4IC0gMV07XG4gICAgcmV0dXJuIHRoaXMuZG9tRWxPck51bGwocHJldik7XG4gIH1cblxuICBkb21FbE9yTnVsbChlbCkge1xuICAgIGlmICggIWVsICkgcmV0dXJuIG51bGw7XG4gICAgLy8gZWwgaXMgYWxyZWFkeSBhIERPTUVMZW1lbnRcbiAgICBpZiAoICEhKHR5cGVvZiBlbCA9PSAnb2JqZWN0JyAmJiBlbFsnZWwnXSkgKSByZXR1cm4gZWw7XG4gICAgcmV0dXJuIG5ldyBET01FbGVtZW50KGVsKTtcbiAgfVxuXG4gIC8vIEFkZCAnc2VsZWN0ZWQnIGNsYXNzIHRvIHRoZSBwcm92aWRlZCBkb21FbFxuICBzZWxlY3QoZG9tRWwpIHtcbiAgICBpZiAoICFkb21FbCApIGRvbUVsID0gdGhpcy5sYXN0KCk7XG4gICAgZG9tRWwuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gIH1cblxuICAvLyBSZW1vdmUgJ3NlbGVjdGVkJyBjbGFzcyBmcm9tIHRoZSBwcm92aWRlZCBkb21FbFxuICB1bnNlbGVjdChkb21FbCkge1xuICAgIGlmICggIWRvbUVsICkgcmV0dXJuO1xuICAgIGRvbUVsLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuICB9XG5cbiAgdW5zZWxlY3RBbGwoKSB7XG4gICAgdGhpcy5lYWNoKChkb21FbCkgPT4geyB0aGlzLnVuc2VsZWN0KGRvbUVsKSB9KTtcbiAgfVxuXG4gIGVhY2goZm4sIGFyZ3M9e30pIHtcbiAgICBsZXQgYm91bmQgPSBmbi5iaW5kKHRoaXMpO1xuICAgIGxldCBpdGVtcyA9IHRoaXMuaXRlbXMoKTtcbiAgICBmb3IgKCBsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKyApIHtcbiAgICAgIGJvdW5kKG5ldyBET01FbGVtZW50KGl0ZW1zW2ldKSwgYXJncywgaSk7XG4gICAgfVxuICB9XG5cbiAgaW5kZXhPZihkb21FbCkge1xuICAgIGxldCBpdGVtcyA9IHRoaXMuaXRlbXMoKTtcbiAgICBsZXQgaW5kZXg7XG4gICAgZm9yICggbGV0IGkgPSAwOyAhaW5kZXggJiYgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrICkge1xuICAgICAgaWYgKCBkb21FbC5lbCA9PSBpdGVtc1tpXSApIGluZGV4ID0gaTtcbiAgICB9XG4gICAgcmV0dXJuIGluZGV4O1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVzdWx0c0RPTTtcbiIsIid1c2Ugc3RyaWN0JztcblxubGV0IFNUT1JFRF9JVEVNUyA9IG51bGw7XG5sZXQgU1RPUkFHRV9LRVkgPSAnc2VsJztcblxuY2xhc3MgU2VsZWN0aW9ucyB7XG4gIHN0YXRpYyBpbml0aWFsaXplKCkge1xuICAgIGlmICggU1RPUkVEX0lURU1TICkgcmV0dXJuO1xuXG4gICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQobnVsbCwgKHN0b3JlZF9pdGVtcykgPT4ge1xuICAgICAgU1RPUkVEX0lURU1TID0gc3RvcmVkX2l0ZW1zO1xuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIGdldENvdW50KHF1ZXJ5LCBpZCkge1xuICAgIGxldCBhID0gdGhpcy5nZXQocXVlcnkpO1xuICAgIGlmICggYSAmJiBhW2lkXSApIHtcbiAgICAgIHJldHVybiBhW2lkXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGdldChxdWVyeSkge1xuICAgIGxldCBrZXkgPSB0aGlzLl9uYW1lc3BhY2UocXVlcnkpO1xuICAgIHJldHVybiBTVE9SRURfSVRFTVNba2V5XTtcbiAgfVxuXG4gIHN0YXRpYyBzZXQocXVlcnksIHZhbHVlKSB7XG4gICAgbGV0IGtleSA9IHRoaXMuX25hbWVzcGFjZShxdWVyeSk7XG4gICAgU1RPUkVEX0lURU1TW2tleV0gPSB2YWx1ZTtcbiAgfVxuXG4gIHN0YXRpYyBhZGQocXVlcnksIGlkKSB7XG4gICAgbGV0IG9iaiA9IHRoaXMuZ2V0KHF1ZXJ5KTtcblxuICAgIGlmICggIW9iaiApIG9iaiA9IHt9O1xuICAgIGlmICggIW9ialtpZF0gKSBvYmpbaWRdID0gMDtcbiAgICBvYmpbaWRdICs9IDE7XG5cbiAgICB0aGlzLnNldChxdWVyeSwgb2JqKTtcbiAgICB0aGlzLl9zYXZlKHF1ZXJ5LCBvYmopO1xuICB9XG5cbiAgc3RhdGljIF9uYW1lc3BhY2UocXVlcnkpIHtcbiAgICByZXR1cm4gW1NUT1JBR0VfS0VZLCBxdWVyeV0uam9pbignLicpO1xuICB9XG5cbiAgc3RhdGljIF9zYXZlKHF1ZXJ5LCB2YWx1ZSkge1xuICAgIGxldCBrZXkgPSB0aGlzLl9uYW1lc3BhY2UocXVlcnkpO1xuICAgIGxldCB0bXAgPSB7fTtcbiAgICB0bXBba2V5XSA9IHZhbHVlO1xuICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHRtcCk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU2VsZWN0aW9ucztcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IE5vZGVQYXRoIGZyb20gJy4vbm9kZV9wYXRoJztcblxuY2xhc3MgVHJlZU1hcHBlciB7XG4gIGNvbnN0cnVjdG9yKHRyZWUpIHtcbiAgICB0aGlzLnRyZWUgPSB0cmVlO1xuICAgIHRoaXMuY29sbGVjdGlvbiA9IHRoaXMucGFyc2UoKTtcbiAgfVxuXG4gIGZpbHRlcihxdWVyeSwgZXhjbHVzaW9ucykge1xuICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb24uZmlsdGVyKChub2RlcGF0aCkgPT4ge1xuICAgICAgcmV0dXJuICFub2RlcGF0aC5pc0V4Y2x1ZGVkKGV4Y2x1c2lvbnMpICYmIG5vZGVwYXRoLmxvb3NlTWF0Y2gocXVlcnkpO1xuICAgIH0pLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgcmV0dXJuIGIubWF0Y2hTY29yZShxdWVyeSkgLSBhLm1hdGNoU2NvcmUocXVlcnkpO1xuICAgIH0pO1xuICB9XG5cbiAgcGFyc2UoKSB7XG4gICAgbGV0IGNvbGxlY3Rpb24gPSBbXTtcblxuICAgIHZhciBiID0gKG5vZGUsIHBhdGgpID0+IHtcbiAgICAgIHBhdGgucHVzaChub2RlLnRpdGxlKTtcblxuICAgICAgaWYgKCB0aGlzLm5vZGVIYXNDaGlsZHJlbihub2RlKSApIHtcbiAgICAgICAgbm9kZS5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgICAgIGxldCBjb3B5ID0gcGF0aC5zbGljZSgwKTtcbiAgICAgICAgICBiKGNoaWxkLCBjb3B5KTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgbm9kZVBhdGggPSBuZXcgTm9kZVBhdGgobm9kZS5pZCwgbm9kZS51cmwsIHBhdGgsICdib29rbWFyaycpO1xuICAgICAgICBjb2xsZWN0aW9uLnB1c2gobm9kZVBhdGgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBiKHRoaXMudHJlZVswXSwgW10pO1xuXG4gICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gIH1cblxuICBub2RlSGFzQ2hpbGRyZW4obm9kZSkge1xuICAgIHJldHVybiBub2RlWydjaGlsZHJlbiddICYmIG5vZGUuY2hpbGRyZW4ubGVuZ3RoID4gMDtcbiAgfVxuXG4gIGFkZE5vZGUobm9kZSkge1xuICAgIHRoaXMuY29sbGVjdGlvbi5wdXNoKG5vZGUpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVHJlZU1hcHBlcjtcbiIsImNsYXNzIFVwZGF0ZXIge1xuICBjb25zdHJ1Y3Rvcih0cmVlbWFwLCBpbnB1dEVsLCByZXN1bHRzRWwpIHtcbiAgICB0aGlzLnRyZWVtYXAgPSB0cmVlbWFwO1xuICAgIHRoaXMuaW5wdXRFbCA9IGlucHV0RWw7XG4gICAgdGhpcy5yZXN1bHRzRWwgPSByZXN1bHRzRWw7XG4gIH1cblxuICBmaWx0ZXIocXVlcnkpIHtcbiAgICBsZXQge21vZHEsIGV4Y2x1c2lvbnN9ID0gdGhpcy5leGNsdXNpb25zKHF1ZXJ5KTtcblxuICAgIGNvbnNvbGUubG9nKCdleGNsdXNpb25zJywgbW9kcSwgZXhjbHVzaW9ucyk7XG5cbiAgICB0aGlzLmJvb2ttYXJrcyA9IHRoaXMudHJlZW1hcC5maWx0ZXIobW9kcSwgZXhjbHVzaW9ucyk7XG4gICAgdGhpcy5yZW5kZXIocXVlcnkpO1xuICAgIHRoaXMucmVzaXplKCk7XG4gIH1cblxuICBleGNsdXNpb25zKHF1ZXJ5KSB7XG4gICAgbGV0IG1vZHEgPSBxdWVyeTtcbiAgICBsZXQgZGVmYXVsdHMgPSB7XG4gICAgICBoaXN0b3J5OiBmYWxzZSxcbiAgICAgIGJvb2ttYXJrOiBmYWxzZVxuICAgIH07XG5cbiAgICAvLyBUaGUgZm9sbG93aW5nIHJlZ2V4IFNIT1VMRCBjYXB0dXJlIGp1c3QgdGhlIGZsYWcuIFNlZTpcbiAgICAvLyAgIGh0dHBzOi8vcmVnZXgxMDEuY29tL3IvbUcydEgwLzNcbiAgICBsZXQgY2FwdHVyZSA9IHRoaXMuaW5wdXRFbC52YWx1ZS5tYXRjaCgvXihofGIpOiguKil8KC4qKSg/OlxccyktKGh8YikkLyk7XG5cbiAgICBpZiAoIGNhcHR1cmUgKSB7XG4gICAgICBpZiAoIGNhcHR1cmVbMV0gKSB7IC8vIGluY2x1c2lvbiBub3RhdGlvbiAoYjpmb28pXG4gICAgICAgIGxldCBmbGFnID0gY2FwdHVyZVsxXTtcbiAgICAgICAgbW9kcSA9IGNhcHR1cmVbMl07XG4gICAgICAgIGxldCBmbGFnX25hbWUgPSB7XG4gICAgICAgICAgaDogJ2hpc3RvcnknLFxuICAgICAgICAgIGI6ICdib29rbWFyaydcbiAgICAgICAgfVtmbGFnXTtcblxuICAgICAgICBpZiAoIGZsYWdfbmFtZSAmJiBkZWZhdWx0c1tmbGFnX25hbWVdICE9IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgIGhpc3Rvcnk6IHRydWUsXG4gICAgICAgICAgICBib29rbWFyazogdHJ1ZVxuICAgICAgICAgIH07XG4gICAgICAgICAgZGVmYXVsdHNbZmxhZ19uYW1lXSA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgIH0gZWxzZSBpZiAoIGNhcHR1cmVbNF0gKSB7IC8vIGV4Y2x1c2lvbiBub3RhdGlvbiAoZm9vIC1iKVxuICAgICAgICBtb2RxID0gY2FwdHVyZVszXTtcbiAgICAgICAgbGV0IGZsYWcgPSBjYXB0dXJlWzRdO1xuICAgICAgICBsZXQgZmxhZ19uYW1lID0ge1xuICAgICAgICAgIGg6ICdoaXN0b3J5JyxcbiAgICAgICAgICBiOiAnYm9va21hcmsnXG4gICAgICAgIH1bZmxhZ107XG5cbiAgICAgICAgaWYgKCBmbGFnX25hbWUgJiYgZGVmYXVsdHNbZmxhZ19uYW1lXSAhPSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgZGVmYXVsdHNbZmxhZ19uYW1lXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgbW9kcTogbW9kcSxcbiAgICAgIGV4Y2x1c2lvbnM6IGRlZmF1bHRzXG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcihxdWVyeSkge1xuICAgIGxldCBjb250ZW50ID0gRmluZHIudGVtcGxhdGVzLnJlc3VsdHMoe1xuICAgICAgcXVlcnk6IHF1ZXJ5LFxuICAgICAgYm9va21hcmtzOiB0aGlzLmJvb2ttYXJrc1xuICAgIH0pO1xuICAgIHRoaXMucmVzdWx0c0VsLmlubmVySFRNTCA9IGNvbnRlbnQ7XG4gIH1cblxuICAvLyBUT0RPOiBUaGlzIHJlYWxseSBpcyBqdXN0IHRocm93biBpbiBoZXJlIGFuZCBsaWtlbHkgZG9lcyBub3QgYmVsb25nXG4gIC8vIGluIHRoaXMgY2xhc3MuIENsZWFuIGl0IHVwIVxuICByZXNpemUoKSB7XG4gICAgbGV0IGRvY0hlaWdodCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgbGV0IGNvbnRlbnRIZWlnaHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWFpbicpLm9mZnNldEhlaWdodDtcbiAgICBpZiAoIGNvbnRlbnRIZWlnaHQgPCBkb2NIZWlnaHQgKSB7XG4gICAgICB2YXIgaCA9IGAke2NvbnRlbnRIZWlnaHR9cHhgO1xuICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5oZWlnaHQgPSBoO1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJodG1sXCIpWzBdLnN0eWxlLmhlaWdodCA9IGg7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVXBkYXRlcjtcbiJdfQ==
