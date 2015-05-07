(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _Keyboard = require('./keyboard');

var _Keyboard2 = _interopRequireWildcard(_Keyboard);

var _Meta = require('./meta');

var _Meta2 = _interopRequireWildcard(_Meta);

var _NodePath = require('./node_path');

var _NodePath2 = _interopRequireWildcard(_NodePath);

var _Payload = require('./payload');

var _Payload2 = _interopRequireWildcard(_Payload);

var _Results = require('./results');

var _Results2 = _interopRequireWildcard(_Results);

var _Selections = require('./selections');

var _Selections2 = _interopRequireWildcard(_Selections);

var _TreeMapper = require('./tree_mapper');

var _TreeMapper2 = _interopRequireWildcard(_TreeMapper);

var _Updater = require('./updater');

var _Updater2 = _interopRequireWildcard(_Updater);

(function () {
  var input = document.getElementById('input');
  var resultEl = document.getElementById('results');

  var updater = undefined;
  new Promise(function (resolve, reject) {
    chrome.bookmarks.getTree(function (tree) {
      resolve(new _TreeMapper2['default'](tree));
    });
  }).then(function (treemap) {
    chrome.history.search({ text: '', maxResults: 10 }, function (hx) {
      hx.forEach(function (r) {
        treemap.addNode(new _NodePath2['default'](r.id, r.url, [r.url], 'history'));
      });
      updater = new _Updater2['default'](treemap, input, resultEl);
    });
  });

  // Pulls some stored data about past selections into memory for use
  // when calculating scores later on.
  _Selections2['default'].initialize();

  // Set up the keyboard to listen for key presses and interpret their keycodes
  var keyboard = new _Keyboard2['default']();
  keyboard.listen(input);

  // Responsible for selection movement & actions within the result set
  var results = new _Results2['default'](resultEl);
  var meta = new _Meta2['default'](results);

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
        _Payload2['default'].saveAndOpen(input.value, results.selected());
        break;

      default:
        console.log('unhandled message', message, sender);
    }
  });
})();

},{"./keyboard":3,"./meta":6,"./node_path":7,"./payload":8,"./results":9,"./selections":10,"./tree_mapper":11,"./updater":12}],2:[function(require,module,exports){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var DOMElement = (function () {
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
      if (this.hasClass(klass)) {
        return;
      }this.el.classList.add(klass);
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
      if (!anchor) {
        return null;
      }return anchor.getAttribute('href');
    }
  }], [{
    key: 'for',
    value: function _for(el) {
      return new DOMElement(el);
    }
  }]);

  return DOMElement;
})();

module.exports = DOMElement;

},{}],3:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _Keycodes = require('./keycodes');

var _Keycodes2 = _interopRequireWildcard(_Keycodes);

module.exports = (function () {
  function Keyboard() {
    _classCallCheck(this, Keyboard);
  }

  _createClass(Keyboard, [{
    key: 'listen',
    value: function listen(el) {
      el.onkeydown = _Keycodes2['default'].onkeydown;
    }
  }]);

  return Keyboard;
})();

},{"./keycodes":4}],4:[function(require,module,exports){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

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

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _Selections = require('./selections');

var _Selections2 = _interopRequireWildcard(_Selections);

var Matcher = (function () {
  function Matcher(string) {
    _classCallCheck(this, Matcher);

    this.string = (string || '').toLowerCase();
    this.previousMatches = {};
  }

  _createClass(Matcher, [{
    key: 'matches',
    value: function matches(query, queryId) {
      if (this.hasMatchData(query)) {
        return this.matchData(query);
      }var match = false;
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
      return _Selections2['default'].getCount(query, queryId);
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

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

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
      }
    }
  }]);

  return Meta;
})();

;

module.exports = Meta;

},{}],7:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _Matcher = require('./matcher');

var _Matcher2 = _interopRequireWildcard(_Matcher);

var PATH_BONUS = 2;

