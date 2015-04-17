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
    console.log('onMessage', message);
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

        default:
          console.log('keyCode: ' + e.keyCode);
      };

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
      // Simply double the length of each match length.
      return locations.map(function (match) {
        return Math.abs(match[0] - (match[1] - 1)) * 2;
      }).reduce(function (a, b) {
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
      var z = this.collection.filter(function (nodepath) {
        return nodepath.looseMatch(query);
      }).sort(function (a, b) {
        var scorea = a.matchScore(query);
        var scoreb = b.matchScore(query);
        return scorea < scoreb;
      });
      return z;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvd2Vic2l0ZXMvY2hyb21lX2V4dGVuc2lvbnMvZmluZHIvc3JjL2pzL3BvcHVwLmpzIiwiL3dlYnNpdGVzL2Nocm9tZV9leHRlbnNpb25zL2ZpbmRyL3NyYy9qcy9kb21fZWxlbWVudC5qcyIsIi93ZWJzaXRlcy9jaHJvbWVfZXh0ZW5zaW9ucy9maW5kci9zcmMvanMva2V5Ym9hcmQuanMiLCIvd2Vic2l0ZXMvY2hyb21lX2V4dGVuc2lvbnMvZmluZHIvc3JjL2pzL2tleWNvZGVzLmpzIiwiL3dlYnNpdGVzL2Nocm9tZV9leHRlbnNpb25zL2ZpbmRyL3NyYy9qcy9tYXRjaGVyLmpzIiwiL3dlYnNpdGVzL2Nocm9tZV9leHRlbnNpb25zL2ZpbmRyL3NyYy9qcy9tZXRhLmpzIiwiL3dlYnNpdGVzL2Nocm9tZV9leHRlbnNpb25zL2ZpbmRyL3NyYy9qcy9ub2RlX3BhdGguanMiLCIvd2Vic2l0ZXMvY2hyb21lX2V4dGVuc2lvbnMvZmluZHIvc3JjL2pzL3Jlc3VsdHNfZG9tLmpzIiwiL3dlYnNpdGVzL2Nocm9tZV9leHRlbnNpb25zL2ZpbmRyL3NyYy9qcy90cmVlX21hcHBlci5qcyIsIi93ZWJzaXRlcy9jaHJvbWVfZXh0ZW5zaW9ucy9maW5kci9zcmMvanMvdXBkYXRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLFlBQVksQ0FBQzs7Ozt3QkFFUSxZQUFZOzs7O29CQUNoQixRQUFROzs7O3dCQUNKLGFBQWE7Ozs7MEJBQ1gsZUFBZTs7Ozt1QkFDbEIsV0FBVzs7OztBQUUvQixDQUFDLFlBQU07QUFDTCxNQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdDLE1BQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUM7O0FBRWpELE1BQUksT0FB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cEMsYUFBSyxFQUFFLEtBQUs7QUFDWixpQkFBUyxFQUFFLElBQUksQ0FBQyxTQUFTO09BQzFCLENBQUMsQ0FBQztBQUNILFVBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztLQUNwQzs7Ozs7O1dBSUssa0JBQUc7QUFDUCxVQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQztBQUN0RCxVQUFJLGFBQWEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFlBQVksQ0FBQztBQUNqRSxVQUFLLGFBQWEsR0FBRyxTQUFTLEVBQUc7QUFDL0IsWUFBSSxDQUFDLFFBQU0sYUFBYSxPQUFJLENBQUM7QUFDN0IsZ0JBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDL0IsZ0JBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztPQUMzRDtLQUNGOzs7U0EvQkcsT0FBTzs7O0FBa0NiLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IEtleWJvYXJkIGZyb20gJy4va2V5Ym9hcmQnO1xuaW1wb3J0IE1ldGEgZnJvbSAnLi9tZXRhJztcbmltcG9ydCBOb2RlUGF0aCBmcm9tICcuL25vZGVfcGF0aCc7XG5pbXBvcnQgVHJlZU1hcHBlciBmcm9tICcuL3RyZWVfbWFwcGVyJztcbmltcG9ydCBVcGRhdGVyIGZyb20gJy4vdXBkYXRlcic7XG5cbigoKSA9PiB7XG4gIHZhciBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnB1dCcpO1xuICB2YXIgcmVzdWx0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN1bHRzJyk7XG5cbiAgbGV0IHVwZGF0ZXI7XG4gIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjaHJvbWUuYm9va21hcmtzLmdldFRyZWUoKHRyZWUpID0+IHtcbiAgICAgIHJlc29sdmUobmV3IFRyZWVNYXBwZXIodHJlZSkpO1xuICAgIH0pO1xuICB9KS50aGVuKCh0cmVlbWFwKSA9PiB7XG4gICAgY2hyb21lLmhpc3Rvcnkuc2VhcmNoKHt0ZXh0OiAnJywgbWF4UmVzdWx0czogMTB9LCAoaHgpID0+IHtcbiAgICAgIGh4LmZvckVhY2goKHIpID0+IHtcbiAgICAgICAgdHJlZW1hcC5hZGROb2RlKG5ldyBOb2RlUGF0aChyLnVybCwgW3IudXJsXSwgJ2hpc3RvcnknKSk7XG4gICAgICB9KTtcbiAgICAgIHVwZGF0ZXIgPSBuZXcgVXBkYXRlcih0cmVlbWFwLCBpbnB1dCwgcmVzdWx0cyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIC8vIFNldCB1cCB0aGUga2V5Ym9hcmQgdG8gbGlzdGVuIGZvciBrZXkgcHJlc3NlcyBhbmQgaW50ZXJwcmV0IHRoZWlyIGtleWNvZGVzXG4gIHZhciBrZXlib2FyZCA9IG5ldyBLZXlib2FyZCgpO1xuICBrZXlib2FyZC5saXN0ZW4oaW5wdXQpO1xuXG4gIC8vIFJlc3BvbnNpYmxlIGZvciBzZWxlY3Rpb24gbW92ZW1lbnQgJiBhY3Rpb25zIHdpdGhpbiB0aGUgcmVzdWx0IHNldFxuICB2YXIgbWV0YSA9IG5ldyBNZXRhKHJlc3VsdHMpO1xuXG4gIGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihmdW5jdGlvbihtZXNzYWdlLCBzZW5kZXIsIF9yZXNwKSB7XG4gICAgY29uc29sZS5sb2coJ29uTWVzc2FnZScsIG1lc3NhZ2UpO1xuICAgIHN3aXRjaCAoIG1lc3NhZ2UudHlwZSApIHtcbiAgICAgIGNhc2UgJ2ZpbHRlcic6XG4gICAgICAgIHVwZGF0ZXIuZmlsdGVyKGlucHV0LnZhbHVlKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ21ldGEnOlxuICAgICAgICBtZXRhLnBlcmZvcm0obWVzc2FnZS5hY3Rpb24pO1xuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgY29uc29sZS5sb2coJ3VuaGFuZGxlZCBtZXNzYWdlJywgbWVzc2FnZSwgc2VuZGVyKTtcbiAgICB9XG4gIH0pO1xufSkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY2xhc3MgRE9NRWxlbWVudCB7XG4gIHN0YXRpYyBmb3IoZWwpIHtcbiAgICByZXR1cm4gbmV3IERPTUVsZW1lbnQoZWwpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoZWwpIHtcbiAgICB0aGlzLmVsID0gZWw7XG4gIH1cblxuICBhZGRDbGFzcyhrbGFzcykge1xuICAgIGlmICggdGhpcy5oYXNDbGFzcyhrbGFzcykgKSByZXR1cm47XG4gICAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKGtsYXNzKTtcbiAgfVxuXG4gIGhhc0NsYXNzKGtsYXNzKSB7XG4gICAgcmV0dXJuIHRoaXMuZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGtsYXNzKTtcbiAgfVxuXG4gIHJlbW92ZUNsYXNzKGtsYXNzKSB7XG4gICAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKGtsYXNzKTtcbiAgfVxuXG4gIG1hdGNoKGRvbUVsKSB7XG4gICAgcmV0dXJuIHRoaXMuZWwgPT0gZG9tRWwuZWw7XG4gIH1cblxuICB1cmwoKSB7XG4gICAgbGV0IGFuY2hvciA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcignYScpO1xuICAgIGlmICggIWFuY2hvciApIHJldHVybiBudWxsO1xuXG4gICAgcmV0dXJuIGFuY2hvci5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IERPTUVsZW1lbnQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBLZXljb2RlcyBmcm9tICcuL2tleWNvZGVzJztcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBLZXlib2FyZCB7XG4gIGxpc3RlbihlbCkge1xuICAgIGVsLm9ua2V5ZG93biA9IEtleWNvZGVzLm9ua2V5ZG93bjtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY2xhc3MgS2V5Y29kZXMge1xuICBzdGF0aWMgb25rZXlkb3duKGUpIHtcbiAgICAvLyBBc3N1bWUgYW55IGtleXN0cm9rZSBpcyBtZWFudCB0byBmdXJ0aGVyIGZpbHRlciByZXN1bHRzLiBBbnkgb3RoZXJcbiAgICAvLyBhY3Rpb24gbXVzdCBiZSBleHBsaWNpdGx5IGhhbmRsZWQgZm9yIGhlcmUuXG4gICAgdmFyIG1lc3NhZ2UgPSB7XG4gICAgICBrZXljb2RlOiBlLmtleUNvZGUsXG4gICAgICB0eXBlOiAnZmlsdGVyJyxcbiAgICAgIGFjdGlvbjogbnVsbFxuICAgIH07XG5cbiAgICBzd2l0Y2ggKCBlLmtleUNvZGUgKSB7XG4gICAgICBjYXNlIDEzOiAvLyBlbnRlclxuICAgICAgICBtZXNzYWdlLnR5cGUgPSAnbWV0YSc7XG4gICAgICAgIG1lc3NhZ2UuYWN0aW9uID0gJ29wZW5VUkwnO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAxNzogLy8gY3RybFxuICAgICAgY2FzZSA5MzogLy8gY21kXG4gICAgICAgIG1lc3NhZ2UudHlwZSA9ICdub29wJztcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgMzg6IC8vIHVwIGFycm93XG4gICAgICAgIG1lc3NhZ2UudHlwZSA9ICdtZXRhJztcbiAgICAgICAgbWVzc2FnZS5hY3Rpb24gPSAnbW92ZVVwJztcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgNDA6IC8vIGRvd24gYXJyb3dcbiAgICAgICAgbWVzc2FnZS50eXBlID0gJ21ldGEnO1xuICAgICAgICBtZXNzYWdlLmFjdGlvbiA9ICdtb3ZlRG93bic7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIDc4OiAvLyBuXG4gICAgICAgIGlmICggZS5jdHJsS2V5ICkge1xuICAgICAgICAgIG1lc3NhZ2UudHlwZSA9ICdtZXRhJztcbiAgICAgICAgICBtZXNzYWdlLmFjdGlvbiA9ICdtb3ZlRG93bic7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgODA6IC8vIHBcbiAgICAgICAgaWYgKCBlLmN0cmxLZXkgKSB7XG4gICAgICAgICAgbWVzc2FnZS50eXBlID0gJ21ldGEnO1xuICAgICAgICAgIG1lc3NhZ2UuYWN0aW9uID0gJ21vdmVVcCc7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGNvbnNvbGUubG9nKGBrZXlDb2RlOiAke2Uua2V5Q29kZX1gKTtcbiAgICB9O1xuXG4gICAgLy8gRW1pdCBtZXNzYWdlIHNvIHRoZSBwcm9wZXIgYWN0aW9uIGNhbiBiZSB0YWtlblxuICAgIGlmICggbWVzc2FnZS50eXBlICE9ICdub29wJyApIHtcbiAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKG1lc3NhZ2UpIFxuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBLZXljb2RlcztcbiIsImNsYXNzIE1hdGNoZXIge1xuICBjb25zdHJ1Y3RvciAoc3RyaW5nKSB7XG4gICAgdGhpcy5zdHJpbmcgPSAoc3RyaW5nIHx8ICcnKS50b0xvd2VyQ2FzZSgpO1xuICAgIHRoaXMucHJldmlvdXNNYXRjaGVzID0ge307XG4gIH1cblxuICBtYXRjaGVzKHF1ZXJ5KSB7XG4gICAgaWYgKCB0aGlzLmhhc01hdGNoRGF0YShxdWVyeSkgKSByZXR1cm4gdGhpcy5tYXRjaERhdGEocXVlcnkpO1xuXG4gICAgbGV0IGZvbyA9IHRoaXMuc3RyaW5nO1xuXG4gICAgbGV0IG1hdGNoID0gZmFsc2U7XG4gICAgbGV0IGxvY2F0aW9ucyA9IFtdO1xuICAgIGxldCBxID0gcXVlcnkudG9Mb3dlckNhc2UoKTtcbiAgICBsZXQgcWxlbiA9IHEubGVuZ3RoO1xuICAgIGxldCBqID0gMDtcblxuICAgIC8vIFdhcyB0aGUgbGFzdCBjaGFyYWN0ZXIgYSBtYXRjaD9cbiAgICBsZXQgcnVuID0gZmFsc2U7XG5cbiAgICBmb3IgKCBsZXQgaSA9IDA7IGkgPCB0aGlzLnN0cmluZy5sZW5ndGggJiYgIW1hdGNoOyBpKyspIHtcbiAgICAgIHZhciBzdHJDaGFyID0gdGhpcy5jaGFyQXQoaSk7XG4gICAgICB2YXIgcXVlcnlDaGFyID0gcVtqXTtcblxuICAgICAgaWYgKCBzdHJDaGFyICE9IHF1ZXJ5Q2hhciApIHtcbiAgICAgICAgLy8gV2UgZmFpbGVkIHRvIG1hdGNoIHNvIGlmIHdlIHdlcmUgb24gYSBydW4sIGl0IGhhcyBlbmRlZFxuICAgICAgICBydW4gPSBmYWxzZTtcbiAgICAgIH0gZWxzZSBpZiAoIHJ1biApIHtcbiAgICAgICAgLy8gVGhlIHByZXZpb3VzIGl0ZXJhdGlvbiBmb3VuZCBhIG1hdGNoLiBUaGF0IG1lYW5zIHdlIGFyZSBjdXJyZW50bHlcbiAgICAgICAgLy8gb24gYSBydW4gb2YgbWF0Y2hpbmcgY2hhcmFjdGVycy4gVGhpcyBpcyBhbiBlYXN5IHN0ZXAgc2luY2Ugd2VcbiAgICAgICAgLy8ganVzdCB3YW50IHRvIGluY3JlbWVudCB0aGUgZW5kIHBvc2l0aW9uIGZvciB0aGUgbW9zdCByZWNlbnRcbiAgICAgICAgLy8gbG9jRGF0YSBvYmplY3QgKGluIGxvY2F0aW9ucylcbiAgICAgICAgdmFyIGxhc3QgPSBsb2NhdGlvbnMucG9wKCk7XG4gICAgICAgIGxhc3RbMV0rKztcbiAgICAgICAgaisrO1xuICAgICAgICBsb2NhdGlvbnMucHVzaChsYXN0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEZpcnN0IG1hdGNoIHdlIGhhdmUgc2VlbiBpbiBhdCBsZWFzdCAxIGZ1bGwgaXRlcmF0aW9uLiBJZiB0aGVcbiAgICAgICAgLy8gbmV4dCBpdGVyYXRpb24gbWF0Y2hlcywgYmUgc3VyZSB0byBhcHBlbmQgdG8gdGhpcyBsb2NEYXRhXG4gICAgICAgIHJ1biA9IHRydWU7XG5cbiAgICAgICAgLy8gVGhpbmsgc2xpY2UoKS4gTG9jYXRpb24gZGF0YSB3aWxsIGJlIGFuIGFycmF5IHdoZXJlIHRoZSBmaXJzdFxuICAgICAgICAvLyB2YWx1ZSBpcyB0aGUgaW5kZXggb2YgdGhlIGZpcnN0IG1hdGNoIGFuZCB0aGUgc2Vjb25kIHZhbHVlIGlzXG4gICAgICAgIC8vIHRoZSBpbmRleCBvZiB0aGUgbGFzdCBtYXRjaC5cbiAgICAgICAgbGV0IGxvY0RhdGEgPSBbaSwgaSsxXTtcblxuICAgICAgICAvLyBNYXRjaCB0aGUgbGFyZ2VzdCBjaHVua3Mgb2YgbWF0Y2hpbmcgdGV4dCB0b2dldGhlciFcbiAgICAgICAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBsYXN0IGNoYXJhY3RlciBpbiB0aGUgcXVlcnkgc3RyaW5nIG1hdGNoZXNcbiAgICAgICAgLy8gdGhlIGxhc3QgY2hhcmFjdGVyIGluIHRoaXMuc3RyaW5nLiBJZiBzbywgc3RlYWwgdGhhdCBjaGFyYWN0ZXJzXG4gICAgICAgIC8vIGxvY2F0aW9uIGRhdGEgKGZyb20gdGhlIHByZXZpb3VzIGxvY0RhdGEgZm91bmQgYXQgbG9jYXRpb25zLmxhc3QpXG4gICAgICAgIC8vIGFuZCBwcmVwZW5kIGl0IHRvIHRoaXMgbWF0Y2ggZGF0YS5cbiAgICAgICAgLy8gRm9yIGV4YW1wbGUsIGlmIHdlIHdhbnQgdG8gbWF0Y2ggJ2RtJywgZG9pbmcgYSBcImZpcnN0IGNvbWUsIGZpcnN0XG4gICAgICAgIC8vIG1hdGNoXCIgd291bGQgcHJvZHVjZSB0aGlzIG1hdGNoIChtYXRjaGVzIGFyZSBpbiBjYXBzKTpcbiAgICAgICAgLy8gICAnL0R6L2EvZE1veidcbiAgICAgICAgLy8gSG93ZXZlciwgd2Ugd2FudCB0byBtYXRjaCBhcyBtYW55IGNvbnNlY3V0aXZlIHN0cmluZ3MgYXMgcG9zc2libGUsXG4gICAgICAgIC8vIHRodXMgdGhlIG1hdGNoIHNob3VsZCBiZTpcbiAgICAgICAgLy8gICAnL2R6L2EvRE0nXG4gICAgICAgIGxldCBjb250ID0gdHJ1ZTtcbiAgICAgICAgZm9yICggdmFyIGsgPSAxOyBrIDw9IGkgJiYgY29udDsgaysrKSB7XG4gICAgICAgICAgbGV0IHByZXZTdHJDaGFyID0gdGhpcy5jaGFyQXQoaSAtIGspO1xuICAgICAgICAgIGxldCBwcmV2UXVlcnlDaGFyID0gcVtqIC0ga107XG4gICAgICAgICAgY29udCA9IHByZXZTdHJDaGFyID09IHByZXZRdWVyeUNoYXI7XG4gICAgICAgICAgaWYgKCBjb250ICkge1xuICAgICAgICAgICAgLy8gcXVlcnk6IGRtXG4gICAgICAgICAgICAvLyBzdHJpbmc6IGZzZGxzZG1velxuICAgICAgICAgICAgLy8gcHJldjogWzIsM10gLS0+IFsyLDJdIC0tPiByZW1vdmUgaXRcbiAgICAgICAgICAgIC8vIGN1cnI6IFs2LDddIC0tPiBbNSw3XVxuICAgICAgICAgICAgbGV0IHByZXZMb2NEYXRhID0gbG9jYXRpb25zLnBvcCgpO1xuICAgICAgICAgICAgcHJldkxvY0RhdGFbMV0tLTtcblxuICAgICAgICAgICAgLy8gT25seSBwZXJzaXN0IHRoZSBwcmV2aW91cyBsb2NhdGlvbiBkYXRhIGlmIGl0IGhhcyBhdCBsZWFzdCAxIG1hdGNoXG4gICAgICAgICAgICBpZiAoIHByZXZMb2NEYXRhWzBdIDwgcHJldkxvY0RhdGFbMV0gKSBsb2NhdGlvbnMucHVzaChwcmV2TG9jRGF0YSk7XG5cbiAgICAgICAgICAgIC8vIE5vdywgbW92ZSB0aGUgc3RhcnQgcG9zaXRpb24gYmFjayAxIGZvciB0aGUgY3VycmVudCBtYXRjaFxuICAgICAgICAgICAgbG9jRGF0YVswXS0tO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsb2NhdGlvbnMucHVzaChsb2NEYXRhKTtcbiAgICAgICAgaisrO1xuICAgICAgfVxuXG4gICAgICBtYXRjaCA9ICggaiA9PSBxbGVuICk7XG4gICAgfVxuXG4gICAgaWYgKCBtYXRjaCkge1xuICAgICAgdGhpcy5zZXRNYXRjaERhdGEocXVlcnksIG1hdGNoLCBsb2NhdGlvbnMpO1xuICAgIH1cblxuICAgIHJldHVybiBtYXRjaDtcbiAgfVxuXG4gIHNldE1hdGNoRGF0YShxdWVyeSwgYm9vbCwgbG9jYXRpb25zKSB7XG4gICAgdGhpcy5wcmV2aW91c01hdGNoZXNbcXVlcnldID0ge1xuICAgICAgbWF0Y2g6IGJvb2wsXG4gICAgICBsb2NhdGlvbnM6IGxvY2F0aW9ucyxcbiAgICAgIHNjb3JlOiB0aGlzLmNhbGN1bGF0ZVNjb3JlRm9yKGxvY2F0aW9ucylcbiAgICB9O1xuICB9XG5cbiAgY2FsY3VsYXRlU2NvcmVGb3IobG9jYXRpb25zKSB7XG4gICAgLy8gU2ltcGx5IGRvdWJsZSB0aGUgbGVuZ3RoIG9mIGVhY2ggbWF0Y2ggbGVuZ3RoLlxuICAgIHJldHVybiBsb2NhdGlvbnMubWFwKChtYXRjaCkgPT4ge1xuICAgICAgcmV0dXJuIE1hdGguYWJzKG1hdGNoWzBdIC0gKG1hdGNoWzFdLTEpKSAqIDI7XG4gICAgfSkucmVkdWNlKChhLCBiKSA9PiB7XG4gICAgICByZXR1cm4gYSArIGI7XG4gICAgfSwgMCk7XG4gIH1cblxuICBoYXNNYXRjaERhdGEocXVlcnkpIHtcbiAgICByZXR1cm4gISF0aGlzLm1hdGNoRGF0YShxdWVyeSk7XG4gIH1cblxuICBtYXRjaERhdGEocXVlcnkpIHtcbiAgICByZXR1cm4gdGhpcy5wcmV2aW91c01hdGNoZXNbcXVlcnldO1xuICB9XG5cbiAgY2hhckF0KGkpIHtcbiAgICByZXR1cm4gdGhpcy5zdHJpbmcuY2hhckF0KGkpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWF0Y2hlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IFJlc3VsdHNET00gZnJvbSAnLi9yZXN1bHRzX2RvbSc7XG5cbmNsYXNzIE1ldGEge1xuICBjb25zdHJ1Y3RvcihsaXN0KSB7XG4gICAgdGhpcy5saXN0ID0gbmV3IFJlc3VsdHNET00obGlzdCk7XG4gIH1cblxuICBwZXJmb3JtKGFjdGlvbikge1xuICAgIGNvbnNvbGUubG9nKGBwZXJmb3JtOiAke2FjdGlvbn1gKTtcbiAgICB0aGlzW2FjdGlvbl0oKTtcbiAgfVxuXG4gIG9wZW5VUkwoKSB7XG4gICAgbGV0IGl0ZW0gPSB0aGlzLmxpc3Quc2VsZWN0ZWQoKTtcbiAgICBsZXQgdXJsID0gaXRlbS51cmwoKTtcbiAgICBpZiAoIHVybCApIGNocm9tZS50YWJzLmNyZWF0ZSh7IHVybDogdXJsIH0pO1xuICB9ICBcblxuICBtb3ZlVXAoKSB7XG4gICAgdmFyIGl0ZW0gPSB0aGlzLmxpc3Quc2VsZWN0ZWQoKTtcbiAgICB2YXIgcHJldiA9IHRoaXMubGlzdC5wcmV2aW91cyhpdGVtKTtcblxuICAgIGlmICggcHJldiAmJiBpdGVtICE9IHByZXYgKSB7XG4gICAgICB0aGlzLmxpc3QudW5zZWxlY3QoaXRlbSk7XG4gICAgICB0aGlzLmxpc3Quc2VsZWN0KHByZXYpO1xuICAgIH1cbiAgfVxuXG4gIG1vdmVEb3duKCkge1xuICAgIHZhciBpdGVtID0gdGhpcy5saXN0LnNlbGVjdGVkKCk7XG4gICAgdmFyIG5leHQgPSB0aGlzLmxpc3QubmV4dChpdGVtKTtcblxuICAgIGlmICggbmV4dCAmJiBpdGVtICE9IG5leHQgKSB7XG4gICAgICB0aGlzLmxpc3QudW5zZWxlY3QoaXRlbSk7XG4gICAgICB0aGlzLmxpc3Quc2VsZWN0KG5leHQpO1xuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNZXRhO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgTWF0Y2hlciBmcm9tICcuL21hdGNoZXInO1xuXG5jbGFzcyBOb2RlUGF0aCB7XG4gIGNvbnN0cnVjdG9yKHVybCwgcGllY2VzLCBzb3VyY2U9J2Jvb2ttYXJrJykge1xuICAgIHRoaXMudXJsID0gdXJsO1xuICAgIHRoaXMucGllY2VzID0gcGllY2VzO1xuICAgIHRoaXMucGF0aCA9IHBpZWNlcy5qb2luKCcvJyk7XG4gICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgdGhpcy5tYXRjaGVycyA9IHtcbiAgICAgIHBhdGg6IG5ldyBNYXRjaGVyKHRoaXMucGF0aCksXG4gICAgICB1cmw6IG5ldyBNYXRjaGVyKHRoaXMudXJsKVxuICAgIH07XG4gIH1cblxuICBsb29zZU1hdGNoKHEpIHtcbiAgICB2YXIgYSA9IHRoaXMubWF0Y2hGb3IoJ3BhdGgnLCBxKTtcbiAgICB2YXIgYiA9IHRoaXMubWF0Y2hGb3IoJ3VybCcsIHEpO1xuICAgIHJldHVybiBhIHx8IGI7XG4gIH1cblxuICBtYXRjaEZvcih0eXBlLCBxKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2hlcnNbdHlwZV0ubWF0Y2hlcyhxKTtcbiAgfVxuXG4gIG1hdGNoU2NvcmUocSkge1xuICAgIHZhciBhID0gKHRoaXMubWF0Y2hEYXRhRm9yKCdwYXRoJywgcSkgfHwge3Njb3JlOjB9KS5zY29yZTtcbiAgICB2YXIgYiA9ICh0aGlzLm1hdGNoRGF0YUZvcigndXJsJywgcSkgfHwge3Njb3JlOjB9KS5zY29yZTtcbiAgICByZXR1cm4gTWF0aC5tYXgoYSxiKTtcbiAgfVxuXG4gIG1hdGNoRGF0YUZvcih0eXBlLCBxKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2hlcnNbdHlwZV0ubWF0Y2hEYXRhKHEpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTm9kZVBhdGg7XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBET01FbGVtZW50IGZyb20gJy4vZG9tX2VsZW1lbnQnO1xuXG5jbGFzcyBSZXN1bHRzRE9NIHtcbiAgY29uc3RydWN0b3IoY29udGFpbmVyKSB7XG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG4gIH1cblxuICBpdGVtcygpIHtcbiAgICByZXR1cm4gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLnJlc3VsdC5ib3gnKTtcbiAgfVxuXG4gIGZpcnN0KCkge1xuICAgIGxldCBpdGVtID0gdGhpcy5pdGVtc1swXTtcbiAgICByZXR1cm4gdGhpcy5kb21FbE9yTnVsbChpdGVtKTtcbiAgfVxuXG4gIGxhc3QoKSB7XG4gICAgbGV0IGxpc3QgPSB0aGlzLml0ZW1zKCk7XG4gICAgbGV0IGl0ZW0gPSBsaXN0W2xpc3QubGVuZ3RoIC0gMV07XG4gICAgcmV0dXJuIHRoaXMuZG9tRWxPck51bGwoaXRlbSk7XG4gIH1cblxuICBzZWxlY3RlZCgpIHtcbiAgICBsZXQgaXRlbSA9IHRoaXMuY29udGFpbmVyLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3NlbGVjdGVkJylbMF07XG4gICAgcmV0dXJuIHRoaXMuZG9tRWxPck51bGwoaXRlbSk7XG4gIH1cblxuICAvLyBHZXQgdGhlIG5leHQgZWxlbWVudCBpbiB0aGUgbGlzdCByZWxhdGl2ZSB0byB0aGUgcHJvdmlkZWQgZG9tRWxcbiAgbmV4dChkb21FbCkge1xuICAgIGlmICggIWRvbUVsICkgcmV0dXJuIHRoaXMuZmlyc3QoKTtcblxuICAgIGxldCBpbmRleCA9IHRoaXMuaW5kZXhPZihkb21FbCk7XG4gICAgbGV0IGl0ZW1zID0gdGhpcy5pdGVtcygpO1xuICAgIGxldCBuZXh0ID0gaXRlbXNbaW5kZXggKyAxXTtcbiAgICBpZiAoICFuZXh0ICkgbmV4dCA9IHRoaXMubGFzdCgpO1xuICAgIHJldHVybiB0aGlzLmRvbUVsT3JOdWxsKG5leHQpO1xuICB9XG5cbiAgcHJldmlvdXMoZG9tRWwpIHtcbiAgICBpZiAoICFkb21FbCApIHJldHVybiBudWxsO1xuXG4gICAgbGV0IGluZGV4ID0gdGhpcy5pbmRleE9mKGRvbUVsKTtcbiAgICBsZXQgaXRlbXMgPSB0aGlzLml0ZW1zKCk7XG4gICAgbGV0IHByZXYgPSBpdGVtc1tpbmRleCAtIDFdO1xuICAgIHJldHVybiB0aGlzLmRvbUVsT3JOdWxsKHByZXYpO1xuICB9XG5cbiAgZG9tRWxPck51bGwoZWwpIHtcbiAgICBpZiAoICFlbCApIHJldHVybiBudWxsO1xuICAgIC8vIGVsIGlzIGFscmVhZHkgYSBET01FTGVtZW50XG4gICAgaWYgKCAhISh0eXBlb2YgZWwgPT0gJ29iamVjdCcgJiYgZWxbJ2VsJ10pICkgcmV0dXJuIGVsO1xuICAgIHJldHVybiBuZXcgRE9NRWxlbWVudChlbCk7XG4gIH1cblxuICAvLyBBZGQgJ3NlbGVjdGVkJyBjbGFzcyB0byB0aGUgcHJvdmlkZWQgZG9tRWxcbiAgc2VsZWN0KGRvbUVsKSB7XG4gICAgaWYgKCAhZG9tRWwgKSBkb21FbCA9IHRoaXMubGFzdCgpO1xuICAgIGRvbUVsLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuICB9XG5cbiAgLy8gUmVtb3ZlICdzZWxlY3RlZCcgY2xhc3MgZnJvbSB0aGUgcHJvdmlkZWQgZG9tRWxcbiAgdW5zZWxlY3QoZG9tRWwpIHtcbiAgICBpZiAoICFkb21FbCApIHJldHVybjtcbiAgICBkb21FbC5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcbiAgfVxuXG4gIHVuc2VsZWN0QWxsKCkge1xuICAgIHRoaXMuZWFjaCgoZG9tRWwpID0+IHsgdGhpcy51bnNlbGVjdChkb21FbCkgfSk7XG4gIH1cblxuICBlYWNoKGZuLCBhcmdzPXt9KSB7XG4gICAgbGV0IGJvdW5kID0gZm4uYmluZCh0aGlzKTtcbiAgICBsZXQgaXRlbXMgPSB0aGlzLml0ZW1zKCk7XG4gICAgZm9yICggbGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKysgKSB7XG4gICAgICBib3VuZChuZXcgRE9NRWxlbWVudChpdGVtc1tpXSksIGFyZ3MsIGkpO1xuICAgIH1cbiAgfVxuXG4gIGluZGV4T2YoZG9tRWwpIHtcbiAgICBsZXQgaXRlbXMgPSB0aGlzLml0ZW1zKCk7XG4gICAgbGV0IGluZGV4O1xuICAgIGZvciAoIGxldCBpID0gMDsgIWluZGV4ICYmIGkgPCBpdGVtcy5sZW5ndGg7IGkrKyApIHtcbiAgICAgIGlmICggZG9tRWwuZWwgPT0gaXRlbXNbaV0gKSBpbmRleCA9IGk7XG4gICAgfVxuICAgIHJldHVybiBpbmRleDtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlc3VsdHNET007XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBOb2RlUGF0aCBmcm9tICcuL25vZGVfcGF0aCc7XG5cbmNsYXNzIFRyZWVNYXBwZXIge1xuICBjb25zdHJ1Y3Rvcih0cmVlKSB7XG4gICAgdGhpcy50cmVlID0gdHJlZTtcbiAgICB0aGlzLmNvbGxlY3Rpb24gPSB0aGlzLnBhcnNlKCk7XG4gIH1cblxuICBmaWx0ZXIocXVlcnkpIHtcbiAgICBsZXQgeiA9IHRoaXMuY29sbGVjdGlvbi5maWx0ZXIoKG5vZGVwYXRoKSA9PiB7XG4gICAgICByZXR1cm4gbm9kZXBhdGgubG9vc2VNYXRjaChxdWVyeSk7XG4gICAgfSkuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICBsZXQgc2NvcmVhID0gYS5tYXRjaFNjb3JlKHF1ZXJ5KTtcbiAgICAgIGxldCBzY29yZWIgPSBiLm1hdGNoU2NvcmUocXVlcnkpO1xuICAgICAgcmV0dXJuIHNjb3JlYSA8IHNjb3JlYjtcbiAgICB9KTtcbiAgICByZXR1cm4gejtcbiAgfVxuXG4gIHBhcnNlKCkge1xuICAgIGxldCBjb2xsZWN0aW9uID0gW107XG5cbiAgICB2YXIgYiA9IChub2RlLCBwYXRoKSA9PiB7XG4gICAgICBwYXRoLnB1c2gobm9kZS50aXRsZSk7XG5cbiAgICAgIGlmICggdGhpcy5ub2RlSGFzQ2hpbGRyZW4obm9kZSkgKSB7XG4gICAgICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgICAgICBsZXQgY29weSA9IHBhdGguc2xpY2UoMCk7XG4gICAgICAgICAgYihjaGlsZCwgY29weSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IG5vZGVQYXRoID0gbmV3IE5vZGVQYXRoKG5vZGUudXJsLCBwYXRoLCAnYm9va21hcmsnKTtcbiAgICAgICAgY29sbGVjdGlvbi5wdXNoKG5vZGVQYXRoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgYih0aGlzLnRyZWVbMF0sIFtdKTtcblxuICAgIHJldHVybiBjb2xsZWN0aW9uO1xuICB9XG5cbiAgbm9kZUhhc0NoaWxkcmVuKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZVsnY2hpbGRyZW4nXSAmJiBub2RlLmNoaWxkcmVuLmxlbmd0aCA+IDA7XG4gIH1cblxuICBhZGROb2RlKG5vZGUpIHtcbiAgICB0aGlzLmNvbGxlY3Rpb24ucHVzaChub2RlKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRyZWVNYXBwZXI7XG4iLCJpbXBvcnQgTWF0Y2hlciBmcm9tICcuL21hdGNoZXInO1xuXG5jbGFzcyBVcGRhdGVyIHtcbiAgY29uc3RydWN0b3IodHJlZW1hcCwgaW5wdXRFbCwgcmVzdWx0c0VsKSB7XG4gICAgdGhpcy50cmVlbWFwID0gdHJlZW1hcDtcbiAgICB0aGlzLmlucHV0RWwgPSBpbnB1dEVsO1xuICAgIHRoaXMucmVzdWx0c0VsID0gcmVzdWx0c0VsO1xuICB9XG5cbiAgZmlsdGVyKHF1ZXJ5KSB7XG4gICAgdGhpcy5ib29rbWFya3MgPSB0aGlzLnRyZWVtYXAuZmlsdGVyKHF1ZXJ5KTtcbiAgICB0aGlzLnJlbmRlcihxdWVyeSk7XG4gICAgdGhpcy5yZXNpemUoKTtcbiAgfVxuXG4gIHJlbmRlcihxdWVyeSkge1xuICAgIGxldCBjb250ZW50ID0gRmluZHIudGVtcGxhdGVzLnJlc3VsdHMoe1xuICAgICAgcXVlcnk6IHF1ZXJ5LFxuICAgICAgYm9va21hcmtzOiB0aGlzLmJvb2ttYXJrc1xuICAgIH0pO1xuICAgIHRoaXMucmVzdWx0c0VsLmlubmVySFRNTCA9IGNvbnRlbnQ7XG4gIH1cblxuICAvLyBUT0RPOiBUaGlzIHJlYWxseSBpcyBqdXN0IHRocm93biBpbiBoZXJlIGFuZCBsaWtlbHkgZG9lcyBub3QgYmVsb25nXG4gIC8vIGluIHRoaXMgY2xhc3MuIENsZWFuIGl0IHVwIVxuICByZXNpemUoKSB7XG4gICAgbGV0IGRvY0hlaWdodCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgbGV0IGNvbnRlbnRIZWlnaHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWFpbicpLm9mZnNldEhlaWdodDtcbiAgICBpZiAoIGNvbnRlbnRIZWlnaHQgPCBkb2NIZWlnaHQgKSB7XG4gICAgICB2YXIgaCA9IGAke2NvbnRlbnRIZWlnaHR9cHhgO1xuICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5oZWlnaHQgPSBoO1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJodG1sXCIpWzBdLnN0eWxlLmhlaWdodCA9IGg7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVXBkYXRlcjtcbiJdfQ==
