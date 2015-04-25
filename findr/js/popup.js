(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _Keyboard = require('./keyboard');

var _Keyboard2 = _interopRequireWildcard(_Keyboard);

var _Meta = require('./meta');

var _Meta2 = _interopRequireWildcard(_Meta);

var _NodePath = require('./node_path');

var _NodePath2 = _interopRequireWildcard(_NodePath);

var _TreeMapper = require('./tree_mapper');

var _TreeMapper2 = _interopRequireWildcard(_TreeMapper);

var _Updater = require('./updater');

var _Updater2 = _interopRequireWildcard(_Updater);

(function () {
  var input = document.getElementById('input');
  var results = document.getElementById('results');

  var updater = undefined;
  new Promise(function (resolve, reject) {
    chrome.bookmarks.getTree(function (tree) {
      resolve(new _TreeMapper2['default'](tree));
    });
  }).then(function (treemap) {
    chrome.history.search({ text: '', maxResults: 10 }, function (hx) {
      hx.forEach(function (r) {
        treemap.addNode(new _NodePath2['default'](r.url, [r.url], 'history'));
      });
      updater = new _Updater2['default'](treemap, input, results);
    });
  });

  // Set up the keyboard to listen for key presses and interpret their keycodes
  var keyboard = new _Keyboard2['default']();
  keyboard.listen(input);

  // Responsible for selection movement & actions within the result set
  var meta = new _Meta2['default'](results);

  chrome.runtime.onMessage.addListener(function (message, sender, _resp) {
    console.log('received message: ', message);
    switch (message.type) {
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

},{"./keyboard":3,"./meta":6,"./node_path":7,"./tree_mapper":9,"./updater":10}],2:[function(require,module,exports){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var DOMElement = (function () {
  function DOMElement(el) {
    _classCallCheck(this, DOMElement);

    this.el = el;
  }

  _createClass(DOMElement, [{
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
          message.type = 'meta';
          message.action = 'openURL';
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

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var Matcher = (function () {
  function Matcher(string) {
    _classCallCheck(this, Matcher);

    this.string = (string || '').toLowerCase();
    this.previousMatches = {};
  }

  _createClass(Matcher, [{
    key: 'matches',
    value: function matches(query) {
      if (this.hasMatchData(query)) {
        return this.matchData(query);
      }var foo = this.string;

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
        this.setMatchData(query, match, locations);
      }

      return match;
    }
  }, {
    key: 'setMatchData',
    value: function setMatchData(query, bool, locations) {
      this.previousMatches[query] = {
        match: bool,
        locations: locations,
        score: this.calculateScoreFor(locations)
      };
    }
  }, {
    key: 'calculateScoreFor',
    value: function calculateScoreFor(locations) {
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

},{}],6:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _ResultsDOM = require('./results_dom');

var _ResultsDOM2 = _interopRequireWildcard(_ResultsDOM);

var Meta = (function () {
  function Meta(list) {
    _classCallCheck(this, Meta);

    this.list = new _ResultsDOM2['default'](list);
  }

  _createClass(Meta, [{
    key: 'perform',
    value: function perform(action) {
      console.log('perform: ' + action);
      this[action]();
    }
  }, {
    key: 'openURL',
    value: function openURL() {
      var item = this.list.selected();
      var url = item.url();
      if (url) chrome.tabs.create({ url: url });
    }
  }, {
    key: 'moveUp',
    value: function moveUp() {
      var item = this.list.selected();
      var prev = this.list.previous(item);

      if (prev && item != prev) {
        this.list.unselect(item);
        this.list.select(prev);
      }
    }
  }, {
    key: 'moveDown',
    value: function moveDown() {
      var item = this.list.selected();
      var next = this.list.next(item);

      if (next && item != next) {
        this.list.unselect(item);
        this.list.select(next);
      }
    }
  }]);

  return Meta;
})();

;

module.exports = Meta;

},{"./results_dom":8}],7:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _Matcher = require('./matcher');

var _Matcher2 = _interopRequireWildcard(_Matcher);

var NodePath = (function () {
  function NodePath(url, pieces) {
    var source = arguments[2] === undefined ? 'bookmark' : arguments[2];

    _classCallCheck(this, NodePath);

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
      return this.matchers[type].matches(q);
    }
  }, {
    key: 'matchScore',
    value: function matchScore(q) {
      var a = (this.matchDataFor('path', q) || { score: 0 }).score;
      var b = (this.matchDataFor('url', q) || { score: 0 }).score;
      return Math.max(a, b);
    }
  }, {
    key: 'matchDataFor',
    value: function matchDataFor(type, q) {
      return this.matchers[type].matchData(q);
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

},{"./dom_element":2}],9:[function(require,module,exports){
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
          var nodePath = new _NodePath2['default'](node.url, path, 'bookmark');
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

},{"./node_path":7}],10:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _Matcher = require('./matcher');

var _Matcher2 = _interopRequireWildcard(_Matcher);

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
      this.bookmarks = this.treemap.filter(query);
      this.render(query);
      this.resize();
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

},{"./matcher":5}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvd2Vic2l0ZXMvY2hyb21lX2V4dGVuc2lvbnMvZmluZHIvc3JjL2pzL3BvcHVwLmpzIiwiL3dlYnNpdGVzL2Nocm9tZV9leHRlbnNpb25zL2ZpbmRyL3NyYy9qcy9kb21fZWxlbWVudC5qcyIsIi93ZWJzaXRlcy9jaHJvbWVfZXh0ZW5zaW9ucy9maW5kci9zcmMvanMva2V5Ym9hcmQuanMiLCIvd2Vic2l0ZXMvY2hyb21lX2V4dGVuc2lvbnMvZmluZHIvc3JjL2pzL2tleWNvZGVzLmpzIiwiL3dlYnNpdGVzL2Nocm9tZV9leHRlbnNpb25zL2ZpbmRyL3NyYy9qcy9tYXRjaGVyLmpzIiwiL3dlYnNpdGVzL2Nocm9tZV9leHRlbnNpb25zL2ZpbmRyL3NyYy9qcy9tZXRhLmpzIiwiL3dlYnNpdGVzL2Nocm9tZV9leHRlbnNpb25zL2ZpbmRyL3NyYy9qcy9ub2RlX3BhdGguanMiLCIvd2Vic2l0ZXMvY2hyb21lX2V4dGVuc2lvbnMvZmluZHIvc3JjL2pzL3Jlc3VsdHNfZG9tLmpzIiwiL3dlYnNpdGVzL2Nocm9tZV9leHRlbnNpb25zL2ZpbmRyL3NyYy9qcy90cmVlX21hcHBlci5qcyIsIi93ZWJzaXRlcy9jaHJvbWVfZXh0ZW5zaW9ucy9maW5kci9zcmMvanMvdXBkYXRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLFlBQVksQ0FBQzs7Ozt3QkFFUSxZQUFZOzs7O29CQUNoQixRQUFROzs7O3dCQUNKLGFBQWE7Ozs7MEJBQ1gsZUFBZTs7Ozt1QkFDbEIsV0FBVzs7OztBQUUvQixDQUFDLFlBQU07QUFDTCxNQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdDLE1BQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUM7O0FBRWpELE1BQUksT0FB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QUFDLENBQUM7QUFDbkIsVUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQ2Y7OztXQUVLLGdCQUFDLEtBQUssRUFBRTtBQUNaLFVBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO0FBQ3BDLGFBQUssRUFBRSxLQUFLO0FBQ1osaUJBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztPQUMxQixDQUFDLENBQUM7QUFDSCxVQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7S0FDcEM7Ozs7OztXQUlLLGtCQUFHO0FBQ1AsVUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUM7QUFDdEQsVUFBSSxhQUFhLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxZQUFZLENBQUM7QUFDakUsVUFBSyxhQUFhLEdBQUcsU0FBUyxFQUFHO0FBQy9CLFlBQUksQ0FBQyxRQUFNLGFBQWEsT0FBSSxDQUFDO0FBQzdCLGdCQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQy9CLGdCQUFRLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7T0FDM0Q7S0FDRjs7O1NBL0JHLE9BQU87OztBQWtDYixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBLZXlib2FyZCBmcm9tICcuL2tleWJvYXJkJztcbmltcG9ydCBNZXRhIGZyb20gJy4vbWV0YSc7XG5pbXBvcnQgTm9kZVBhdGggZnJvbSAnLi9ub2RlX3BhdGgnO1xuaW1wb3J0IFRyZWVNYXBwZXIgZnJvbSAnLi90cmVlX21hcHBlcic7XG5pbXBvcnQgVXBkYXRlciBmcm9tICcuL3VwZGF0ZXInO1xuXG4oKCkgPT4ge1xuICB2YXIgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5wdXQnKTtcbiAgdmFyIHJlc3VsdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdWx0cycpO1xuXG4gIGxldCB1cGRhdGVyO1xuICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY2hyb21lLmJvb2ttYXJrcy5nZXRUcmVlKCh0cmVlKSA9PiB7XG4gICAgICByZXNvbHZlKG5ldyBUcmVlTWFwcGVyKHRyZWUpKTtcbiAgICB9KTtcbiAgfSkudGhlbigodHJlZW1hcCkgPT4ge1xuICAgIGNocm9tZS5oaXN0b3J5LnNlYXJjaCh7dGV4dDogJycsIG1heFJlc3VsdHM6IDEwfSwgKGh4KSA9PiB7XG4gICAgICBoeC5mb3JFYWNoKChyKSA9PiB7XG4gICAgICAgIHRyZWVtYXAuYWRkTm9kZShuZXcgTm9kZVBhdGgoci51cmwsIFtyLnVybF0sICdoaXN0b3J5JykpO1xuICAgICAgfSk7XG4gICAgICB1cGRhdGVyID0gbmV3IFVwZGF0ZXIodHJlZW1hcCwgaW5wdXQsIHJlc3VsdHMpO1xuICAgIH0pO1xuICB9KTtcblxuICAvLyBTZXQgdXAgdGhlIGtleWJvYXJkIHRvIGxpc3RlbiBmb3Iga2V5IHByZXNzZXMgYW5kIGludGVycHJldCB0aGVpciBrZXljb2Rlc1xuICB2YXIga2V5Ym9hcmQgPSBuZXcgS2V5Ym9hcmQoKTtcbiAga2V5Ym9hcmQubGlzdGVuKGlucHV0KTtcblxuICAvLyBSZXNwb25zaWJsZSBmb3Igc2VsZWN0aW9uIG1vdmVtZW50ICYgYWN0aW9ucyB3aXRoaW4gdGhlIHJlc3VsdCBzZXRcbiAgdmFyIG1ldGEgPSBuZXcgTWV0YShyZXN1bHRzKTtcblxuICBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoZnVuY3Rpb24obWVzc2FnZSwgc2VuZGVyLCBfcmVzcCkge1xuICAgIGNvbnNvbGUubG9nKCdyZWNlaXZlZCBtZXNzYWdlOiAnLCBtZXNzYWdlKTtcbiAgICBzd2l0Y2ggKCBtZXNzYWdlLnR5cGUgKSB7XG4gICAgICBjYXNlICdmaWx0ZXInOlxuICAgICAgICB1cGRhdGVyLmZpbHRlcihpbnB1dC52YWx1ZSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdtZXRhJzpcbiAgICAgICAgbWV0YS5wZXJmb3JtKG1lc3NhZ2UuYWN0aW9uKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGNvbnNvbGUubG9nKCd1bmhhbmRsZWQgbWVzc2FnZScsIG1lc3NhZ2UsIHNlbmRlcik7XG4gICAgfVxuICB9KTtcbn0pKCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNsYXNzIERPTUVsZW1lbnQge1xuICBzdGF0aWMgZm9yKGVsKSB7XG4gICAgcmV0dXJuIG5ldyBET01FbGVtZW50KGVsKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGVsKSB7XG4gICAgdGhpcy5lbCA9IGVsO1xuICB9XG5cbiAgYWRkQ2xhc3Moa2xhc3MpIHtcbiAgICBpZiAoIHRoaXMuaGFzQ2xhc3Moa2xhc3MpICkgcmV0dXJuO1xuICAgIHRoaXMuZWwuY2xhc3NMaXN0LmFkZChrbGFzcyk7XG4gIH1cblxuICBoYXNDbGFzcyhrbGFzcykge1xuICAgIHJldHVybiB0aGlzLmVsLmNsYXNzTGlzdC5jb250YWlucyhrbGFzcyk7XG4gIH1cblxuICByZW1vdmVDbGFzcyhrbGFzcykge1xuICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZShrbGFzcyk7XG4gIH1cblxuICBtYXRjaChkb21FbCkge1xuICAgIHJldHVybiB0aGlzLmVsID09IGRvbUVsLmVsO1xuICB9XG5cbiAgdXJsKCkge1xuICAgIGxldCBhbmNob3IgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoJ2EnKTtcbiAgICBpZiAoICFhbmNob3IgKSByZXR1cm4gbnVsbDtcblxuICAgIHJldHVybiBhbmNob3IuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBET01FbGVtZW50O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgS2V5Y29kZXMgZnJvbSAnLi9rZXljb2Rlcyc7XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgS2V5Ym9hcmQge1xuICBsaXN0ZW4oZWwpIHtcbiAgICBlbC5vbmtleWRvd24gPSBLZXljb2Rlcy5vbmtleWRvd247XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmNsYXNzIEtleWNvZGVzIHtcbiAgc3RhdGljIG9ua2V5ZG93bihlKSB7XG4gICAgLy8gQXNzdW1lIGFueSBrZXlzdHJva2UgaXMgbWVhbnQgdG8gZnVydGhlciBmaWx0ZXIgcmVzdWx0cy4gQW55IG90aGVyXG4gICAgLy8gYWN0aW9uIG11c3QgYmUgZXhwbGljaXRseSBoYW5kbGVkIGZvciBoZXJlLlxuICAgIHZhciBtZXNzYWdlID0ge1xuICAgICAga2V5Y29kZTogZS5rZXlDb2RlLFxuICAgICAgdHlwZTogJ2ZpbHRlcicsXG4gICAgICBhY3Rpb246IG51bGxcbiAgICB9O1xuXG4gICAgc3dpdGNoICggZS5rZXlDb2RlICkge1xuICAgICAgY2FzZSAxMzogLy8gZW50ZXJcbiAgICAgICAgbWVzc2FnZS50eXBlID0gJ21ldGEnO1xuICAgICAgICBtZXNzYWdlLmFjdGlvbiA9ICdvcGVuVVJMJztcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgMTc6IC8vIGN0cmxcbiAgICAgIGNhc2UgOTM6IC8vIGNtZFxuICAgICAgICBtZXNzYWdlLnR5cGUgPSAnbm9vcCc7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIDM4OiAvLyB1cCBhcnJvd1xuICAgICAgICBtZXNzYWdlLnR5cGUgPSAnbWV0YSc7XG4gICAgICAgIG1lc3NhZ2UuYWN0aW9uID0gJ21vdmVVcCc7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIDQwOiAvLyBkb3duIGFycm93XG4gICAgICAgIG1lc3NhZ2UudHlwZSA9ICdtZXRhJztcbiAgICAgICAgbWVzc2FnZS5hY3Rpb24gPSAnbW92ZURvd24nO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSA3ODogLy8gblxuICAgICAgICBpZiAoIGUuY3RybEtleSApIHtcbiAgICAgICAgICBtZXNzYWdlLnR5cGUgPSAnbWV0YSc7XG4gICAgICAgICAgbWVzc2FnZS5hY3Rpb24gPSAnbW92ZURvd24nO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIDgwOiAvLyBwXG4gICAgICAgIGlmICggZS5jdHJsS2V5ICkge1xuICAgICAgICAgIG1lc3NhZ2UudHlwZSA9ICdtZXRhJztcbiAgICAgICAgICBtZXNzYWdlLmFjdGlvbiA9ICdtb3ZlVXAnO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH07XG5cbiAgICBjb25zb2xlLmxvZygna2V5Y29kZXMuanM6ICcsIG1lc3NhZ2UpO1xuXG4gICAgLy8gRW1pdCBtZXNzYWdlIHNvIHRoZSBwcm9wZXIgYWN0aW9uIGNhbiBiZSB0YWtlblxuICAgIGlmICggbWVzc2FnZS50eXBlICE9ICdub29wJyApIHtcbiAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKG1lc3NhZ2UpIFxuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBLZXljb2RlcztcbiIsImNsYXNzIE1hdGNoZXIge1xuICBjb25zdHJ1Y3RvciAoc3RyaW5nKSB7XG4gICAgdGhpcy5zdHJpbmcgPSAoc3RyaW5nIHx8ICcnKS50b0xvd2VyQ2FzZSgpO1xuICAgIHRoaXMucHJldmlvdXNNYXRjaGVzID0ge307XG4gIH1cblxuICBtYXRjaGVzKHF1ZXJ5KSB7XG4gICAgaWYgKCB0aGlzLmhhc01hdGNoRGF0YShxdWVyeSkgKSByZXR1cm4gdGhpcy5tYXRjaERhdGEocXVlcnkpO1xuXG4gICAgbGV0IGZvbyA9IHRoaXMuc3RyaW5nO1xuXG4gICAgbGV0IG1hdGNoID0gZmFsc2U7XG4gICAgbGV0IGxvY2F0aW9ucyA9IFtdO1xuICAgIGxldCBxID0gcXVlcnkudG9Mb3dlckNhc2UoKTtcbiAgICBsZXQgcWxlbiA9IHEubGVuZ3RoO1xuICAgIGxldCBqID0gMDtcblxuICAgIC8vIFdhcyB0aGUgbGFzdCBjaGFyYWN0ZXIgYSBtYXRjaD9cbiAgICBsZXQgcnVuID0gZmFsc2U7XG5cbiAgICBmb3IgKCBsZXQgaSA9IDA7IGkgPCB0aGlzLnN0cmluZy5sZW5ndGggJiYgIW1hdGNoOyBpKyspIHtcbiAgICAgIHZhciBzdHJDaGFyID0gdGhpcy5jaGFyQXQoaSk7XG4gICAgICB2YXIgcXVlcnlDaGFyID0gcVtqXTtcblxuICAgICAgaWYgKCBzdHJDaGFyICE9IHF1ZXJ5Q2hhciApIHtcbiAgICAgICAgLy8gV2UgZmFpbGVkIHRvIG1hdGNoIHNvIGlmIHdlIHdlcmUgb24gYSBydW4sIGl0IGhhcyBlbmRlZFxuICAgICAgICBydW4gPSBmYWxzZTtcbiAgICAgIH0gZWxzZSBpZiAoIHJ1biApIHtcbiAgICAgICAgLy8gVGhlIHByZXZpb3VzIGl0ZXJhdGlvbiBmb3VuZCBhIG1hdGNoLiBUaGF0IG1lYW5zIHdlIGFyZSBjdXJyZW50bHlcbiAgICAgICAgLy8gb24gYSBydW4gb2YgbWF0Y2hpbmcgY2hhcmFjdGVycy4gVGhpcyBpcyBhbiBlYXN5IHN0ZXAgc2luY2Ugd2VcbiAgICAgICAgLy8ganVzdCB3YW50IHRvIGluY3JlbWVudCB0aGUgZW5kIHBvc2l0aW9uIGZvciB0aGUgbW9zdCByZWNlbnRcbiAgICAgICAgLy8gbG9jRGF0YSBvYmplY3QgKGluIGxvY2F0aW9ucylcbiAgICAgICAgdmFyIGxhc3QgPSBsb2NhdGlvbnMucG9wKCk7XG4gICAgICAgIGxhc3RbMV0rKztcbiAgICAgICAgaisrO1xuICAgICAgICBsb2NhdGlvbnMucHVzaChsYXN0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEZpcnN0IG1hdGNoIHdlIGhhdmUgc2VlbiBpbiBhdCBsZWFzdCAxIGZ1bGwgaXRlcmF0aW9uLiBJZiB0aGVcbiAgICAgICAgLy8gbmV4dCBpdGVyYXRpb24gbWF0Y2hlcywgYmUgc3VyZSB0byBhcHBlbmQgdG8gdGhpcyBsb2NEYXRhXG4gICAgICAgIHJ1biA9IHRydWU7XG5cbiAgICAgICAgLy8gVGhpbmsgc2xpY2UoKS4gTG9jYXRpb24gZGF0YSB3aWxsIGJlIGFuIGFycmF5IHdoZXJlIHRoZSBmaXJzdFxuICAgICAgICAvLyB2YWx1ZSBpcyB0aGUgaW5kZXggb2YgdGhlIGZpcnN0IG1hdGNoIGFuZCB0aGUgc2Vjb25kIHZhbHVlIGlzXG4gICAgICAgIC8vIHRoZSBpbmRleCBvZiB0aGUgbGFzdCBtYXRjaC5cbiAgICAgICAgbGV0IGxvY0RhdGEgPSBbaSwgaSsxXTtcblxuICAgICAgICAvLyBNYXRjaCB0aGUgbGFyZ2VzdCBjaHVua3Mgb2YgbWF0Y2hpbmcgdGV4dCB0b2dldGhlciFcbiAgICAgICAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBsYXN0IGNoYXJhY3RlciBpbiB0aGUgcXVlcnkgc3RyaW5nIG1hdGNoZXNcbiAgICAgICAgLy8gdGhlIGxhc3QgY2hhcmFjdGVyIGluIHRoaXMuc3RyaW5nLiBJZiBzbywgc3RlYWwgdGhhdCBjaGFyYWN0ZXJzXG4gICAgICAgIC8vIGxvY2F0aW9uIGRhdGEgKGZyb20gdGhlIHByZXZpb3VzIGxvY0RhdGEgZm91bmQgYXQgbG9jYXRpb25zLmxhc3QpXG4gICAgICAgIC8vIGFuZCBwcmVwZW5kIGl0IHRvIHRoaXMgbWF0Y2ggZGF0YS5cbiAgICAgICAgLy8gRm9yIGV4YW1wbGUsIGlmIHdlIHdhbnQgdG8gbWF0Y2ggJ2RtJywgZG9pbmcgYSBcImZpcnN0IGNvbWUsIGZpcnN0XG4gICAgICAgIC8vIG1hdGNoXCIgd291bGQgcHJvZHVjZSB0aGlzIG1hdGNoIChtYXRjaGVzIGFyZSBpbiBjYXBzKTpcbiAgICAgICAgLy8gICAnL0R6L2EvZE1veidcbiAgICAgICAgLy8gSG93ZXZlciwgd2Ugd2FudCB0byBtYXRjaCBhcyBtYW55IGNvbnNlY3V0aXZlIHN0cmluZ3MgYXMgcG9zc2libGUsXG4gICAgICAgIC8vIHRodXMgdGhlIG1hdGNoIHNob3VsZCBiZTpcbiAgICAgICAgLy8gICAnL2R6L2EvRE0nXG4gICAgICAgIGxldCBjb250ID0gdHJ1ZTtcbiAgICAgICAgZm9yICggdmFyIGsgPSAxOyBrIDw9IGkgJiYgY29udDsgaysrKSB7XG4gICAgICAgICAgbGV0IHByZXZTdHJDaGFyID0gdGhpcy5jaGFyQXQoaSAtIGspO1xuICAgICAgICAgIGxldCBwcmV2UXVlcnlDaGFyID0gcVtqIC0ga107XG4gICAgICAgICAgY29udCA9IHByZXZTdHJDaGFyID09IHByZXZRdWVyeUNoYXI7XG4gICAgICAgICAgaWYgKCBjb250ICkge1xuICAgICAgICAgICAgLy8gcXVlcnk6IGRtXG4gICAgICAgICAgICAvLyBzdHJpbmc6IGZzZGxzZG1velxuICAgICAgICAgICAgLy8gcHJldjogWzIsM10gLS0+IFsyLDJdIC0tPiByZW1vdmUgaXRcbiAgICAgICAgICAgIC8vIGN1cnI6IFs2LDddIC0tPiBbNSw3XVxuICAgICAgICAgICAgbGV0IHByZXZMb2NEYXRhID0gbG9jYXRpb25zLnBvcCgpO1xuICAgICAgICAgICAgcHJldkxvY0RhdGFbMV0tLTtcblxuICAgICAgICAgICAgLy8gT25seSBwZXJzaXN0IHRoZSBwcmV2aW91cyBsb2NhdGlvbiBkYXRhIGlmIGl0IGhhcyBhdCBsZWFzdCAxIG1hdGNoXG4gICAgICAgICAgICBpZiAoIHByZXZMb2NEYXRhWzBdIDwgcHJldkxvY0RhdGFbMV0gKSBsb2NhdGlvbnMucHVzaChwcmV2TG9jRGF0YSk7XG5cbiAgICAgICAgICAgIC8vIE5vdywgbW92ZSB0aGUgc3RhcnQgcG9zaXRpb24gYmFjayAxIGZvciB0aGUgY3VycmVudCBtYXRjaFxuICAgICAgICAgICAgbG9jRGF0YVswXS0tO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsb2NhdGlvbnMucHVzaChsb2NEYXRhKTtcbiAgICAgICAgaisrO1xuICAgICAgfVxuXG4gICAgICBtYXRjaCA9ICggaiA9PSBxbGVuICk7XG4gICAgfVxuXG4gICAgaWYgKCBtYXRjaCkge1xuICAgICAgdGhpcy5zZXRNYXRjaERhdGEocXVlcnksIG1hdGNoLCBsb2NhdGlvbnMpO1xuICAgIH1cblxuICAgIHJldHVybiBtYXRjaDtcbiAgfVxuXG4gIHNldE1hdGNoRGF0YShxdWVyeSwgYm9vbCwgbG9jYXRpb25zKSB7XG4gICAgdGhpcy5wcmV2aW91c01hdGNoZXNbcXVlcnldID0ge1xuICAgICAgbWF0Y2g6IGJvb2wsXG4gICAgICBsb2NhdGlvbnM6IGxvY2F0aW9ucyxcbiAgICAgIHNjb3JlOiB0aGlzLmNhbGN1bGF0ZVNjb3JlRm9yKGxvY2F0aW9ucylcbiAgICB9O1xuICB9XG5cbiAgY2FsY3VsYXRlU2NvcmVGb3IobG9jYXRpb25zKSB7XG4gICAgLy8gU2ltcGx5IGRvdWJsZSB0aGUgbGVuZ3RoIG9mIGVhY2ggbWF0Y2ggbGVuZ3RoLlxuICAgIHJldHVybiBsb2NhdGlvbnMubWFwKChtYXRjaCkgPT4ge1xuICAgICAgbGV0IG1hdGNoTGVuZ3RoID0gTWF0aC5hYnMobWF0Y2hbMF0gLSBtYXRjaFsxXSk7XG4gICAgICBsZXQgbXVsdGlwbGllciA9IG1hdGNoTGVuZ3RoID09IDEgPyAxIDogMjtcblxuICAgICAgbGV0IHN0YXJ0c1dpdGhTbGFzaCA9IHRoaXMuc3RyaW5nW21hdGNoWzBdXSA9PSAnLydcbiAgICAgIGlmICggc3RhcnRzV2l0aFNsYXNoICYmIG1hdGNoTGVuZ3RoID4gMSApIG11bHRpcGxpZXIgKz0gMTtcbiAgICAgIHJldHVybiBtYXRjaExlbmd0aCAqIG11bHRpcGxpZXI7XG5cbiAgICB9LCB0aGlzKS5yZWR1Y2UoKGEsIGIpID0+IHtcbiAgICAgIHJldHVybiBhICsgYjtcbiAgICB9LCAwKTtcbiAgfVxuXG4gIGhhc01hdGNoRGF0YShxdWVyeSkge1xuICAgIHJldHVybiAhIXRoaXMubWF0Y2hEYXRhKHF1ZXJ5KTtcbiAgfVxuXG4gIG1hdGNoRGF0YShxdWVyeSkge1xuICAgIHJldHVybiB0aGlzLnByZXZpb3VzTWF0Y2hlc1txdWVyeV07XG4gIH1cblxuICBjaGFyQXQoaSkge1xuICAgIHJldHVybiB0aGlzLnN0cmluZy5jaGFyQXQoaSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNYXRjaGVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgUmVzdWx0c0RPTSBmcm9tICcuL3Jlc3VsdHNfZG9tJztcblxuY2xhc3MgTWV0YSB7XG4gIGNvbnN0cnVjdG9yKGxpc3QpIHtcbiAgICB0aGlzLmxpc3QgPSBuZXcgUmVzdWx0c0RPTShsaXN0KTtcbiAgfVxuXG4gIHBlcmZvcm0oYWN0aW9uKSB7XG4gICAgY29uc29sZS5sb2coYHBlcmZvcm06ICR7YWN0aW9ufWApO1xuICAgIHRoaXNbYWN0aW9uXSgpO1xuICB9XG5cbiAgb3BlblVSTCgpIHtcbiAgICBsZXQgaXRlbSA9IHRoaXMubGlzdC5zZWxlY3RlZCgpO1xuICAgIGxldCB1cmwgPSBpdGVtLnVybCgpO1xuICAgIGlmICggdXJsICkgY2hyb21lLnRhYnMuY3JlYXRlKHsgdXJsOiB1cmwgfSk7XG4gIH0gIFxuXG4gIG1vdmVVcCgpIHtcbiAgICB2YXIgaXRlbSA9IHRoaXMubGlzdC5zZWxlY3RlZCgpO1xuICAgIHZhciBwcmV2ID0gdGhpcy5saXN0LnByZXZpb3VzKGl0ZW0pO1xuXG4gICAgaWYgKCBwcmV2ICYmIGl0ZW0gIT0gcHJldiApIHtcbiAgICAgIHRoaXMubGlzdC51bnNlbGVjdChpdGVtKTtcbiAgICAgIHRoaXMubGlzdC5zZWxlY3QocHJldik7XG4gICAgfVxuICB9XG5cbiAgbW92ZURvd24oKSB7XG4gICAgdmFyIGl0ZW0gPSB0aGlzLmxpc3Quc2VsZWN0ZWQoKTtcbiAgICB2YXIgbmV4dCA9IHRoaXMubGlzdC5uZXh0KGl0ZW0pO1xuXG4gICAgaWYgKCBuZXh0ICYmIGl0ZW0gIT0gbmV4dCApIHtcbiAgICAgIHRoaXMubGlzdC51bnNlbGVjdChpdGVtKTtcbiAgICAgIHRoaXMubGlzdC5zZWxlY3QobmV4dCk7XG4gICAgfVxuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1ldGE7XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBNYXRjaGVyIGZyb20gJy4vbWF0Y2hlcic7XG5cbmNsYXNzIE5vZGVQYXRoIHtcbiAgY29uc3RydWN0b3IodXJsLCBwaWVjZXMsIHNvdXJjZT0nYm9va21hcmsnKSB7XG4gICAgdGhpcy51cmwgPSB1cmw7XG4gICAgdGhpcy5waWVjZXMgPSBwaWVjZXM7XG4gICAgdGhpcy5wYXRoID0gcGllY2VzLmpvaW4oJy8nKTtcbiAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICB0aGlzLm1hdGNoZXJzID0ge1xuICAgICAgcGF0aDogbmV3IE1hdGNoZXIodGhpcy5wYXRoKSxcbiAgICAgIHVybDogbmV3IE1hdGNoZXIodGhpcy51cmwpXG4gICAgfTtcbiAgfVxuXG4gIGxvb3NlTWF0Y2gocSkge1xuICAgIHZhciBhID0gdGhpcy5tYXRjaEZvcigncGF0aCcsIHEpO1xuICAgIHZhciBiID0gdGhpcy5tYXRjaEZvcigndXJsJywgcSk7XG4gICAgcmV0dXJuIGEgfHwgYjtcbiAgfVxuXG4gIG1hdGNoRm9yKHR5cGUsIHEpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaGVyc1t0eXBlXS5tYXRjaGVzKHEpO1xuICB9XG5cbiAgbWF0Y2hTY29yZShxKSB7XG4gICAgdmFyIGEgPSAodGhpcy5tYXRjaERhdGFGb3IoJ3BhdGgnLCBxKSB8fCB7c2NvcmU6MH0pLnNjb3JlO1xuICAgIHZhciBiID0gKHRoaXMubWF0Y2hEYXRhRm9yKCd1cmwnLCBxKSB8fCB7c2NvcmU6MH0pLnNjb3JlO1xuICAgIHJldHVybiBNYXRoLm1heChhLGIpO1xuICB9XG5cbiAgbWF0Y2hEYXRhRm9yKHR5cGUsIHEpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaGVyc1t0eXBlXS5tYXRjaERhdGEocSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBOb2RlUGF0aDtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IERPTUVsZW1lbnQgZnJvbSAnLi9kb21fZWxlbWVudCc7XG5cbmNsYXNzIFJlc3VsdHNET00ge1xuICBjb25zdHJ1Y3Rvcihjb250YWluZXIpIHtcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgfVxuXG4gIGl0ZW1zKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcucmVzdWx0LmJveCcpO1xuICB9XG5cbiAgZmlyc3QoKSB7XG4gICAgbGV0IGl0ZW0gPSB0aGlzLml0ZW1zWzBdO1xuICAgIHJldHVybiB0aGlzLmRvbUVsT3JOdWxsKGl0ZW0pO1xuICB9XG5cbiAgbGFzdCgpIHtcbiAgICBsZXQgbGlzdCA9IHRoaXMuaXRlbXMoKTtcbiAgICBsZXQgaXRlbSA9IGxpc3RbbGlzdC5sZW5ndGggLSAxXTtcbiAgICByZXR1cm4gdGhpcy5kb21FbE9yTnVsbChpdGVtKTtcbiAgfVxuXG4gIHNlbGVjdGVkKCkge1xuICAgIGxldCBpdGVtID0gdGhpcy5jb250YWluZXIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc2VsZWN0ZWQnKVswXTtcbiAgICByZXR1cm4gdGhpcy5kb21FbE9yTnVsbChpdGVtKTtcbiAgfVxuXG4gIC8vIEdldCB0aGUgbmV4dCBlbGVtZW50IGluIHRoZSBsaXN0IHJlbGF0aXZlIHRvIHRoZSBwcm92aWRlZCBkb21FbFxuICBuZXh0KGRvbUVsKSB7XG4gICAgaWYgKCAhZG9tRWwgKSByZXR1cm4gdGhpcy5maXJzdCgpO1xuXG4gICAgbGV0IGluZGV4ID0gdGhpcy5pbmRleE9mKGRvbUVsKTtcbiAgICBsZXQgaXRlbXMgPSB0aGlzLml0ZW1zKCk7XG4gICAgbGV0IG5leHQgPSBpdGVtc1tpbmRleCArIDFdO1xuICAgIGlmICggIW5leHQgKSBuZXh0ID0gdGhpcy5sYXN0KCk7XG4gICAgcmV0dXJuIHRoaXMuZG9tRWxPck51bGwobmV4dCk7XG4gIH1cblxuICBwcmV2aW91cyhkb21FbCkge1xuICAgIGlmICggIWRvbUVsICkgcmV0dXJuIG51bGw7XG5cbiAgICBsZXQgaW5kZXggPSB0aGlzLmluZGV4T2YoZG9tRWwpO1xuICAgIGxldCBpdGVtcyA9IHRoaXMuaXRlbXMoKTtcbiAgICBsZXQgcHJldiA9IGl0ZW1zW2luZGV4IC0gMV07XG4gICAgcmV0dXJuIHRoaXMuZG9tRWxPck51bGwocHJldik7XG4gIH1cblxuICBkb21FbE9yTnVsbChlbCkge1xuICAgIGlmICggIWVsICkgcmV0dXJuIG51bGw7XG4gICAgLy8gZWwgaXMgYWxyZWFkeSBhIERPTUVMZW1lbnRcbiAgICBpZiAoICEhKHR5cGVvZiBlbCA9PSAnb2JqZWN0JyAmJiBlbFsnZWwnXSkgKSByZXR1cm4gZWw7XG4gICAgcmV0dXJuIG5ldyBET01FbGVtZW50KGVsKTtcbiAgfVxuXG4gIC8vIEFkZCAnc2VsZWN0ZWQnIGNsYXNzIHRvIHRoZSBwcm92aWRlZCBkb21FbFxuICBzZWxlY3QoZG9tRWwpIHtcbiAgICBpZiAoICFkb21FbCApIGRvbUVsID0gdGhpcy5sYXN0KCk7XG4gICAgZG9tRWwuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gIH1cblxuICAvLyBSZW1vdmUgJ3NlbGVjdGVkJyBjbGFzcyBmcm9tIHRoZSBwcm92aWRlZCBkb21FbFxuICB1bnNlbGVjdChkb21FbCkge1xuICAgIGlmICggIWRvbUVsICkgcmV0dXJuO1xuICAgIGRvbUVsLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuICB9XG5cbiAgdW5zZWxlY3RBbGwoKSB7XG4gICAgdGhpcy5lYWNoKChkb21FbCkgPT4geyB0aGlzLnVuc2VsZWN0KGRvbUVsKSB9KTtcbiAgfVxuXG4gIGVhY2goZm4sIGFyZ3M9e30pIHtcbiAgICBsZXQgYm91bmQgPSBmbi5iaW5kKHRoaXMpO1xuICAgIGxldCBpdGVtcyA9IHRoaXMuaXRlbXMoKTtcbiAgICBmb3IgKCBsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKyApIHtcbiAgICAgIGJvdW5kKG5ldyBET01FbGVtZW50KGl0ZW1zW2ldKSwgYXJncywgaSk7XG4gICAgfVxuICB9XG5cbiAgaW5kZXhPZihkb21FbCkge1xuICAgIGxldCBpdGVtcyA9IHRoaXMuaXRlbXMoKTtcbiAgICBsZXQgaW5kZXg7XG4gICAgZm9yICggbGV0IGkgPSAwOyAhaW5kZXggJiYgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrICkge1xuICAgICAgaWYgKCBkb21FbC5lbCA9PSBpdGVtc1tpXSApIGluZGV4ID0gaTtcbiAgICB9XG4gICAgcmV0dXJuIGluZGV4O1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVzdWx0c0RPTTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IE5vZGVQYXRoIGZyb20gJy4vbm9kZV9wYXRoJztcblxuY2xhc3MgVHJlZU1hcHBlciB7XG4gIGNvbnN0cnVjdG9yKHRyZWUpIHtcbiAgICB0aGlzLnRyZWUgPSB0cmVlO1xuICAgIHRoaXMuY29sbGVjdGlvbiA9IHRoaXMucGFyc2UoKTtcbiAgfVxuXG4gIGZpbHRlcihxdWVyeSkge1xuICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb24uZmlsdGVyKChub2RlcGF0aCkgPT4ge1xuICAgICAgcmV0dXJuIG5vZGVwYXRoLmxvb3NlTWF0Y2gocXVlcnkpO1xuICAgIH0pLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgcmV0dXJuIGIubWF0Y2hTY29yZShxdWVyeSkgLSBhLm1hdGNoU2NvcmUocXVlcnkpO1xuICAgIH0pO1xuICB9XG5cbiAgcGFyc2UoKSB7XG4gICAgbGV0IGNvbGxlY3Rpb24gPSBbXTtcblxuICAgIHZhciBiID0gKG5vZGUsIHBhdGgpID0+IHtcbiAgICAgIHBhdGgucHVzaChub2RlLnRpdGxlKTtcblxuICAgICAgaWYgKCB0aGlzLm5vZGVIYXNDaGlsZHJlbihub2RlKSApIHtcbiAgICAgICAgbm9kZS5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgICAgIGxldCBjb3B5ID0gcGF0aC5zbGljZSgwKTtcbiAgICAgICAgICBiKGNoaWxkLCBjb3B5KTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgbm9kZVBhdGggPSBuZXcgTm9kZVBhdGgobm9kZS51cmwsIHBhdGgsICdib29rbWFyaycpO1xuICAgICAgICBjb2xsZWN0aW9uLnB1c2gobm9kZVBhdGgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBiKHRoaXMudHJlZVswXSwgW10pO1xuXG4gICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gIH1cblxuICBub2RlSGFzQ2hpbGRyZW4obm9kZSkge1xuICAgIHJldHVybiBub2RlWydjaGlsZHJlbiddICYmIG5vZGUuY2hpbGRyZW4ubGVuZ3RoID4gMDtcbiAgfVxuXG4gIGFkZE5vZGUobm9kZSkge1xuICAgIHRoaXMuY29sbGVjdGlvbi5wdXNoKG5vZGUpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVHJlZU1hcHBlcjtcbiIsImltcG9ydCBNYXRjaGVyIGZyb20gJy4vbWF0Y2hlcic7XG5cbmNsYXNzIFVwZGF0ZXIge1xuICBjb25zdHJ1Y3Rvcih0cmVlbWFwLCBpbnB1dEVsLCByZXN1bHRzRWwpIHtcbiAgICB0aGlzLnRyZWVtYXAgPSB0cmVlbWFwO1xuICAgIHRoaXMuaW5wdXRFbCA9IGlucHV0RWw7XG4gICAgdGhpcy5yZXN1bHRzRWwgPSByZXN1bHRzRWw7XG4gIH1cblxuICBmaWx0ZXIocXVlcnkpIHtcbiAgICB0aGlzLmJvb2ttYXJrcyA9IHRoaXMudHJlZW1hcC5maWx0ZXIocXVlcnkpO1xuICAgIHRoaXMucmVuZGVyKHF1ZXJ5KTtcbiAgICB0aGlzLnJlc2l6ZSgpO1xuICB9XG5cbiAgcmVuZGVyKHF1ZXJ5KSB7XG4gICAgbGV0IGNvbnRlbnQgPSBGaW5kci50ZW1wbGF0ZXMucmVzdWx0cyh7XG4gICAgICBxdWVyeTogcXVlcnksXG4gICAgICBib29rbWFya3M6IHRoaXMuYm9va21hcmtzXG4gICAgfSk7XG4gICAgdGhpcy5yZXN1bHRzRWwuaW5uZXJIVE1MID0gY29udGVudDtcbiAgfVxuXG4gIC8vIFRPRE86IFRoaXMgcmVhbGx5IGlzIGp1c3QgdGhyb3duIGluIGhlcmUgYW5kIGxpa2VseSBkb2VzIG5vdCBiZWxvbmdcbiAgLy8gaW4gdGhpcyBjbGFzcy4gQ2xlYW4gaXQgdXAhXG4gIHJlc2l6ZSgpIHtcbiAgICBsZXQgZG9jSGVpZ2h0ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50Lm9mZnNldEhlaWdodDtcbiAgICBsZXQgY29udGVudEhlaWdodCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtYWluJykub2Zmc2V0SGVpZ2h0O1xuICAgIGlmICggY29udGVudEhlaWdodCA8IGRvY0hlaWdodCApIHtcbiAgICAgIHZhciBoID0gYCR7Y29udGVudEhlaWdodH1weGA7XG4gICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmhlaWdodCA9IGg7XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImh0bWxcIilbMF0uc3R5bGUuaGVpZ2h0ID0gaDtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBVcGRhdGVyO1xuIl19