var NodePath = (function () {
  function NodePath(id, url, pieces) {
    var source = arguments[3] === undefined ? 'bookmark' : arguments[3];

    _classCallCheck(this, NodePath);

    this.id = id;
    this.url = url;
    this.pieces = pieces;
    this.path = pieces.join('/');
    this.source = source;
    this.matchers = {
      path: new _Matcher2['default'](this.path),
      url: new _Matcher2['default'](this.url)
    };
  }

  _createClass(NodePath, [{
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

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _Selections = require('./selections');

var _Selections2 = _interopRequireWildcard(_Selections);

var Payload = (function () {
  function Payload() {
    _classCallCheck(this, Payload);
  }

  _createClass(Payload, null, [{
    key: 'saveAndOpen',
    value: function saveAndOpen(query, selected) {
      var url = selected.url();
      if (!url) {
        return;
      }_Selections2['default'].add(query, selected.id());
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

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _DOMElement = require('./dom_element');

var _DOMElement2 = _interopRequireWildcard(_DOMElement);

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
    value: (function (_next) {
      function next(_x) {
        return _next.apply(this, arguments);
      }

      next.toString = function () {
        return _next.toString();
      };

      return next;
    })(function (domEl) {
      if (!domEl) return this.first();

      var index = this.indexOf(domEl);
      var items = this.items();
      var next = items[index + 1];
      if (!next) next = this.last();
      return this.domElOrNull(next);
    })
  }, {
    key: 'previous',
    value: function previous(domEl) {
      if (!domEl) {
        return null;
      }var index = this.indexOf(domEl);
      var items = this.items();
      var prev = items[index - 1];
      return this.domElOrNull(prev);
    }
  }, {
    key: 'domElOrNull',
    value: function domElOrNull(el) {
      if (!el) {
        return null;
      } // el is already a DOMELement
      if (!!(typeof el == 'object' && el.el)) {
        return el;
      }return new _DOMElement2['default'](el);
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
      if (!domEl) {
        return;
      }domEl.removeClass('selected');
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
      var args = arguments[1] === undefined ? {} : arguments[1];

      var bound = fn.bind(this);
      var items = this.items();
      for (var i = 0; i < items.length; i++) {
        bound(new _DOMElement2['default'](items[i]), args, i);
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

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var STORED_ITEMS = null;
var STORAGE_KEY = 'sel';

var Selections = (function () {
  function Selections() {
    _classCallCheck(this, Selections);
  }

  _createClass(Selections, null, [{
    key: 'initialize',
    value: function initialize() {
      if (STORED_ITEMS) {
        return;
      }chrome.storage.sync.get(null, function (stored_items) {
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

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _NodePath = require('./node_path');

var _NodePath2 = _interopRequireWildcard(_NodePath);

var TreeMapper = (function () {
  function TreeMapper(tree) {
    _classCallCheck(this, TreeMapper);

    this.tree = tree;
    this.collection = this.parse();
  }

  _createClass(TreeMapper, [{
    key: 'filter',
    value: function filter(query) {
      return this.collection.filter(function (nodepath) {
        return nodepath.looseMatch(query);
      }).sort(function (a, b) {
        return b.matchScore(query) - a.matchScore(query);
      });
    }
  }, {
    key: 'parse',
    value: function parse() {
      var _this = this;

      var collection = [];

      var b = (function (_b) {
        function b(_x, _x2) {
          return _b.apply(this, arguments);
        }

        b.toString = function () {
          return _b.toString();
        };

        return b;
      })(function (node, path) {
        path.push(node.title);

        if (_this.nodeHasChildren(node)) {
          node.children.forEach(function (child) {
            var copy = path.slice(0);
            b(child, copy);
          });
        } else {
          var nodePath = new _NodePath2['default'](node.id, node.url, path, 'bookmark');
          collection.push(nodePath);
        }
      });

      b(this.tree[0], []);

      return collection;
    }
  }, {
    key: 'nodeHasChildren',
    value: function nodeHasChildren(node) {
      return node.children && node.children.length > 0;
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
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var Updater = (function () {
  function Updater(treemap, inputEl, resultsEl) {
    _classCallCheck(this, Updater);

    this.treemap = treemap;
    this.inputEl = inputEl;
    this.resultsEl = resultsEl;
  }

  _createClass(Updater, [{
    key: "filter",
    value: function filter(query) {
      this.bookmarks = this.treemap.filter(query);
      this.render(query);
      this.resize();
    }
  }, {
    key: "render",
    value: function render(query) {
      var content = Findr.templates.results({
        query: query,
        bookmarks: this.bookmarks
      });
      this.resultsEl.innerHTML = content;
    }
  }, {
    key: "resize",

    // TODO: This really is just thrown in here and likely does not belong
    // in this class. Clean it up!
    value: function resize() {
      var docHeight = document.documentElement.offsetHeight;
      var contentHeight = document.querySelector("#main").offsetHeight;
      if (contentHeight < docHeight) {
        var h = "" + contentHeight + "px";
        document.body.style.height = h;
        document.getElementsByTagName("html")[0].style.height = h;
      }
    }
  }]);

  return Updater;
})();

module.exports = Updater;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvd2Vic2l0ZXMvY2hyb21lX2V4dGVuc2lvbnMvZmluZHIvc3JjL2pzL3BvcHVwLmpzIiwiL3dlYnNpdGVzL2Nocm9tZV9leHRlbnNpb25zL2ZpbmRyL3NyYy9qcy9kb21fZWxlbWVudC5qcyIsIi93ZWJzaXRlcy9jaHJvbWVfZXh0ZW5zaW9ucy9maW5kci9zcmMvanMva2V5Ym9hcmQuanMiLCIvd2Vic2l0ZXMvY2hyb21lX2V4dGVuc2lvbnMvZmluZHIvc3JjL2pzL2tleWNvZGVzLmpzIiwiL3dlYnNpdGVzL2Nocm9tZV9leHRlbnNpb25zL2ZpbmRyL3NyYy9qcy9tYXRjaGVyLmpzIiwiL3dlYnNpdGVzL2Nocm9tZV9leHRlbnNpb25zL2ZpbmRyL3NyYy9qcy9tZXRhLmpzIiwiL3dlYnNpdGVzL2Nocm9tZV9leHRlbnNpb25zL2ZpbmRyL3NyYy9qcy9ub2RlX3BhdGguanMiLCIvd2Vic2l0ZXMvY2hyb21lX2V4dGVuc2lvbnMvZmluZHIvc3JjL2pzL3BheWxvYWQuanMiLCIvd2Vic2l0ZXMvY2hyb21lX2V4dGVuc2lvbnMvZmluZHIvc3JjL2pzL3Jlc3VsdHMuanMiLCIvd2Vic2l0ZXMvY2hyb21lX2V4dGVuc2lvbnMvZmluZHIvc3JjL2pzL3NlbGVjdGlvbnMuanMiLCIvd2Vic2l0ZXMvY2hyb21lX2V4dGVuc2lvbnMvZmluZHIvc3JjL2pzL3RyZWVfbWFwcGVyLmpzIiwiL3dlYnNpdGVzL2Nocm9tZV9leHRlbnNpb25zL2ZpbmRyL3NyYy9qcy91cGRhdGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsWUFBWSxDQUFDOzs7O3dCQUVRLFlBQVk7Ozs7b0JBQ2hCLFFBQVE7Ozs7d0JBQ0osYUFBYTs7Ozt1QkFDZCxXQUFXOzs7O3VCQUNYLFdBQVc7Ozs7MEJBQ1IsY0FBYzs7OzswQkFDZCxlQUFlOzs7O3VCQUNsQixX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QU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1QyxVQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ25CLFVBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUNmOzs7V0FFSyxnQkFBQyxLQUFLLEVBQUU7QUFDWixVQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztBQUNwQyxhQUFLLEVBQUUsS0FBSztBQUNaLGlCQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7T0FDMUIsQ0FBQyxDQUFDO0FBQ0gsVUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO0tBQ3BDOzs7Ozs7V0FJSyxrQkFBRztBQUNQLFVBQUksU0FBUyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDO0FBQ3RELFVBQUksYUFBYSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsWUFBWSxDQUFDO0FBQ2pFLFVBQUssYUFBYSxHQUFHLFNBQVMsRUFBRztBQUMvQixZQUFJLENBQUMsUUFBTSxhQUFhLE9BQUksQ0FBQztBQUM3QixnQkFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUMvQixnQkFBUSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO09BQzNEO0tBQ0Y7OztTQS9CRyxPQUFPOzs7QUFrQ2IsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgS2V5Ym9hcmQgZnJvbSAnLi9rZXlib2FyZCc7XG5pbXBvcnQgTWV0YSBmcm9tICcuL21ldGEnO1xuaW1wb3J0IE5vZGVQYXRoIGZyb20gJy4vbm9kZV9wYXRoJztcbmltcG9ydCBQYXlsb2FkIGZyb20gJy4vcGF5bG9hZCc7XG5pbXBvcnQgUmVzdWx0cyBmcm9tICcuL3Jlc3VsdHMnO1xuaW1wb3J0IFNlbGVjdGlvbnMgZnJvbSAnLi9zZWxlY3Rpb25zJztcbmltcG9ydCBUcmVlTWFwcGVyIGZyb20gJy4vdHJlZV9tYXBwZXInO1xuaW1wb3J0IFVwZGF0ZXIgZnJvbSAnLi91cGRhdGVyJztcblxuKCgpID0+IHtcbiAgdmFyIGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lucHV0Jyk7XG4gIHZhciByZXN1bHRFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN1bHRzJyk7XG5cbiAgbGV0IHVwZGF0ZXI7XG4gIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjaHJvbWUuYm9va21hcmtzLmdldFRyZWUoKHRyZWUpID0+IHtcbiAgICAgIHJlc29sdmUobmV3IFRyZWVNYXBwZXIodHJlZSkpO1xuICAgIH0pO1xuICB9KS50aGVuKCh0cmVlbWFwKSA9PiB7XG4gICAgY2hyb21lLmhpc3Rvcnkuc2VhcmNoKHt0ZXh0OiAnJywgbWF4UmVzdWx0czogMTB9LCAoaHgpID0+IHtcbiAgICAgIGh4LmZvckVhY2goKHIpID0+IHtcbiAgICAgICAgdHJlZW1hcC5hZGROb2RlKG5ldyBOb2RlUGF0aChyLmlkLCByLnVybCwgW3IudXJsXSwgJ2hpc3RvcnknKSk7XG4gICAgICB9KTtcbiAgICAgIHVwZGF0ZXIgPSBuZXcgVXBkYXRlcih0cmVlbWFwLCBpbnB1dCwgcmVzdWx0RWwpO1xuICAgIH0pO1xuICB9KTtcblxuICAvLyBQdWxscyBzb21lIHN0b3JlZCBkYXRhIGFib3V0IHBhc3Qgc2VsZWN0aW9ucyBpbnRvIG1lbW9yeSBmb3IgdXNlXG4gIC8vIHdoZW4gY2FsY3VsYXRpbmcgc2NvcmVzIGxhdGVyIG9uLlxuICBTZWxlY3Rpb25zLmluaXRpYWxpemUoKTtcblxuICAvLyBTZXQgdXAgdGhlIGtleWJvYXJkIHRvIGxpc3RlbiBmb3Iga2V5IHByZXNzZXMgYW5kIGludGVycHJldCB0aGVpciBrZXljb2Rlc1xuICB2YXIga2V5Ym9hcmQgPSBuZXcgS2V5Ym9hcmQoKTtcbiAga2V5Ym9hcmQubGlzdGVuKGlucHV0KTtcblxuICAvLyBSZXNwb25zaWJsZSBmb3Igc2VsZWN0aW9uIG1vdmVtZW50ICYgYWN0aW9ucyB3aXRoaW4gdGhlIHJlc3VsdCBzZXRcbiAgdmFyIHJlc3VsdHMgPSBuZXcgUmVzdWx0cyhyZXN1bHRFbCk7XG4gIHZhciBtZXRhID0gbmV3IE1ldGEocmVzdWx0cyk7XG5cbiAgY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKGZ1bmN0aW9uKG1lc3NhZ2UsIHNlbmRlciwgX3Jlc3ApIHtcbiAgICAvLyBjb25zb2xlLmxvZygncmVjZWl2ZWQgbWVzc2FnZTogJywgbWVzc2FnZSk7XG4gICAgc3dpdGNoICggbWVzc2FnZS50eXBlICkge1xuICAgICAgY2FzZSAnZmlsdGVyJzpcbiAgICAgICAgdXBkYXRlci5maWx0ZXIoaW5wdXQudmFsdWUpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnbWV0YSc6XG4gICAgICAgIG1ldGEucGVyZm9ybShtZXNzYWdlLmFjdGlvbik7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdwYXlsb2FkJzpcbiAgICAgICAgUGF5bG9hZC5zYXZlQW5kT3BlbihpbnB1dC52YWx1ZSwgcmVzdWx0cy5zZWxlY3RlZCgpKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGNvbnNvbGUubG9nKCd1bmhhbmRsZWQgbWVzc2FnZScsIG1lc3NhZ2UsIHNlbmRlcik7XG4gICAgfVxuICB9KTtcbn0pKCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNsYXNzIERPTUVsZW1lbnQge1xuICBzdGF0aWMgZm9yKGVsKSB7XG4gICAgcmV0dXJuIG5ldyBET01FbGVtZW50KGVsKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGVsKSB7XG4gICAgdGhpcy5lbCA9IGVsO1xuICB9XG5cbiAgaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWlkJyk7XG4gIH1cblxuICBhZGRDbGFzcyhrbGFzcykge1xuICAgIGlmICggdGhpcy5oYXNDbGFzcyhrbGFzcykgKSByZXR1cm47XG4gICAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKGtsYXNzKTtcbiAgfVxuXG4gIGhhc0NsYXNzKGtsYXNzKSB7XG4gICAgcmV0dXJuIHRoaXMuZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGtsYXNzKTtcbiAgfVxuXG4gIHJlbW92ZUNsYXNzKGtsYXNzKSB7XG4gICAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKGtsYXNzKTtcbiAgfVxuXG4gIG1hdGNoKGRvbUVsKSB7XG4gICAgcmV0dXJuIHRoaXMuZWwgPT0gZG9tRWwuZWw7XG4gIH1cblxuICB1cmwoKSB7XG4gICAgbGV0IGFuY2hvciA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcignYScpO1xuICAgIGlmICggIWFuY2hvciApIHJldHVybiBudWxsO1xuXG4gICAgcmV0dXJuIGFuY2hvci5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IERPTUVsZW1lbnQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBLZXljb2RlcyBmcm9tICcuL2tleWNvZGVzJztcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBLZXlib2FyZCB7XG4gIGxpc3RlbihlbCkge1xuICAgIGVsLm9ua2V5ZG93biA9IEtleWNvZGVzLm9ua2V5ZG93bjtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY2xhc3MgS2V5Y29kZXMge1xuICBzdGF0aWMgb25rZXlkb3duKGUpIHtcbiAgICAvLyBBc3N1bWUgYW55IGtleXN0cm9rZSBpcyBtZWFudCB0byBmdXJ0aGVyIGZpbHRlciByZXN1bHRzLiBBbnkgb3RoZXJcbiAgICAvLyBhY3Rpb24gbXVzdCBiZSBleHBsaWNpdGx5IGhhbmRsZWQgZm9yIGhlcmUuXG4gICAgdmFyIG1lc3NhZ2UgPSB7XG4gICAgICBrZXljb2RlOiBlLmtleUNvZGUsXG4gICAgICB0eXBlOiAnZmlsdGVyJyxcbiAgICAgIGFjdGlvbjogbnVsbFxuICAgIH07XG5cbiAgICBzd2l0Y2ggKCBlLmtleUNvZGUgKSB7XG4gICAgICBjYXNlIDEzOiAvLyBlbnRlclxuICAgICAgICBtZXNzYWdlLnR5cGUgPSAncGF5bG9hZCc7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIDE3OiAvLyBjdHJsXG4gICAgICBjYXNlIDkzOiAvLyBjbWRcbiAgICAgICAgbWVzc2FnZS50eXBlID0gJ25vb3AnO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAzODogLy8gdXAgYXJyb3dcbiAgICAgICAgbWVzc2FnZS50eXBlID0gJ21ldGEnO1xuICAgICAgICBtZXNzYWdlLmFjdGlvbiA9ICdtb3ZlVXAnO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSA0MDogLy8gZG93biBhcnJvd1xuICAgICAgICBtZXNzYWdlLnR5cGUgPSAnbWV0YSc7XG4gICAgICAgIG1lc3NhZ2UuYWN0aW9uID0gJ21vdmVEb3duJztcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgNzg6IC8vIG5cbiAgICAgICAgaWYgKCBlLmN0cmxLZXkgKSB7XG4gICAgICAgICAgbWVzc2FnZS50eXBlID0gJ21ldGEnO1xuICAgICAgICAgIG1lc3NhZ2UuYWN0aW9uID0gJ21vdmVEb3duJztcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSA4MDogLy8gcFxuICAgICAgICBpZiAoIGUuY3RybEtleSApIHtcbiAgICAgICAgICBtZXNzYWdlLnR5cGUgPSAnbWV0YSc7XG4gICAgICAgICAgbWVzc2FnZS5hY3Rpb24gPSAnbW92ZVVwJztcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICB9O1xuXG4gICAgY29uc29sZS5sb2coJ2tleWNvZGVzLmpzOiAnLCBtZXNzYWdlKTtcblxuICAgIC8vIEVtaXQgbWVzc2FnZSBzbyB0aGUgcHJvcGVyIGFjdGlvbiBjYW4gYmUgdGFrZW5cbiAgICBpZiAoIG1lc3NhZ2UudHlwZSAhPSAnbm9vcCcgKSB7XG4gICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShtZXNzYWdlKSBcbiAgICB9XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gS2V5Y29kZXM7XG4iLCJpbXBvcnQgU2VsZWN0aW9ucyBmcm9tICcuL3NlbGVjdGlvbnMnO1xuXG5jbGFzcyBNYXRjaGVyIHtcbiAgY29uc3RydWN0b3IgKHN0cmluZykge1xuICAgIHRoaXMuc3RyaW5nID0gKHN0cmluZyB8fCAnJykudG9Mb3dlckNhc2UoKTtcbiAgICB0aGlzLnByZXZpb3VzTWF0Y2hlcyA9IHt9O1xuICB9XG5cbiAgbWF0Y2hlcyhxdWVyeSwgcXVlcnlJZCkge1xuICAgIGlmICggdGhpcy5oYXNNYXRjaERhdGEocXVlcnkpICkgcmV0dXJuIHRoaXMubWF0Y2hEYXRhKHF1ZXJ5KTtcblxuICAgIGxldCBtYXRjaCA9IGZhbHNlO1xuICAgIGxldCBsb2NhdGlvbnMgPSBbXTtcbiAgICBsZXQgcSA9IHF1ZXJ5LnRvTG93ZXJDYXNlKCk7XG4gICAgbGV0IHFsZW4gPSBxLmxlbmd0aDtcbiAgICBsZXQgaiA9IDA7XG5cbiAgICAvLyBXYXMgdGhlIGxhc3QgY2hhcmFjdGVyIGEgbWF0Y2g/XG4gICAgbGV0IHJ1biA9IGZhbHNlO1xuXG4gICAgZm9yICggbGV0IGkgPSAwOyBpIDwgdGhpcy5zdHJpbmcubGVuZ3RoICYmICFtYXRjaDsgaSsrKSB7XG4gICAgICB2YXIgc3RyQ2hhciA9IHRoaXMuY2hhckF0KGkpO1xuICAgICAgdmFyIHF1ZXJ5Q2hhciA9IHFbal07XG5cbiAgICAgIGlmICggc3RyQ2hhciAhPSBxdWVyeUNoYXIgKSB7XG4gICAgICAgIC8vIFdlIGZhaWxlZCB0byBtYXRjaCBzbyBpZiB3ZSB3ZXJlIG9uIGEgcnVuLCBpdCBoYXMgZW5kZWRcbiAgICAgICAgcnVuID0gZmFsc2U7XG4gICAgICB9IGVsc2UgaWYgKCBydW4gKSB7XG4gICAgICAgIC8vIFRoZSBwcmV2aW91cyBpdGVyYXRpb24gZm91bmQgYSBtYXRjaC4gVGhhdCBtZWFucyB3ZSBhcmUgY3VycmVudGx5XG4gICAgICAgIC8vIG9uIGEgcnVuIG9mIG1hdGNoaW5nIGNoYXJhY3RlcnMuIFRoaXMgaXMgYW4gZWFzeSBzdGVwIHNpbmNlIHdlXG4gICAgICAgIC8vIGp1c3Qgd2FudCB0byBpbmNyZW1lbnQgdGhlIGVuZCBwb3NpdGlvbiBmb3IgdGhlIG1vc3QgcmVjZW50XG4gICAgICAgIC8vIGxvY0RhdGEgb2JqZWN0IChpbiBsb2NhdGlvbnMpXG4gICAgICAgIHZhciBsYXN0ID0gbG9jYXRpb25zLnBvcCgpO1xuICAgICAgICBsYXN0WzFdKys7XG4gICAgICAgIGorKztcbiAgICAgICAgbG9jYXRpb25zLnB1c2gobGFzdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBGaXJzdCBtYXRjaCB3ZSBoYXZlIHNlZW4gaW4gYXQgbGVhc3QgMSBmdWxsIGl0ZXJhdGlvbi4gSWYgdGhlXG4gICAgICAgIC8vIG5leHQgaXRlcmF0aW9uIG1hdGNoZXMsIGJlIHN1cmUgdG8gYXBwZW5kIHRvIHRoaXMgbG9jRGF0YVxuICAgICAgICBydW4gPSB0cnVlO1xuXG4gICAgICAgIC8vIFRoaW5rIHNsaWNlKCkuIExvY2F0aW9uIGRhdGEgd2lsbCBiZSBhbiBhcnJheSB3aGVyZSB0aGUgZmlyc3RcbiAgICAgICAgLy8gdmFsdWUgaXMgdGhlIGluZGV4IG9mIHRoZSBmaXJzdCBtYXRjaCBhbmQgdGhlIHNlY29uZCB2YWx1ZSBpc1xuICAgICAgICAvLyB0aGUgaW5kZXggb2YgdGhlIGxhc3QgbWF0Y2guXG4gICAgICAgIGxldCBsb2NEYXRhID0gW2ksIGkrMV07XG5cbiAgICAgICAgLy8gTWF0Y2ggdGhlIGxhcmdlc3QgY2h1bmtzIG9mIG1hdGNoaW5nIHRleHQgdG9nZXRoZXIhXG4gICAgICAgIC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgbGFzdCBjaGFyYWN0ZXIgaW4gdGhlIHF1ZXJ5IHN0cmluZyBtYXRjaGVzXG4gICAgICAgIC8vIHRoZSBsYXN0IGNoYXJhY3RlciBpbiB0aGlzLnN0cmluZy4gSWYgc28sIHN0ZWFsIHRoYXQgY2hhcmFjdGVyc1xuICAgICAgICAvLyBsb2NhdGlvbiBkYXRhIChmcm9tIHRoZSBwcmV2aW91cyBsb2NEYXRhIGZvdW5kIGF0IGxvY2F0aW9ucy5sYXN0KVxuICAgICAgICAvLyBhbmQgcHJlcGVuZCBpdCB0byB0aGlzIG1hdGNoIGRhdGEuXG4gICAgICAgIC8vIEZvciBleGFtcGxlLCBpZiB3ZSB3YW50IHRvIG1hdGNoICdkbScsIGRvaW5nIGEgXCJmaXJzdCBjb21lLCBmaXJzdFxuICAgICAgICAvLyBtYXRjaFwiIHdvdWxkIHByb2R1Y2UgdGhpcyBtYXRjaCAobWF0Y2hlcyBhcmUgaW4gY2Fwcyk6XG4gICAgICAgIC8vICAgJy9Eei9hL2RNb3onXG4gICAgICAgIC8vIEhvd2V2ZXIsIHdlIHdhbnQgdG8gbWF0Y2ggYXMgbWFueSBjb25zZWN1dGl2ZSBzdHJpbmdzIGFzIHBvc3NpYmxlLFxuICAgICAgICAvLyB0aHVzIHRoZSBtYXRjaCBzaG91bGQgYmU6XG4gICAgICAgIC8vICAgJy9kei9hL0RNJ1xuICAgICAgICBsZXQgY29udCA9IHRydWU7XG4gICAgICAgIGZvciAoIHZhciBrID0gMTsgayA8PSBpICYmIGNvbnQ7IGsrKykge1xuICAgICAgICAgIGxldCBwcmV2U3RyQ2hhciA9IHRoaXMuY2hhckF0KGkgLSBrKTtcbiAgICAgICAgICBsZXQgcHJldlF1ZXJ5Q2hhciA9IHFbaiAtIGtdO1xuICAgICAgICAgIGNvbnQgPSBwcmV2U3RyQ2hhciA9PSBwcmV2UXVlcnlDaGFyO1xuICAgICAgICAgIGlmICggY29udCApIHtcbiAgICAgICAgICAgIC8vIHF1ZXJ5OiBkbVxuICAgICAgICAgICAgLy8gc3RyaW5nOiBmc2Rsc2Rtb3pcbiAgICAgICAgICAgIC8vIHByZXY6IFsyLDNdIC0tPiBbMiwyXSAtLT4gcmVtb3ZlIGl0XG4gICAgICAgICAgICAvLyBjdXJyOiBbNiw3XSAtLT4gWzUsN11cbiAgICAgICAgICAgIGxldCBwcmV2TG9jRGF0YSA9IGxvY2F0aW9ucy5wb3AoKTtcbiAgICAgICAgICAgIHByZXZMb2NEYXRhWzFdLS07XG5cbiAgICAgICAgICAgIC8vIE9ubHkgcGVyc2lzdCB0aGUgcHJldmlvdXMgbG9jYXRpb24gZGF0YSBpZiBpdCBoYXMgYXQgbGVhc3QgMSBtYXRjaFxuICAgICAgICAgICAgaWYgKCBwcmV2TG9jRGF0YVswXSA8IHByZXZMb2NEYXRhWzFdICkgbG9jYXRpb25zLnB1c2gocHJldkxvY0RhdGEpO1xuXG4gICAgICAgICAgICAvLyBOb3csIG1vdmUgdGhlIHN0YXJ0IHBvc2l0aW9uIGJhY2sgMSBmb3IgdGhlIGN1cnJlbnQgbWF0Y2hcbiAgICAgICAgICAgIGxvY0RhdGFbMF0tLTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbG9jYXRpb25zLnB1c2gobG9jRGF0YSk7XG4gICAgICAgIGorKztcbiAgICAgIH1cblxuICAgICAgbWF0Y2ggPSAoIGogPT0gcWxlbiApO1xuICAgIH1cblxuICAgIGlmICggbWF0Y2ggKSB7XG4gICAgICB0aGlzLnNldE1hdGNoRGF0YShxdWVyeSwgcXVlcnlJZCwgbWF0Y2gsIGxvY2F0aW9ucyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1hdGNoO1xuICB9XG5cbiAgc2V0TWF0Y2hEYXRhKHF1ZXJ5LCBxdWVyeUlkLCBib29sLCBsb2NhdGlvbnMpIHtcbiAgICBsZXQgc2NvcmUgPSB0aGlzLmNhbGNMb2NhdGlvblNjb3JlKGxvY2F0aW9ucyk7XG4gICAgbGV0IHNlbGVjdGlvbkNvdW50ID0gdGhpcy5wcmV2aW91c1NlbGVjdGlvbkNvdW50KHF1ZXJ5LCBxdWVyeUlkKTtcbiAgICBzd2l0Y2ggKCB0cnVlICkge1xuICAgICAgY2FzZSAoIHNlbGVjdGlvbkNvdW50ID4gMSAmJiBzZWxlY3Rpb25Db3VudCA8IDQgKTpcbiAgICAgICAgc2NvcmUgPSBzY29yZSAqIHNlbGVjdGlvbkNvdW50O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgKCBzZWxlY3Rpb25Db3VudCA+PSA0ICYmIHNlbGVjdGlvbkNvdW50IDwgNiApOlxuICAgICAgICBzY29yZSA9IHNjb3JlICogNDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICggc2VsZWN0aW9uQ291bnQgPj0gNiAmJiBzZWxlY3Rpb25Db3VudCA8IDEwICk6XG4gICAgICAgIHNjb3JlID0gc2NvcmUgKiA1O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgKCBzZWxlY3Rpb25Db3VudCA+PSAxMCApOlxuICAgICAgICBzY29yZSA9IHNjb3JlICogNjtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgdGhpcy5wcmV2aW91c01hdGNoZXNbcXVlcnldID0ge1xuICAgICAgbWF0Y2g6IGJvb2wsXG4gICAgICBsb2NhdGlvbnM6IGxvY2F0aW9ucyxcbiAgICAgIHNjb3JlOiBzY29yZVxuICAgIH07XG4gIH1cblxuICBjYWxjTG9jYXRpb25TY29yZShsb2NhdGlvbnMpIHtcbiAgICAvLyBTaW1wbHkgZG91YmxlIHRoZSBsZW5ndGggb2YgZWFjaCBtYXRjaCBsZW5ndGguXG4gICAgcmV0dXJuIGxvY2F0aW9ucy5tYXAoKG1hdGNoKSA9PiB7XG4gICAgICBsZXQgbWF0Y2hMZW5ndGggPSBNYXRoLmFicyhtYXRjaFswXSAtIG1hdGNoWzFdKTtcbiAgICAgIGxldCBtdWx0aXBsaWVyID0gbWF0Y2hMZW5ndGggPT0gMSA/IDEgOiAyO1xuXG4gICAgICBsZXQgc3RhcnRzV2l0aFNsYXNoID0gdGhpcy5zdHJpbmdbbWF0Y2hbMF1dID09ICcvJ1xuICAgICAgaWYgKCBzdGFydHNXaXRoU2xhc2ggJiYgbWF0Y2hMZW5ndGggPiAxICkgbXVsdGlwbGllciArPSAxO1xuICAgICAgcmV0dXJuIG1hdGNoTGVuZ3RoICogbXVsdGlwbGllcjtcblxuICAgIH0sIHRoaXMpLnJlZHVjZSgoYSwgYikgPT4ge1xuICAgICAgcmV0dXJuIGEgKyBiO1xuICAgIH0sIDApO1xuICB9XG5cbiAgcHJldmlvdXNTZWxlY3Rpb25Db3VudChxdWVyeSwgcXVlcnlJZCkge1xuICAgIHJldHVybiBTZWxlY3Rpb25zLmdldENvdW50KHF1ZXJ5LCBxdWVyeUlkKTtcbiAgfVxuXG4gIGhhc01hdGNoRGF0YShxdWVyeSkge1xuICAgIHJldHVybiAhIXRoaXMubWF0Y2hEYXRhKHF1ZXJ5KTtcbiAgfVxuXG4gIG1hdGNoRGF0YShxdWVyeSkge1xuICAgIHJldHVybiB0aGlzLnByZXZpb3VzTWF0Y2hlc1txdWVyeV07XG4gIH1cblxuICBjaGFyQXQoaSkge1xuICAgIHJldHVybiB0aGlzLnN0cmluZy5jaGFyQXQoaSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNYXRjaGVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBNZXRhIHtcbiAgY29uc3RydWN0b3IocmVzdWx0cykge1xuICAgIHRoaXMucmVzdWx0cyA9IHJlc3VsdHM7XG4gIH1cblxuICBwZXJmb3JtKGFjdGlvbikge1xuICAgIC8vIGNvbnNvbGUubG9nKGBwZXJmb3JtOiAke2FjdGlvbn1gKTtcbiAgICB0aGlzW2FjdGlvbl0oKTtcbiAgfVxuXG4gIG1vdmVVcCgpIHtcbiAgICB2YXIgaXRlbSA9IHRoaXMucmVzdWx0cy5zZWxlY3RlZCgpO1xuICAgIHZhciBwcmV2ID0gdGhpcy5yZXN1bHRzLnByZXZpb3VzKGl0ZW0pO1xuXG4gICAgaWYgKCBwcmV2ICYmIGl0ZW0gIT0gcHJldiApIHtcbiAgICAgIHRoaXMucmVzdWx0cy51bnNlbGVjdChpdGVtKTtcbiAgICAgIHRoaXMucmVzdWx0cy5zZWxlY3QocHJldik7XG4gICAgfVxuICB9XG5cbiAgbW92ZURvd24oKSB7XG4gICAgdmFyIGl0ZW0gPSB0aGlzLnJlc3VsdHMuc2VsZWN0ZWQoKTtcbiAgICB2YXIgbmV4dCA9IHRoaXMucmVzdWx0cy5uZXh0KGl0ZW0pO1xuXG4gICAgaWYgKCBuZXh0ICYmIGl0ZW0gIT0gbmV4dCApIHtcbiAgICAgIHRoaXMucmVzdWx0cy51bnNlbGVjdChpdGVtKTtcbiAgICAgIHRoaXMucmVzdWx0cy5zZWxlY3QobmV4dCk7XG4gICAgfVxuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1ldGE7XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBNYXRjaGVyIGZyb20gJy4vbWF0Y2hlcic7XG5cbmxldCBQQVRIX0JPTlVTID0gMjtcblxuY2xhc3MgTm9kZVBhdGgge1xuICBjb25zdHJ1Y3RvcihpZCwgdXJsLCBwaWVjZXMsIHNvdXJjZT0nYm9va21hcmsnKSB7XG4gICAgdGhpcy5pZCA9IGlkO1xuICAgIHRoaXMudXJsID0gdXJsO1xuICAgIHRoaXMucGllY2VzID0gcGllY2VzO1xuICAgIHRoaXMucGF0aCA9IHBpZWNlcy5qb2luKCcvJyk7XG4gICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgdGhpcy5tYXRjaGVycyA9IHtcbiAgICAgIHBhdGg6IG5ldyBNYXRjaGVyKHRoaXMucGF0aCksXG4gICAgICB1cmw6IG5ldyBNYXRjaGVyKHRoaXMudXJsKVxuICAgIH07XG4gIH1cblxuICBsb29zZU1hdGNoKHEpIHtcbiAgICB2YXIgYSA9IHRoaXMubWF0Y2hGb3IoJ3BhdGgnLCBxKTtcbiAgICB2YXIgYiA9IHRoaXMubWF0Y2hGb3IoJ3VybCcsIHEpO1xuICAgIHJldHVybiBhIHx8IGI7XG4gIH1cblxuICBtYXRjaEZvcih0eXBlLCBxKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2hlcnNbdHlwZV0ubWF0Y2hlcyhxLCB0aGlzLmlkKTtcbiAgfVxuXG4gIG1hdGNoU2NvcmUocSkge1xuICAgIHZhciBhID0gKHRoaXMubWF0Y2hEYXRhRm9yKCdwYXRoJywgcSkgfHwge3Njb3JlOjB9KS5zY29yZTtcblxuICAgIC8vIEdpdmUgdGhlIHBhdGggYW4gYXJiaXRyYXJ5IFwiYm9udXNcIiBzbyBhIHBhdGggbWF0Y2ggd2lsbCBjYXJyeVxuICAgIC8vIGdyZWF0ZXIgd2VpZ2h0IHRoYW4gYSB1cmwgbWF0Y2guXG4gICAgaWYgKCBhID4gMCApIGEgPSBhICsgUEFUSF9CT05VUztcblxuICAgIHZhciBiID0gKHRoaXMubWF0Y2hEYXRhRm9yKCd1cmwnLCBxKSB8fCB7c2NvcmU6MH0pLnNjb3JlO1xuICAgIHJldHVybiBNYXRoLm1heChhLGIpO1xuICB9XG5cbiAgbWF0Y2hEYXRhRm9yKHR5cGUsIHEpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaGVyc1t0eXBlXS5tYXRjaERhdGEocSwgdGhpcy5pZCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBOb2RlUGF0aDtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IFNlbGVjdGlvbnMgZnJvbSAnLi9zZWxlY3Rpb25zJztcblxuY2xhc3MgUGF5bG9hZCB7XG4gIHN0YXRpYyBzYXZlQW5kT3BlbihxdWVyeSwgc2VsZWN0ZWQpIHtcbiAgICBsZXQgdXJsID0gc2VsZWN0ZWQudXJsKCk7XG4gICAgaWYgKCAhdXJsICkgcmV0dXJuO1xuXG4gICAgU2VsZWN0aW9ucy5hZGQocXVlcnksIHNlbGVjdGVkLmlkKCkpO1xuICAgIC8vIGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KG51bGwsIChpKSA9PiB7IGNvbnNvbGUubG9nKGkpOyB9KTtcblxuICAgIGlmICggdXJsICkge1xuICAgICAgY2hyb21lLnRhYnMuY3JlYXRlKHsgdXJsOiB1cmwgfSk7XG4gICAgfVxuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBheWxvYWQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBET01FbGVtZW50IGZyb20gJy4vZG9tX2VsZW1lbnQnO1xuXG5jbGFzcyBSZXN1bHRzRE9NIHtcbiAgY29uc3RydWN0b3IoY29udGFpbmVyKSB7XG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG4gIH1cblxuICBpdGVtcygpIHtcbiAgICByZXR1cm4gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLnJlc3VsdC5ib3gnKTtcbiAgfVxuXG4gIGZpcnN0KCkge1xuICAgIGxldCBpdGVtID0gdGhpcy5pdGVtc1swXTtcbiAgICByZXR1cm4gdGhpcy5kb21FbE9yTnVsbChpdGVtKTtcbiAgfVxuXG4gIGxhc3QoKSB7XG4gICAgbGV0IGxpc3QgPSB0aGlzLml0ZW1zKCk7XG4gICAgbGV0IGl0ZW0gPSBsaXN0W2xpc3QubGVuZ3RoIC0gMV07XG4gICAgcmV0dXJuIHRoaXMuZG9tRWxPck51bGwoaXRlbSk7XG4gIH1cblxuICBzZWxlY3RlZCgpIHtcbiAgICBsZXQgaXRlbSA9IHRoaXMuY29udGFpbmVyLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3NlbGVjdGVkJylbMF07XG4gICAgcmV0dXJuIHRoaXMuZG9tRWxPck51bGwoaXRlbSk7XG4gIH1cblxuICAvLyBHZXQgdGhlIG5leHQgZWxlbWVudCBpbiB0aGUgbGlzdCByZWxhdGl2ZSB0byB0aGUgcHJvdmlkZWQgZG9tRWxcbiAgbmV4dChkb21FbCkge1xuICAgIGlmICggIWRvbUVsICkgcmV0dXJuIHRoaXMuZmlyc3QoKTtcblxuICAgIGxldCBpbmRleCA9IHRoaXMuaW5kZXhPZihkb21FbCk7XG4gICAgbGV0IGl0ZW1zID0gdGhpcy5pdGVtcygpO1xuICAgIGxldCBuZXh0ID0gaXRlbXNbaW5kZXggKyAxXTtcbiAgICBpZiAoICFuZXh0ICkgbmV4dCA9IHRoaXMubGFzdCgpO1xuICAgIHJldHVybiB0aGlzLmRvbUVsT3JOdWxsKG5leHQpO1xuICB9XG5cbiAgcHJldmlvdXMoZG9tRWwpIHtcbiAgICBpZiAoICFkb21FbCApIHJldHVybiBudWxsO1xuXG4gICAgbGV0IGluZGV4ID0gdGhpcy5pbmRleE9mKGRvbUVsKTtcbiAgICBsZXQgaXRlbXMgPSB0aGlzLml0ZW1zKCk7XG4gICAgbGV0IHByZXYgPSBpdGVtc1tpbmRleCAtIDFdO1xuICAgIHJldHVybiB0aGlzLmRvbUVsT3JOdWxsKHByZXYpO1xuICB9XG5cbiAgZG9tRWxPck51bGwoZWwpIHtcbiAgICBpZiAoICFlbCApIHJldHVybiBudWxsO1xuICAgIC8vIGVsIGlzIGFscmVhZHkgYSBET01FTGVtZW50XG4gICAgaWYgKCAhISh0eXBlb2YgZWwgPT0gJ29iamVjdCcgJiYgZWxbJ2VsJ10pICkgcmV0dXJuIGVsO1xuICAgIHJldHVybiBuZXcgRE9NRWxlbWVudChlbCk7XG4gIH1cblxuICAvLyBBZGQgJ3NlbGVjdGVkJyBjbGFzcyB0byB0aGUgcHJvdmlkZWQgZG9tRWxcbiAgc2VsZWN0KGRvbUVsKSB7XG4gICAgaWYgKCAhZG9tRWwgKSBkb21FbCA9IHRoaXMubGFzdCgpO1xuICAgIGRvbUVsLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuICB9XG5cbiAgLy8gUmVtb3ZlICdzZWxlY3RlZCcgY2xhc3MgZnJvbSB0aGUgcHJvdmlkZWQgZG9tRWxcbiAgdW5zZWxlY3QoZG9tRWwpIHtcbiAgICBpZiAoICFkb21FbCApIHJldHVybjtcbiAgICBkb21FbC5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcbiAgfVxuXG4gIHVuc2VsZWN0QWxsKCkge1xuICAgIHRoaXMuZWFjaCgoZG9tRWwpID0+IHsgdGhpcy51bnNlbGVjdChkb21FbCkgfSk7XG4gIH1cblxuICBlYWNoKGZuLCBhcmdzPXt9KSB7XG4gICAgbGV0IGJvdW5kID0gZm4uYmluZCh0aGlzKTtcbiAgICBsZXQgaXRlbXMgPSB0aGlzLml0ZW1zKCk7XG4gICAgZm9yICggbGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKysgKSB7XG4gICAgICBib3VuZChuZXcgRE9NRWxlbWVudChpdGVtc1tpXSksIGFyZ3MsIGkpO1xuICAgIH1cbiAgfVxuXG4gIGluZGV4T2YoZG9tRWwpIHtcbiAgICBsZXQgaXRlbXMgPSB0aGlzLml0ZW1zKCk7XG4gICAgbGV0IGluZGV4O1xuICAgIGZvciAoIGxldCBpID0gMDsgIWluZGV4ICYmIGkgPCBpdGVtcy5sZW5ndGg7IGkrKyApIHtcbiAgICAgIGlmICggZG9tRWwuZWwgPT0gaXRlbXNbaV0gKSBpbmRleCA9IGk7XG4gICAgfVxuICAgIHJldHVybiBpbmRleDtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlc3VsdHNET007XG4iLCIndXNlIHN0cmljdCc7XG5cbmxldCBTVE9SRURfSVRFTVMgPSBudWxsO1xubGV0IFNUT1JBR0VfS0VZID0gJ3NlbCc7XG5cbmNsYXNzIFNlbGVjdGlvbnMge1xuICBzdGF0aWMgaW5pdGlhbGl6ZSgpIHtcbiAgICBpZiAoIFNUT1JFRF9JVEVNUyApIHJldHVybjtcblxuICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KG51bGwsIChzdG9yZWRfaXRlbXMpID0+IHtcbiAgICAgIFNUT1JFRF9JVEVNUyA9IHN0b3JlZF9pdGVtcztcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBnZXRDb3VudChxdWVyeSwgaWQpIHtcbiAgICBsZXQgYSA9IHRoaXMuZ2V0KHF1ZXJ5KTtcbiAgICBpZiAoIGEgJiYgYVtpZF0gKSB7XG4gICAgICByZXR1cm4gYVtpZF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBnZXQocXVlcnkpIHtcbiAgICBsZXQga2V5ID0gdGhpcy5fbmFtZXNwYWNlKHF1ZXJ5KTtcbiAgICByZXR1cm4gU1RPUkVEX0lURU1TW2tleV07XG4gIH1cblxuICBzdGF0aWMgc2V0KHF1ZXJ5LCB2YWx1ZSkge1xuICAgIGxldCBrZXkgPSB0aGlzLl9uYW1lc3BhY2UocXVlcnkpO1xuICAgIFNUT1JFRF9JVEVNU1trZXldID0gdmFsdWU7XG4gIH1cblxuICBzdGF0aWMgYWRkKHF1ZXJ5LCBpZCkge1xuICAgIGxldCBvYmogPSB0aGlzLmdldChxdWVyeSk7XG5cbiAgICBpZiAoICFvYmogKSBvYmogPSB7fTtcbiAgICBpZiAoICFvYmpbaWRdICkgb2JqW2lkXSA9IDA7XG4gICAgb2JqW2lkXSArPSAxO1xuXG4gICAgdGhpcy5zZXQocXVlcnksIG9iaik7XG4gICAgdGhpcy5fc2F2ZShxdWVyeSwgb2JqKTtcbiAgfVxuXG4gIHN0YXRpYyBfbmFtZXNwYWNlKHF1ZXJ5KSB7XG4gICAgcmV0dXJuIFtTVE9SQUdFX0tFWSwgcXVlcnldLmpvaW4oJy4nKTtcbiAgfVxuXG4gIHN0YXRpYyBfc2F2ZShxdWVyeSwgdmFsdWUpIHtcbiAgICBsZXQga2V5ID0gdGhpcy5fbmFtZXNwYWNlKHF1ZXJ5KTtcbiAgICBsZXQgdG1wID0ge307XG4gICAgdG1wW2tleV0gPSB2YWx1ZTtcbiAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh0bXApO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNlbGVjdGlvbnM7XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBOb2RlUGF0aCBmcm9tICcuL25vZGVfcGF0aCc7XG5cbmNsYXNzIFRyZWVNYXBwZXIge1xuICBjb25zdHJ1Y3Rvcih0cmVlKSB7XG4gICAgdGhpcy50cmVlID0gdHJlZTtcbiAgICB0aGlzLmNvbGxlY3Rpb24gPSB0aGlzLnBhcnNlKCk7XG4gIH1cblxuICBmaWx0ZXIocXVlcnkpIHtcbiAgICByZXR1cm4gdGhpcy5jb2xsZWN0aW9uLmZpbHRlcigobm9kZXBhdGgpID0+IHtcbiAgICAgIHJldHVybiBub2RlcGF0aC5sb29zZU1hdGNoKHF1ZXJ5KTtcbiAgICB9KS5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgIHJldHVybiBiLm1hdGNoU2NvcmUocXVlcnkpIC0gYS5tYXRjaFNjb3JlKHF1ZXJ5KTtcbiAgICB9KTtcbiAgfVxuXG4gIHBhcnNlKCkge1xuICAgIGxldCBjb2xsZWN0aW9uID0gW107XG5cbiAgICB2YXIgYiA9IChub2RlLCBwYXRoKSA9PiB7XG4gICAgICBwYXRoLnB1c2gobm9kZS50aXRsZSk7XG5cbiAgICAgIGlmICggdGhpcy5ub2RlSGFzQ2hpbGRyZW4obm9kZSkgKSB7XG4gICAgICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgICAgICBsZXQgY29weSA9IHBhdGguc2xpY2UoMCk7XG4gICAgICAgICAgYihjaGlsZCwgY29weSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IG5vZGVQYXRoID0gbmV3IE5vZGVQYXRoKG5vZGUuaWQsIG5vZGUudXJsLCBwYXRoLCAnYm9va21hcmsnKTtcbiAgICAgICAgY29sbGVjdGlvbi5wdXNoKG5vZGVQYXRoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgYih0aGlzLnRyZWVbMF0sIFtdKTtcblxuICAgIHJldHVybiBjb2xsZWN0aW9uO1xuICB9XG5cbiAgbm9kZUhhc0NoaWxkcmVuKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZVsnY2hpbGRyZW4nXSAmJiBub2RlLmNoaWxkcmVuLmxlbmd0aCA+IDA7XG4gIH1cblxuICBhZGROb2RlKG5vZGUpIHtcbiAgICB0aGlzLmNvbGxlY3Rpb24ucHVzaChub2RlKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRyZWVNYXBwZXI7XG4iLCJjbGFzcyBVcGRhdGVyIHtcbiAgY29uc3RydWN0b3IodHJlZW1hcCwgaW5wdXRFbCwgcmVzdWx0c0VsKSB7XG4gICAgdGhpcy50cmVlbWFwID0gdHJlZW1hcDtcbiAgICB0aGlzLmlucHV0RWwgPSBpbnB1dEVsO1xuICAgIHRoaXMucmVzdWx0c0VsID0gcmVzdWx0c0VsO1xuICB9XG5cbiAgZmlsdGVyKHF1ZXJ5KSB7XG4gICAgdGhpcy5ib29rbWFya3MgPSB0aGlzLnRyZWVtYXAuZmlsdGVyKHF1ZXJ5KTtcbiAgICB0aGlzLnJlbmRlcihxdWVyeSk7XG4gICAgdGhpcy5yZXNpemUoKTtcbiAgfVxuXG4gIHJlbmRlcihxdWVyeSkge1xuICAgIGxldCBjb250ZW50ID0gRmluZHIudGVtcGxhdGVzLnJlc3VsdHMoe1xuICAgICAgcXVlcnk6IHF1ZXJ5LFxuICAgICAgYm9va21hcmtzOiB0aGlzLmJvb2ttYXJrc1xuICAgIH0pO1xuICAgIHRoaXMucmVzdWx0c0VsLmlubmVySFRNTCA9IGNvbnRlbnQ7XG4gIH1cblxuICAvLyBUT0RPOiBUaGlzIHJlYWxseSBpcyBqdXN0IHRocm93biBpbiBoZXJlIGFuZCBsaWtlbHkgZG9lcyBub3QgYmVsb25nXG4gIC8vIGluIHRoaXMgY2xhc3MuIENsZWFuIGl0IHVwIVxuICByZXNpemUoKSB7XG4gICAgbGV0IGRvY0hlaWdodCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgbGV0IGNvbnRlbnRIZWlnaHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWFpbicpLm9mZnNldEhlaWdodDtcbiAgICBpZiAoIGNvbnRlbnRIZWlnaHQgPCBkb2NIZWlnaHQgKSB7XG4gICAgICB2YXIgaCA9IGAke2NvbnRlbnRIZWlnaHR9cHhgO1xuICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5oZWlnaHQgPSBoO1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJodG1sXCIpWzBdLnN0eWxlLmhlaWdodCA9IGg7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVXBkYXRlcjtcbiJdfQ==
