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
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

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

          debugger;
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
        var h = '' + contentHeight + 'px';
        document.body.style.height = h;
        document.getElementsByTagName('html')[0].style.height = h;
      }
    }
  }]);

  return Updater;
})();

module.exports = Updater;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvd2Vic2l0ZXMvY2hyb21lX2V4dGVuc2lvbnMvZmluZHIvc3JjL2pzL3BvcHVwLmpzIiwiL3dlYnNpdGVzL2Nocm9tZV9leHRlbnNpb25zL2ZpbmRyL3NyYy9qcy9kb21fZWxlbWVudC5qcyIsIi93ZWJzaXRlcy9jaHJvbWVfZXh0ZW5zaW9ucy9maW5kci9zcmMvanMva2V5Ym9hcmQuanMiLCIvd2Vic2l0ZXMvY2hyb21lX2V4dGVuc2lvbnMvZmluZHIvc3JjL2pzL2tleWNvZGVzLmpzIiwiL3dlYnNpdGVzL2Nocm9tZV9leHRlbnNpb25zL2ZpbmRyL3NyYy9qcy9tYXRjaGVyLmpzIiwiL3dlYnNpdGVzL2Nocm9tZV9leHRlbnNpb25zL2ZpbmRyL3NyYy9qcy9tZXRhLmpzIiwiL3dlYnNpdGVzL2Nocm9tZV9leHRlbnNpb25zL2ZpbmRyL3NyYy9qcy9ub2RlX3BhdGguanMiLCIvd2Vic2l0ZXMvY2hyb21lX2V4dGVuc2lvbnMvZmluZHIvc3JjL2pzL3BheWxvYWQuanMiLCIvd2Vic2l0ZXMvY2hyb21lX2V4dGVuc2lvbnMvZmluZHIvc3JjL2pzL3Jlc3VsdHMuanMiLCIvd2Vic2l0ZXMvY2hyb21lX2V4dGVuc2lvbnMvZmluZHIvc3JjL2pzL3NlbGVjdGlvbnMuanMiLCIvd2Vic2l0ZXMvY2hyb21lX2V4dGVuc2lvbnMvZmluZHIvc3JjL2pzL3RyZWVfbWFwcGVyLmpzIiwiL3dlYnNpdGVzL2Nocm9tZV9leHRlbnNpb25zL2ZpbmRyL3NyYy9qcy91cGRhdGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsWUFBWSxDQUFDOzs7O3dCQUVRLFlBQVk7Ozs7b0JBQ2hCLFFBQVE7Ozs7d0JBQ0osYUFBYTs7Ozt1QkFDZCxXQUFXOzs7O3VCQUNYLFdBQVc7Ozs7MEJBQ1IsY0FBYzs7OzswQkFDZCxlQUFlOzs7O3VCQUNsQixX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N0IsZ0JBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDL0IsZ0JBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztPQUMzRDtLQUNGOzs7U0FyRkcsT0FBTzs7O0FBd0ZiLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IEtleWJvYXJkIGZyb20gJy4va2V5Ym9hcmQnO1xuaW1wb3J0IE1ldGEgZnJvbSAnLi9tZXRhJztcbmltcG9ydCBOb2RlUGF0aCBmcm9tICcuL25vZGVfcGF0aCc7XG5pbXBvcnQgUGF5bG9hZCBmcm9tICcuL3BheWxvYWQnO1xuaW1wb3J0IFJlc3VsdHMgZnJvbSAnLi9yZXN1bHRzJztcbmltcG9ydCBTZWxlY3Rpb25zIGZyb20gJy4vc2VsZWN0aW9ucyc7XG5pbXBvcnQgVHJlZU1hcHBlciBmcm9tICcuL3RyZWVfbWFwcGVyJztcbmltcG9ydCBVcGRhdGVyIGZyb20gJy4vdXBkYXRlcic7XG5cbigoKSA9PiB7XG4gIHZhciBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnB1dCcpO1xuICB2YXIgcmVzdWx0RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdWx0cycpO1xuXG4gIGxldCB1cGRhdGVyO1xuICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY2hyb21lLmJvb2ttYXJrcy5nZXRUcmVlKCh0cmVlKSA9PiB7XG4gICAgICByZXNvbHZlKG5ldyBUcmVlTWFwcGVyKHRyZWUpKTtcbiAgICB9KTtcbiAgfSkudGhlbigodHJlZW1hcCkgPT4ge1xuICAgIGNocm9tZS5oaXN0b3J5LnNlYXJjaCh7dGV4dDogJycsIG1heFJlc3VsdHM6IDEwfSwgKGh4KSA9PiB7XG4gICAgICBoeC5mb3JFYWNoKChyKSA9PiB7XG4gICAgICAgIHRyZWVtYXAuYWRkTm9kZShuZXcgTm9kZVBhdGgoci5pZCwgci51cmwsIFtyLnVybF0sICdoaXN0b3J5JykpO1xuICAgICAgfSk7XG4gICAgICB1cGRhdGVyID0gbmV3IFVwZGF0ZXIodHJlZW1hcCwgaW5wdXQsIHJlc3VsdEVsKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gUHVsbHMgc29tZSBzdG9yZWQgZGF0YSBhYm91dCBwYXN0IHNlbGVjdGlvbnMgaW50byBtZW1vcnkgZm9yIHVzZVxuICAvLyB3aGVuIGNhbGN1bGF0aW5nIHNjb3JlcyBsYXRlciBvbi5cbiAgU2VsZWN0aW9ucy5pbml0aWFsaXplKCk7XG5cbiAgLy8gU2V0IHVwIHRoZSBrZXlib2FyZCB0byBsaXN0ZW4gZm9yIGtleSBwcmVzc2VzIGFuZCBpbnRlcnByZXQgdGhlaXIga2V5Y29kZXNcbiAgdmFyIGtleWJvYXJkID0gbmV3IEtleWJvYXJkKCk7XG4gIGtleWJvYXJkLmxpc3RlbihpbnB1dCk7XG5cbiAgLy8gUmVzcG9uc2libGUgZm9yIHNlbGVjdGlvbiBtb3ZlbWVudCAmIGFjdGlvbnMgd2l0aGluIHRoZSByZXN1bHQgc2V0XG4gIHZhciByZXN1bHRzID0gbmV3IFJlc3VsdHMocmVzdWx0RWwpO1xuICB2YXIgbWV0YSA9IG5ldyBNZXRhKHJlc3VsdHMpO1xuXG4gIGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihmdW5jdGlvbihtZXNzYWdlLCBzZW5kZXIsIF9yZXNwKSB7XG4gICAgLy8gY29uc29sZS5sb2coJ3JlY2VpdmVkIG1lc3NhZ2U6ICcsIG1lc3NhZ2UpO1xuICAgIHN3aXRjaCAoIG1lc3NhZ2UudHlwZSApIHtcbiAgICAgIGNhc2UgJ2ZpbHRlcic6XG4gICAgICAgIHVwZGF0ZXIuZmlsdGVyKGlucHV0LnZhbHVlKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ21ldGEnOlxuICAgICAgICBtZXRhLnBlcmZvcm0obWVzc2FnZS5hY3Rpb24pO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAncGF5bG9hZCc6XG4gICAgICAgIFBheWxvYWQuc2F2ZUFuZE9wZW4oaW5wdXQudmFsdWUsIHJlc3VsdHMuc2VsZWN0ZWQoKSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBjb25zb2xlLmxvZygndW5oYW5kbGVkIG1lc3NhZ2UnLCBtZXNzYWdlLCBzZW5kZXIpO1xuICAgIH1cbiAgfSk7XG59KSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBET01FbGVtZW50IHtcbiAgc3RhdGljIGZvcihlbCkge1xuICAgIHJldHVybiBuZXcgRE9NRWxlbWVudChlbCk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihlbCkge1xuICAgIHRoaXMuZWwgPSBlbDtcbiAgfVxuXG4gIGlkKCkge1xuICAgIHJldHVybiB0aGlzLmVsLmdldEF0dHJpYnV0ZSgnZGF0YS1pZCcpO1xuICB9XG5cbiAgYWRkQ2xhc3Moa2xhc3MpIHtcbiAgICBpZiAoIHRoaXMuaGFzQ2xhc3Moa2xhc3MpICkgcmV0dXJuO1xuICAgIHRoaXMuZWwuY2xhc3NMaXN0LmFkZChrbGFzcyk7XG4gIH1cblxuICBoYXNDbGFzcyhrbGFzcykge1xuICAgIHJldHVybiB0aGlzLmVsLmNsYXNzTGlzdC5jb250YWlucyhrbGFzcyk7XG4gIH1cblxuICByZW1vdmVDbGFzcyhrbGFzcykge1xuICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZShrbGFzcyk7XG4gIH1cblxuICBtYXRjaChkb21FbCkge1xuICAgIHJldHVybiB0aGlzLmVsID09IGRvbUVsLmVsO1xuICB9XG5cbiAgdXJsKCkge1xuICAgIGxldCBhbmNob3IgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoJ2EnKTtcbiAgICBpZiAoICFhbmNob3IgKSByZXR1cm4gbnVsbDtcblxuICAgIHJldHVybiBhbmNob3IuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBET01FbGVtZW50O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgS2V5Y29kZXMgZnJvbSAnLi9rZXljb2Rlcyc7XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgS2V5Ym9hcmQge1xuICBsaXN0ZW4oZWwpIHtcbiAgICBlbC5vbmtleWRvd24gPSBLZXljb2Rlcy5vbmtleWRvd247XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmNsYXNzIEtleWNvZGVzIHtcbiAgc3RhdGljIG9ua2V5ZG93bihlKSB7XG4gICAgLy8gQXNzdW1lIGFueSBrZXlzdHJva2UgaXMgbWVhbnQgdG8gZnVydGhlciBmaWx0ZXIgcmVzdWx0cy4gQW55IG90aGVyXG4gICAgLy8gYWN0aW9uIG11c3QgYmUgZXhwbGljaXRseSBoYW5kbGVkIGZvciBoZXJlLlxuICAgIHZhciBtZXNzYWdlID0ge1xuICAgICAga2V5Y29kZTogZS5rZXlDb2RlLFxuICAgICAgdHlwZTogJ2ZpbHRlcicsXG4gICAgICBhY3Rpb246IG51bGxcbiAgICB9O1xuXG4gICAgc3dpdGNoICggZS5rZXlDb2RlICkge1xuICAgICAgY2FzZSAxMzogLy8gZW50ZXJcbiAgICAgICAgbWVzc2FnZS50eXBlID0gJ3BheWxvYWQnO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAxNzogLy8gY3RybFxuICAgICAgY2FzZSA5MzogLy8gY21kXG4gICAgICAgIG1lc3NhZ2UudHlwZSA9ICdub29wJztcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgMzg6IC8vIHVwIGFycm93XG4gICAgICAgIG1lc3NhZ2UudHlwZSA9ICdtZXRhJztcbiAgICAgICAgbWVzc2FnZS5hY3Rpb24gPSAnbW92ZVVwJztcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgNDA6IC8vIGRvd24gYXJyb3dcbiAgICAgICAgbWVzc2FnZS50eXBlID0gJ21ldGEnO1xuICAgICAgICBtZXNzYWdlLmFjdGlvbiA9ICdtb3ZlRG93bic7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIDc4OiAvLyBuXG4gICAgICAgIGlmICggZS5jdHJsS2V5ICkge1xuICAgICAgICAgIG1lc3NhZ2UudHlwZSA9ICdtZXRhJztcbiAgICAgICAgICBtZXNzYWdlLmFjdGlvbiA9ICdtb3ZlRG93bic7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgODA6IC8vIHBcbiAgICAgICAgaWYgKCBlLmN0cmxLZXkgKSB7XG4gICAgICAgICAgbWVzc2FnZS50eXBlID0gJ21ldGEnO1xuICAgICAgICAgIG1lc3NhZ2UuYWN0aW9uID0gJ21vdmVVcCc7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgfTtcblxuICAgIGNvbnNvbGUubG9nKCdrZXljb2Rlcy5qczogJywgbWVzc2FnZSk7XG5cbiAgICAvLyBFbWl0IG1lc3NhZ2Ugc28gdGhlIHByb3BlciBhY3Rpb24gY2FuIGJlIHRha2VuXG4gICAgaWYgKCBtZXNzYWdlLnR5cGUgIT0gJ25vb3AnICkge1xuICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UobWVzc2FnZSkgXG4gICAgfVxuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEtleWNvZGVzO1xuIiwiaW1wb3J0IFNlbGVjdGlvbnMgZnJvbSAnLi9zZWxlY3Rpb25zJztcblxuY2xhc3MgTWF0Y2hlciB7XG4gIGNvbnN0cnVjdG9yIChzdHJpbmcpIHtcbiAgICB0aGlzLnN0cmluZyA9IChzdHJpbmcgfHwgJycpLnRvTG93ZXJDYXNlKCk7XG4gICAgdGhpcy5wcmV2aW91c01hdGNoZXMgPSB7fTtcbiAgfVxuXG4gIG1hdGNoZXMocXVlcnksIHF1ZXJ5SWQpIHtcbiAgICBpZiAoIHRoaXMuaGFzTWF0Y2hEYXRhKHF1ZXJ5KSApIHJldHVybiB0aGlzLm1hdGNoRGF0YShxdWVyeSk7XG5cbiAgICBsZXQgbWF0Y2ggPSBmYWxzZTtcbiAgICBsZXQgbG9jYXRpb25zID0gW107XG4gICAgbGV0IHEgPSBxdWVyeS50b0xvd2VyQ2FzZSgpO1xuICAgIGxldCBxbGVuID0gcS5sZW5ndGg7XG4gICAgbGV0IGogPSAwO1xuXG4gICAgLy8gV2FzIHRoZSBsYXN0IGNoYXJhY3RlciBhIG1hdGNoP1xuICAgIGxldCBydW4gPSBmYWxzZTtcblxuICAgIGZvciAoIGxldCBpID0gMDsgaSA8IHRoaXMuc3RyaW5nLmxlbmd0aCAmJiAhbWF0Y2g7IGkrKykge1xuICAgICAgdmFyIHN0ckNoYXIgPSB0aGlzLmNoYXJBdChpKTtcbiAgICAgIHZhciBxdWVyeUNoYXIgPSBxW2pdO1xuXG4gICAgICBpZiAoIHN0ckNoYXIgIT0gcXVlcnlDaGFyICkge1xuICAgICAgICAvLyBXZSBmYWlsZWQgdG8gbWF0Y2ggc28gaWYgd2Ugd2VyZSBvbiBhIHJ1biwgaXQgaGFzIGVuZGVkXG4gICAgICAgIHJ1biA9IGZhbHNlO1xuICAgICAgfSBlbHNlIGlmICggcnVuICkge1xuICAgICAgICAvLyBUaGUgcHJldmlvdXMgaXRlcmF0aW9uIGZvdW5kIGEgbWF0Y2guIFRoYXQgbWVhbnMgd2UgYXJlIGN1cnJlbnRseVxuICAgICAgICAvLyBvbiBhIHJ1biBvZiBtYXRjaGluZyBjaGFyYWN0ZXJzLiBUaGlzIGlzIGFuIGVhc3kgc3RlcCBzaW5jZSB3ZVxuICAgICAgICAvLyBqdXN0IHdhbnQgdG8gaW5jcmVtZW50IHRoZSBlbmQgcG9zaXRpb24gZm9yIHRoZSBtb3N0IHJlY2VudFxuICAgICAgICAvLyBsb2NEYXRhIG9iamVjdCAoaW4gbG9jYXRpb25zKVxuICAgICAgICB2YXIgbGFzdCA9IGxvY2F0aW9ucy5wb3AoKTtcbiAgICAgICAgbGFzdFsxXSsrO1xuICAgICAgICBqKys7XG4gICAgICAgIGxvY2F0aW9ucy5wdXNoKGxhc3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gRmlyc3QgbWF0Y2ggd2UgaGF2ZSBzZWVuIGluIGF0IGxlYXN0IDEgZnVsbCBpdGVyYXRpb24uIElmIHRoZVxuICAgICAgICAvLyBuZXh0IGl0ZXJhdGlvbiBtYXRjaGVzLCBiZSBzdXJlIHRvIGFwcGVuZCB0byB0aGlzIGxvY0RhdGFcbiAgICAgICAgcnVuID0gdHJ1ZTtcblxuICAgICAgICAvLyBUaGluayBzbGljZSgpLiBMb2NhdGlvbiBkYXRhIHdpbGwgYmUgYW4gYXJyYXkgd2hlcmUgdGhlIGZpcnN0XG4gICAgICAgIC8vIHZhbHVlIGlzIHRoZSBpbmRleCBvZiB0aGUgZmlyc3QgbWF0Y2ggYW5kIHRoZSBzZWNvbmQgdmFsdWUgaXNcbiAgICAgICAgLy8gdGhlIGluZGV4IG9mIHRoZSBsYXN0IG1hdGNoLlxuICAgICAgICBsZXQgbG9jRGF0YSA9IFtpLCBpKzFdO1xuXG4gICAgICAgIC8vIE1hdGNoIHRoZSBsYXJnZXN0IGNodW5rcyBvZiBtYXRjaGluZyB0ZXh0IHRvZ2V0aGVyIVxuICAgICAgICAvLyBDaGVjayB0byBzZWUgaWYgdGhlIGxhc3QgY2hhcmFjdGVyIGluIHRoZSBxdWVyeSBzdHJpbmcgbWF0Y2hlc1xuICAgICAgICAvLyB0aGUgbGFzdCBjaGFyYWN0ZXIgaW4gdGhpcy5zdHJpbmcuIElmIHNvLCBzdGVhbCB0aGF0IGNoYXJhY3RlcnNcbiAgICAgICAgLy8gbG9jYXRpb24gZGF0YSAoZnJvbSB0aGUgcHJldmlvdXMgbG9jRGF0YSBmb3VuZCBhdCBsb2NhdGlvbnMubGFzdClcbiAgICAgICAgLy8gYW5kIHByZXBlbmQgaXQgdG8gdGhpcyBtYXRjaCBkYXRhLlxuICAgICAgICAvLyBGb3IgZXhhbXBsZSwgaWYgd2Ugd2FudCB0byBtYXRjaCAnZG0nLCBkb2luZyBhIFwiZmlyc3QgY29tZSwgZmlyc3RcbiAgICAgICAgLy8gbWF0Y2hcIiB3b3VsZCBwcm9kdWNlIHRoaXMgbWF0Y2ggKG1hdGNoZXMgYXJlIGluIGNhcHMpOlxuICAgICAgICAvLyAgICcvRHovYS9kTW96J1xuICAgICAgICAvLyBIb3dldmVyLCB3ZSB3YW50IHRvIG1hdGNoIGFzIG1hbnkgY29uc2VjdXRpdmUgc3RyaW5ncyBhcyBwb3NzaWJsZSxcbiAgICAgICAgLy8gdGh1cyB0aGUgbWF0Y2ggc2hvdWxkIGJlOlxuICAgICAgICAvLyAgICcvZHovYS9ETSdcbiAgICAgICAgbGV0IGNvbnQgPSB0cnVlO1xuICAgICAgICBmb3IgKCB2YXIgayA9IDE7IGsgPD0gaSAmJiBjb250OyBrKyspIHtcbiAgICAgICAgICBsZXQgcHJldlN0ckNoYXIgPSB0aGlzLmNoYXJBdChpIC0gayk7XG4gICAgICAgICAgbGV0IHByZXZRdWVyeUNoYXIgPSBxW2ogLSBrXTtcbiAgICAgICAgICBjb250ID0gcHJldlN0ckNoYXIgPT0gcHJldlF1ZXJ5Q2hhcjtcbiAgICAgICAgICBpZiAoIGNvbnQgKSB7XG4gICAgICAgICAgICAvLyBxdWVyeTogZG1cbiAgICAgICAgICAgIC8vIHN0cmluZzogZnNkbHNkbW96XG4gICAgICAgICAgICAvLyBwcmV2OiBbMiwzXSAtLT4gWzIsMl0gLS0+IHJlbW92ZSBpdFxuICAgICAgICAgICAgLy8gY3VycjogWzYsN10gLS0+IFs1LDddXG4gICAgICAgICAgICBsZXQgcHJldkxvY0RhdGEgPSBsb2NhdGlvbnMucG9wKCk7XG4gICAgICAgICAgICBwcmV2TG9jRGF0YVsxXS0tO1xuXG4gICAgICAgICAgICAvLyBPbmx5IHBlcnNpc3QgdGhlIHByZXZpb3VzIGxvY2F0aW9uIGRhdGEgaWYgaXQgaGFzIGF0IGxlYXN0IDEgbWF0Y2hcbiAgICAgICAgICAgIGlmICggcHJldkxvY0RhdGFbMF0gPCBwcmV2TG9jRGF0YVsxXSApIGxvY2F0aW9ucy5wdXNoKHByZXZMb2NEYXRhKTtcblxuICAgICAgICAgICAgLy8gTm93LCBtb3ZlIHRoZSBzdGFydCBwb3NpdGlvbiBiYWNrIDEgZm9yIHRoZSBjdXJyZW50IG1hdGNoXG4gICAgICAgICAgICBsb2NEYXRhWzBdLS07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxvY2F0aW9ucy5wdXNoKGxvY0RhdGEpO1xuICAgICAgICBqKys7XG4gICAgICB9XG5cbiAgICAgIG1hdGNoID0gKCBqID09IHFsZW4gKTtcbiAgICB9XG5cbiAgICBpZiAoIG1hdGNoICkge1xuICAgICAgdGhpcy5zZXRNYXRjaERhdGEocXVlcnksIHF1ZXJ5SWQsIG1hdGNoLCBsb2NhdGlvbnMpO1xuICAgIH1cblxuICAgIHJldHVybiBtYXRjaDtcbiAgfVxuXG4gIHNldE1hdGNoRGF0YShxdWVyeSwgcXVlcnlJZCwgYm9vbCwgbG9jYXRpb25zKSB7XG4gICAgbGV0IHNjb3JlID0gdGhpcy5jYWxjTG9jYXRpb25TY29yZShsb2NhdGlvbnMpO1xuICAgIGxldCBzZWxlY3Rpb25Db3VudCA9IHRoaXMucHJldmlvdXNTZWxlY3Rpb25Db3VudChxdWVyeSwgcXVlcnlJZCk7XG4gICAgc3dpdGNoICggdHJ1ZSApIHtcbiAgICAgIGNhc2UgKCBzZWxlY3Rpb25Db3VudCA+IDEgJiYgc2VsZWN0aW9uQ291bnQgPCA0ICk6XG4gICAgICAgIHNjb3JlID0gc2NvcmUgKiBzZWxlY3Rpb25Db3VudDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICggc2VsZWN0aW9uQ291bnQgPj0gNCAmJiBzZWxlY3Rpb25Db3VudCA8IDYgKTpcbiAgICAgICAgc2NvcmUgPSBzY29yZSAqIDQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAoIHNlbGVjdGlvbkNvdW50ID49IDYgJiYgc2VsZWN0aW9uQ291bnQgPCAxMCApOlxuICAgICAgICBzY29yZSA9IHNjb3JlICogNTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICggc2VsZWN0aW9uQ291bnQgPj0gMTAgKTpcbiAgICAgICAgc2NvcmUgPSBzY29yZSAqIDY7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHRoaXMucHJldmlvdXNNYXRjaGVzW3F1ZXJ5XSA9IHtcbiAgICAgIG1hdGNoOiBib29sLFxuICAgICAgbG9jYXRpb25zOiBsb2NhdGlvbnMsXG4gICAgICBzY29yZTogc2NvcmVcbiAgICB9O1xuICB9XG5cbiAgY2FsY0xvY2F0aW9uU2NvcmUobG9jYXRpb25zKSB7XG4gICAgLy8gU2ltcGx5IGRvdWJsZSB0aGUgbGVuZ3RoIG9mIGVhY2ggbWF0Y2ggbGVuZ3RoLlxuICAgIHJldHVybiBsb2NhdGlvbnMubWFwKChtYXRjaCkgPT4ge1xuICAgICAgbGV0IG1hdGNoTGVuZ3RoID0gTWF0aC5hYnMobWF0Y2hbMF0gLSBtYXRjaFsxXSk7XG4gICAgICBsZXQgbXVsdGlwbGllciA9IG1hdGNoTGVuZ3RoID09IDEgPyAxIDogMjtcblxuICAgICAgbGV0IHN0YXJ0c1dpdGhTbGFzaCA9IHRoaXMuc3RyaW5nW21hdGNoWzBdXSA9PSAnLydcbiAgICAgIGlmICggc3RhcnRzV2l0aFNsYXNoICYmIG1hdGNoTGVuZ3RoID4gMSApIG11bHRpcGxpZXIgKz0gMTtcbiAgICAgIHJldHVybiBtYXRjaExlbmd0aCAqIG11bHRpcGxpZXI7XG5cbiAgICB9LCB0aGlzKS5yZWR1Y2UoKGEsIGIpID0+IHtcbiAgICAgIHJldHVybiBhICsgYjtcbiAgICB9LCAwKTtcbiAgfVxuXG4gIHByZXZpb3VzU2VsZWN0aW9uQ291bnQocXVlcnksIHF1ZXJ5SWQpIHtcbiAgICByZXR1cm4gU2VsZWN0aW9ucy5nZXRDb3VudChxdWVyeSwgcXVlcnlJZCk7XG4gIH1cblxuICBoYXNNYXRjaERhdGEocXVlcnkpIHtcbiAgICByZXR1cm4gISF0aGlzLm1hdGNoRGF0YShxdWVyeSk7XG4gIH1cblxuICBtYXRjaERhdGEocXVlcnkpIHtcbiAgICByZXR1cm4gdGhpcy5wcmV2aW91c01hdGNoZXNbcXVlcnldO1xuICB9XG5cbiAgY2hhckF0KGkpIHtcbiAgICByZXR1cm4gdGhpcy5zdHJpbmcuY2hhckF0KGkpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWF0Y2hlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuY2xhc3MgTWV0YSB7XG4gIGNvbnN0cnVjdG9yKHJlc3VsdHMpIHtcbiAgICB0aGlzLnJlc3VsdHMgPSByZXN1bHRzO1xuICB9XG5cbiAgcGVyZm9ybShhY3Rpb24pIHtcbiAgICAvLyBjb25zb2xlLmxvZyhgcGVyZm9ybTogJHthY3Rpb259YCk7XG4gICAgdGhpc1thY3Rpb25dKCk7XG4gIH1cblxuICBtb3ZlVXAoKSB7XG4gICAgdmFyIGl0ZW0gPSB0aGlzLnJlc3VsdHMuc2VsZWN0ZWQoKTtcbiAgICB2YXIgcHJldiA9IHRoaXMucmVzdWx0cy5wcmV2aW91cyhpdGVtKTtcblxuICAgIGlmICggcHJldiAmJiBpdGVtICE9IHByZXYgKSB7XG4gICAgICB0aGlzLnJlc3VsdHMudW5zZWxlY3QoaXRlbSk7XG4gICAgICB0aGlzLnJlc3VsdHMuc2VsZWN0KHByZXYpO1xuICAgIH1cbiAgfVxuXG4gIG1vdmVEb3duKCkge1xuICAgIHZhciBpdGVtID0gdGhpcy5yZXN1bHRzLnNlbGVjdGVkKCk7XG4gICAgdmFyIG5leHQgPSB0aGlzLnJlc3VsdHMubmV4dChpdGVtKTtcblxuICAgIGlmICggbmV4dCAmJiBpdGVtICE9IG5leHQgKSB7XG4gICAgICB0aGlzLnJlc3VsdHMudW5zZWxlY3QoaXRlbSk7XG4gICAgICB0aGlzLnJlc3VsdHMuc2VsZWN0KG5leHQpO1xuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNZXRhO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgTWF0Y2hlciBmcm9tICcuL21hdGNoZXInO1xuXG5sZXQgUEFUSF9CT05VUyA9IDI7XG5cbmNsYXNzIE5vZGVQYXRoIHtcbiAgY29uc3RydWN0b3IoaWQsIHVybCwgcGllY2VzLCBzb3VyY2U9J2Jvb2ttYXJrJykge1xuICAgIHRoaXMuaWQgPSBpZDtcbiAgICB0aGlzLnVybCA9IHVybDtcbiAgICB0aGlzLnBpZWNlcyA9IHBpZWNlcztcbiAgICB0aGlzLnBhdGggPSBwaWVjZXMuam9pbignLycpO1xuICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgIHRoaXMubWF0Y2hlcnMgPSB7XG4gICAgICBwYXRoOiBuZXcgTWF0Y2hlcih0aGlzLnBhdGgpLFxuICAgICAgdXJsOiBuZXcgTWF0Y2hlcih0aGlzLnVybClcbiAgICB9O1xuICB9XG5cbiAgaXNFeGNsdWRlZChleGNsdXNpb25zKSB7XG4gICAgcmV0dXJuIGV4Y2x1c2lvbnNbdGhpcy5zb3VyY2VdO1xuICB9XG5cbiAgbG9vc2VNYXRjaChxKSB7XG4gICAgdmFyIGEgPSB0aGlzLm1hdGNoRm9yKCdwYXRoJywgcSk7XG4gICAgdmFyIGIgPSB0aGlzLm1hdGNoRm9yKCd1cmwnLCBxKTtcbiAgICByZXR1cm4gYSB8fCBiO1xuICB9XG5cbiAgbWF0Y2hGb3IodHlwZSwgcSkge1xuICAgIHJldHVybiB0aGlzLm1hdGNoZXJzW3R5cGVdLm1hdGNoZXMocSwgdGhpcy5pZCk7XG4gIH1cblxuICBtYXRjaFNjb3JlKHEpIHtcbiAgICB2YXIgYSA9ICh0aGlzLm1hdGNoRGF0YUZvcigncGF0aCcsIHEpIHx8IHtzY29yZTowfSkuc2NvcmU7XG5cbiAgICAvLyBHaXZlIHRoZSBwYXRoIGFuIGFyYml0cmFyeSBcImJvbnVzXCIgc28gYSBwYXRoIG1hdGNoIHdpbGwgY2FycnlcbiAgICAvLyBncmVhdGVyIHdlaWdodCB0aGFuIGEgdXJsIG1hdGNoLlxuICAgIGlmICggYSA+IDAgKSBhID0gYSArIFBBVEhfQk9OVVM7XG5cbiAgICB2YXIgYiA9ICh0aGlzLm1hdGNoRGF0YUZvcigndXJsJywgcSkgfHwge3Njb3JlOjB9KS5zY29yZTtcbiAgICByZXR1cm4gTWF0aC5tYXgoYSxiKTtcbiAgfVxuXG4gIG1hdGNoRGF0YUZvcih0eXBlLCBxKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2hlcnNbdHlwZV0ubWF0Y2hEYXRhKHEsIHRoaXMuaWQpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTm9kZVBhdGg7XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBTZWxlY3Rpb25zIGZyb20gJy4vc2VsZWN0aW9ucyc7XG5cbmNsYXNzIFBheWxvYWQge1xuICBzdGF0aWMgc2F2ZUFuZE9wZW4ocXVlcnksIHNlbGVjdGVkKSB7XG4gICAgbGV0IHVybCA9IHNlbGVjdGVkLnVybCgpO1xuICAgIGlmICggIXVybCApIHJldHVybjtcblxuICAgIFNlbGVjdGlvbnMuYWRkKHF1ZXJ5LCBzZWxlY3RlZC5pZCgpKTtcbiAgICAvLyBjaHJvbWUuc3RvcmFnZS5zeW5jLmdldChudWxsLCAoaSkgPT4geyBjb25zb2xlLmxvZyhpKTsgfSk7XG5cbiAgICBpZiAoIHVybCApIHtcbiAgICAgIGNocm9tZS50YWJzLmNyZWF0ZSh7IHVybDogdXJsIH0pO1xuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQYXlsb2FkO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgRE9NRWxlbWVudCBmcm9tICcuL2RvbV9lbGVtZW50JztcblxuY2xhc3MgUmVzdWx0c0RPTSB7XG4gIGNvbnN0cnVjdG9yKGNvbnRhaW5lcikge1xuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuICB9XG5cbiAgaXRlbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5yZXN1bHQuYm94Jyk7XG4gIH1cblxuICBmaXJzdCgpIHtcbiAgICBsZXQgaXRlbSA9IHRoaXMuaXRlbXNbMF07XG4gICAgcmV0dXJuIHRoaXMuZG9tRWxPck51bGwoaXRlbSk7XG4gIH1cblxuICBsYXN0KCkge1xuICAgIGxldCBsaXN0ID0gdGhpcy5pdGVtcygpO1xuICAgIGxldCBpdGVtID0gbGlzdFtsaXN0Lmxlbmd0aCAtIDFdO1xuICAgIHJldHVybiB0aGlzLmRvbUVsT3JOdWxsKGl0ZW0pO1xuICB9XG5cbiAgc2VsZWN0ZWQoKSB7XG4gICAgbGV0IGl0ZW0gPSB0aGlzLmNvbnRhaW5lci5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzZWxlY3RlZCcpWzBdO1xuICAgIHJldHVybiB0aGlzLmRvbUVsT3JOdWxsKGl0ZW0pO1xuICB9XG5cbiAgLy8gR2V0IHRoZSBuZXh0IGVsZW1lbnQgaW4gdGhlIGxpc3QgcmVsYXRpdmUgdG8gdGhlIHByb3ZpZGVkIGRvbUVsXG4gIG5leHQoZG9tRWwpIHtcbiAgICBpZiAoICFkb21FbCApIHJldHVybiB0aGlzLmZpcnN0KCk7XG5cbiAgICBsZXQgaW5kZXggPSB0aGlzLmluZGV4T2YoZG9tRWwpO1xuICAgIGxldCBpdGVtcyA9IHRoaXMuaXRlbXMoKTtcbiAgICBsZXQgbmV4dCA9IGl0ZW1zW2luZGV4ICsgMV07XG4gICAgaWYgKCAhbmV4dCApIG5leHQgPSB0aGlzLmxhc3QoKTtcbiAgICByZXR1cm4gdGhpcy5kb21FbE9yTnVsbChuZXh0KTtcbiAgfVxuXG4gIHByZXZpb3VzKGRvbUVsKSB7XG4gICAgaWYgKCAhZG9tRWwgKSByZXR1cm4gbnVsbDtcblxuICAgIGxldCBpbmRleCA9IHRoaXMuaW5kZXhPZihkb21FbCk7XG4gICAgbGV0IGl0ZW1zID0gdGhpcy5pdGVtcygpO1xuICAgIGxldCBwcmV2ID0gaXRlbXNbaW5kZXggLSAxXTtcbiAgICByZXR1cm4gdGhpcy5kb21FbE9yTnVsbChwcmV2KTtcbiAgfVxuXG4gIGRvbUVsT3JOdWxsKGVsKSB7XG4gICAgaWYgKCAhZWwgKSByZXR1cm4gbnVsbDtcbiAgICAvLyBlbCBpcyBhbHJlYWR5IGEgRE9NRUxlbWVudFxuICAgIGlmICggISEodHlwZW9mIGVsID09ICdvYmplY3QnICYmIGVsWydlbCddKSApIHJldHVybiBlbDtcbiAgICByZXR1cm4gbmV3IERPTUVsZW1lbnQoZWwpO1xuICB9XG5cbiAgLy8gQWRkICdzZWxlY3RlZCcgY2xhc3MgdG8gdGhlIHByb3ZpZGVkIGRvbUVsXG4gIHNlbGVjdChkb21FbCkge1xuICAgIGlmICggIWRvbUVsICkgZG9tRWwgPSB0aGlzLmxhc3QoKTtcbiAgICBkb21FbC5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcbiAgfVxuXG4gIC8vIFJlbW92ZSAnc2VsZWN0ZWQnIGNsYXNzIGZyb20gdGhlIHByb3ZpZGVkIGRvbUVsXG4gIHVuc2VsZWN0KGRvbUVsKSB7XG4gICAgaWYgKCAhZG9tRWwgKSByZXR1cm47XG4gICAgZG9tRWwucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gIH1cblxuICB1bnNlbGVjdEFsbCgpIHtcbiAgICB0aGlzLmVhY2goKGRvbUVsKSA9PiB7IHRoaXMudW5zZWxlY3QoZG9tRWwpIH0pO1xuICB9XG5cbiAgZWFjaChmbiwgYXJncz17fSkge1xuICAgIGxldCBib3VuZCA9IGZuLmJpbmQodGhpcyk7XG4gICAgbGV0IGl0ZW1zID0gdGhpcy5pdGVtcygpO1xuICAgIGZvciAoIGxldCBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrICkge1xuICAgICAgYm91bmQobmV3IERPTUVsZW1lbnQoaXRlbXNbaV0pLCBhcmdzLCBpKTtcbiAgICB9XG4gIH1cblxuICBpbmRleE9mKGRvbUVsKSB7XG4gICAgbGV0IGl0ZW1zID0gdGhpcy5pdGVtcygpO1xuICAgIGxldCBpbmRleDtcbiAgICBmb3IgKCBsZXQgaSA9IDA7ICFpbmRleCAmJiBpIDwgaXRlbXMubGVuZ3RoOyBpKysgKSB7XG4gICAgICBpZiAoIGRvbUVsLmVsID09IGl0ZW1zW2ldICkgaW5kZXggPSBpO1xuICAgIH1cbiAgICByZXR1cm4gaW5kZXg7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSZXN1bHRzRE9NO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5sZXQgU1RPUkVEX0lURU1TID0gbnVsbDtcbmxldCBTVE9SQUdFX0tFWSA9ICdzZWwnO1xuXG5jbGFzcyBTZWxlY3Rpb25zIHtcbiAgc3RhdGljIGluaXRpYWxpemUoKSB7XG4gICAgaWYgKCBTVE9SRURfSVRFTVMgKSByZXR1cm47XG5cbiAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLmdldChudWxsLCAoc3RvcmVkX2l0ZW1zKSA9PiB7XG4gICAgICBTVE9SRURfSVRFTVMgPSBzdG9yZWRfaXRlbXM7XG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgZ2V0Q291bnQocXVlcnksIGlkKSB7XG4gICAgbGV0IGEgPSB0aGlzLmdldChxdWVyeSk7XG4gICAgaWYgKCBhICYmIGFbaWRdICkge1xuICAgICAgcmV0dXJuIGFbaWRdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgZ2V0KHF1ZXJ5KSB7XG4gICAgbGV0IGtleSA9IHRoaXMuX25hbWVzcGFjZShxdWVyeSk7XG4gICAgcmV0dXJuIFNUT1JFRF9JVEVNU1trZXldO1xuICB9XG5cbiAgc3RhdGljIHNldChxdWVyeSwgdmFsdWUpIHtcbiAgICBsZXQga2V5ID0gdGhpcy5fbmFtZXNwYWNlKHF1ZXJ5KTtcbiAgICBTVE9SRURfSVRFTVNba2V5XSA9IHZhbHVlO1xuICB9XG5cbiAgc3RhdGljIGFkZChxdWVyeSwgaWQpIHtcbiAgICBsZXQgb2JqID0gdGhpcy5nZXQocXVlcnkpO1xuXG4gICAgaWYgKCAhb2JqICkgb2JqID0ge307XG4gICAgaWYgKCAhb2JqW2lkXSApIG9ialtpZF0gPSAwO1xuICAgIG9ialtpZF0gKz0gMTtcblxuICAgIHRoaXMuc2V0KHF1ZXJ5LCBvYmopO1xuICAgIHRoaXMuX3NhdmUocXVlcnksIG9iaik7XG4gIH1cblxuICBzdGF0aWMgX25hbWVzcGFjZShxdWVyeSkge1xuICAgIHJldHVybiBbU1RPUkFHRV9LRVksIHF1ZXJ5XS5qb2luKCcuJyk7XG4gIH1cblxuICBzdGF0aWMgX3NhdmUocXVlcnksIHZhbHVlKSB7XG4gICAgbGV0IGtleSA9IHRoaXMuX25hbWVzcGFjZShxdWVyeSk7XG4gICAgbGV0IHRtcCA9IHt9O1xuICAgIHRtcFtrZXldID0gdmFsdWU7XG4gICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQodG1wKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTZWxlY3Rpb25zO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgTm9kZVBhdGggZnJvbSAnLi9ub2RlX3BhdGgnO1xuXG5jbGFzcyBUcmVlTWFwcGVyIHtcbiAgY29uc3RydWN0b3IodHJlZSkge1xuICAgIHRoaXMudHJlZSA9IHRyZWU7XG4gICAgdGhpcy5jb2xsZWN0aW9uID0gdGhpcy5wYXJzZSgpO1xuICB9XG5cbiAgZmlsdGVyKHF1ZXJ5LCBleGNsdXNpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMuY29sbGVjdGlvbi5maWx0ZXIoKG5vZGVwYXRoKSA9PiB7XG4gICAgICByZXR1cm4gIW5vZGVwYXRoLmlzRXhjbHVkZWQoZXhjbHVzaW9ucykgJiYgbm9kZXBhdGgubG9vc2VNYXRjaChxdWVyeSk7XG4gICAgfSkuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICByZXR1cm4gYi5tYXRjaFNjb3JlKHF1ZXJ5KSAtIGEubWF0Y2hTY29yZShxdWVyeSk7XG4gICAgfSk7XG4gIH1cblxuICBwYXJzZSgpIHtcbiAgICBsZXQgY29sbGVjdGlvbiA9IFtdO1xuXG4gICAgdmFyIGIgPSAobm9kZSwgcGF0aCkgPT4ge1xuICAgICAgcGF0aC5wdXNoKG5vZGUudGl0bGUpO1xuXG4gICAgICBpZiAoIHRoaXMubm9kZUhhc0NoaWxkcmVuKG5vZGUpICkge1xuICAgICAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICAgICAgbGV0IGNvcHkgPSBwYXRoLnNsaWNlKDApO1xuICAgICAgICAgIGIoY2hpbGQsIGNvcHkpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBub2RlUGF0aCA9IG5ldyBOb2RlUGF0aChub2RlLmlkLCBub2RlLnVybCwgcGF0aCwgJ2Jvb2ttYXJrJyk7XG4gICAgICAgIGNvbGxlY3Rpb24ucHVzaChub2RlUGF0aCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGIodGhpcy50cmVlWzBdLCBbXSk7XG5cbiAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgfVxuXG4gIG5vZGVIYXNDaGlsZHJlbihub2RlKSB7XG4gICAgcmV0dXJuIG5vZGVbJ2NoaWxkcmVuJ10gJiYgbm9kZS5jaGlsZHJlbi5sZW5ndGggPiAwO1xuICB9XG5cbiAgYWRkTm9kZShub2RlKSB7XG4gICAgdGhpcy5jb2xsZWN0aW9uLnB1c2gobm9kZSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUcmVlTWFwcGVyO1xuIiwiY2xhc3MgVXBkYXRlciB7XG4gIGNvbnN0cnVjdG9yKHRyZWVtYXAsIGlucHV0RWwsIHJlc3VsdHNFbCkge1xuICAgICB0aGlzLnRyZWVtYXAgPSB0cmVlbWFwO1xuICAgIHRoaXMuaW5wdXRFbCA9IGlucHV0RWw7XG4gICAgdGhpcy5yZXN1bHRzRWwgPSByZXN1bHRzRWw7XG4gIH1cblxuICBmaWx0ZXIocXVlcnkpIHtcbiAgICBsZXQge21vZHEsIGV4Y2x1c2lvbnN9ID0gdGhpcy5leGNsdXNpb25zKHF1ZXJ5KTtcblxuICAgIGNvbnNvbGUubG9nKCdleGNsdXNpb25zJywgbW9kcSwgZXhjbHVzaW9ucyk7XG5cbiAgICB0aGlzLmJvb2ttYXJrcyA9IHRoaXMudHJlZW1hcC5maWx0ZXIobW9kcSwgZXhjbHVzaW9ucyk7XG4gICAgdGhpcy5yZW5kZXIocXVlcnkpO1xuICAgIHRoaXMucmVzaXplKCk7XG4gIH1cblxuICBleGNsdXNpb25zKHF1ZXJ5KSB7XG4gICAgbGV0IG1vZHEgPSBxdWVyeTtcbiAgICBsZXQgZGVmYXVsdHMgPSB7XG4gICAgICBoaXN0b3J5OiBmYWxzZSxcbiAgICAgIGJvb2ttYXJrOiBmYWxzZVxuICAgIH07XG5cbiAgICAvLyBUaGUgZm9sbG93aW5nIHJlZ2V4IFNIT1VMRCBjYXB0dXJlIGp1c3QgdGhlIGZsYWcuIFNlZTpcbiAgICAvLyAgIGh0dHBzOi8vcmVnZXgxMDEuY29tL3IvbUcydEgwLzNcbiAgICBsZXQgY2FwdHVyZSA9IHRoaXMuaW5wdXRFbC52YWx1ZS5tYXRjaCgvXihofGIpOiguKil8KC4qKSg/OlxccyktKGh8YikkLyk7XG5cbiAgICBpZiAoIGNhcHR1cmUgKSB7XG4gICAgICBpZiAoIGNhcHR1cmVbMV0gKSB7IC8vIGluY2x1c2lvbiBub3RhdGlvbiAoYjpmb28pXG4gICAgICAgIGxldCBmbGFnID0gY2FwdHVyZVsxXTtcbiAgICAgICAgbW9kcSA9IGNhcHR1cmVbMl07XG4gICAgICAgIGxldCBmbGFnX25hbWUgPSB7XG4gICAgICAgICAgaDogJ2hpc3RvcnknLFxuICAgICAgICAgIGI6ICdib29rbWFyaydcbiAgICAgICAgfVtmbGFnXTtcblxuICAgICAgICBpZiAoIGZsYWdfbmFtZSAmJiBkZWZhdWx0c1tmbGFnX25hbWVdICE9IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgIGhpc3Rvcnk6IHRydWUsXG4gICAgICAgICAgICBib29rbWFyazogdHJ1ZVxuICAgICAgICAgIH07XG4gICAgICAgICAgZGVmYXVsdHNbZmxhZ19uYW1lXSA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZGVidWdnZXJcblxuICAgICAgfSBlbHNlIGlmICggY2FwdHVyZVs0XSApIHsgLy8gZXhjbHVzaW9uIG5vdGF0aW9uIChmb28gLWIpXG4gICAgICAgIG1vZHEgPSBjYXB0dXJlWzNdO1xuICAgICAgICBsZXQgZmxhZyA9IGNhcHR1cmVbNF07XG4gICAgICAgIGxldCBmbGFnX25hbWUgPSB7XG4gICAgICAgICAgaDogJ2hpc3RvcnknLFxuICAgICAgICAgIGI6ICdib29rbWFyaydcbiAgICAgICAgfVtmbGFnXTtcblxuICAgICAgICBpZiAoIGZsYWdfbmFtZSAmJiBkZWZhdWx0c1tmbGFnX25hbWVdICE9IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICBkZWZhdWx0c1tmbGFnX25hbWVdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBtb2RxOiBtb2RxLFxuICAgICAgZXhjbHVzaW9uczogZGVmYXVsdHNcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKHF1ZXJ5KSB7XG4gICAgbGV0IGNvbnRlbnQgPSBGaW5kci50ZW1wbGF0ZXMucmVzdWx0cyh7XG4gICAgICBxdWVyeTogcXVlcnksXG4gICAgICBib29rbWFya3M6IHRoaXMuYm9va21hcmtzXG4gICAgfSk7XG4gICAgdGhpcy5yZXN1bHRzRWwuaW5uZXJIVE1MID0gY29udGVudDtcbiAgfVxuXG4gIC8vIFRPRE86IFRoaXMgcmVhbGx5IGlzIGp1c3QgdGhyb3duIGluIGhlcmUgYW5kIGxpa2VseSBkb2VzIG5vdCBiZWxvbmdcbiAgLy8gaW4gdGhpcyBjbGFzcy4gQ2xlYW4gaXQgdXAhXG4gIHJlc2l6ZSgpIHtcbiAgICBsZXQgZG9jSGVpZ2h0ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50Lm9mZnNldEhlaWdodDtcbiAgICBsZXQgY29udGVudEhlaWdodCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtYWluJykub2Zmc2V0SGVpZ2h0O1xuICAgIGlmICggY29udGVudEhlaWdodCA8IGRvY0hlaWdodCApIHtcbiAgICAgIHZhciBoID0gYCR7Y29udGVudEhlaWdodH1weGA7XG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmhlaWdodCA9IGg7XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImh0bWxcIilbMF0uc3R5bGUuaGVpZ2h0ID0gaDtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBVcGRhdGVyO1xuIl19
