(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _Meta = require('./meta');

var _Meta2 = _interopRequireWildcard(_Meta);

var _Keyboard = require('./keyboard');

var _Keyboard2 = _interopRequireWildcard(_Keyboard);

var _Updater = require('./updater');

var _Updater2 = _interopRequireWildcard(_Updater);

var _TreeMapper = require('./tree_mapper');

var _TreeMapper2 = _interopRequireWildcard(_TreeMapper);

(function () {
  var input = document.getElementById('input');
  var results = document.getElementById('results');

  // Handle any list updates that are needed
  var updater = undefined;
  var tree = chrome.bookmarks.getTree(function (tree) {
    var treemap = new _TreeMapper2['default'](tree);
    updater = new _Updater2['default'](treemap, input, results);
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

},{"./keyboard":3,"./meta":6,"./tree_mapper":9,"./updater":10}],2:[function(require,module,exports){
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
      }var match = false;
      var locations = [];
      var q = query.toLowerCase();
      var qlen = q.length;
      var j = 0;
      for (var i = 0; i < this.string.length && !match; i++) {
        if (this.charAt(i) == q[j]) {
          locations.push(i);
          j++;
        }
        match = j == qlen;
      }

      if (match) this.setMatchData(query, match, locations);

      return match;
    }
  }, {
    key: 'setMatchData',
    value: function setMatchData(query, bool, locations) {
      this.previousMatches[query] = {
        match: bool,
        locations: locations
      };
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
    _classCallCheck(this, NodePath);

    this.url = url;
    this.pieces = pieces;
    this.path = pieces.join('/');
    this.matchers = {
      path: new _Matcher2['default'](this.path),
      url: new _Matcher2['default'](this.url)
    };
  }

  _createClass(NodePath, [{
    key: 'looseMatch',
    value: function looseMatch(q) {
      // Match both so we have match locations (for the UI)
      var a = this.matchFor('path', q);
      var b = this.matchFor('url', q);
      return a || b;
    }
  }, {
    key: 'matchDataFor',
    value: function matchDataFor(type, q) {
      return this.matchers[type].matchData(q);
    }
  }, {
    key: 'matchFor',
    value: function matchFor(type, q) {
      return this.matchers[type].matches(q);
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
          var nodePath = new _NodePath2['default'](node.url, path);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvd2Vic2l0ZXMvY2hyb21lX2V4dGVuc2lvbnMvZmluZHIvc3JjL2pzL3BvcHVwLmpzIiwiL3dlYnNpdGVzL2Nocm9tZV9leHRlbnNpb25zL2ZpbmRyL3NyYy9qcy9kb21fZWxlbWVudC5qcyIsIi93ZWJzaXRlcy9jaHJvbWVfZXh0ZW5zaW9ucy9maW5kci9zcmMvanMva2V5Ym9hcmQuanMiLCIvd2Vic2l0ZXMvY2hyb21lX2V4dGVuc2lvbnMvZmluZHIvc3JjL2pzL2tleWNvZGVzLmpzIiwiL3dlYnNpdGVzL2Nocm9tZV9leHRlbnNpb25zL2ZpbmRyL3NyYy9qcy9tYXRjaGVyLmpzIiwiL3dlYnNpdGVzL2Nocm9tZV9leHRlbnNpb25zL2ZpbmRyL3NyYy9qcy9tZXRhLmpzIiwiL3dlYnNpdGVzL2Nocm9tZV9leHRlbnNpb25zL2ZpbmRyL3NyYy9qcy9ub2RlX3BhdGguanMiLCIvd2Vic2l0ZXMvY2hyb21lX2V4dGVuc2lvbnMvZmluZHIvc3JjL2pzL3Jlc3VsdHNfZG9tLmpzIiwiL3dlYnNpdGVzL2Nocm9tZV9leHRlbnNpb25zL2ZpbmRyL3NyYy9qcy90cmVlX21hcHBlci5qcyIsIi93ZWJzaXRlcy9jaHJvbWVfZXh0ZW5zaW9ucy9maW5kci9zcmMvanMvdXBkYXRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLFlBQVksQ0FBQzs7OztvQkFFSSxRQUFROzs7O3dCQUNKLFlBQVk7Ozs7dUJBQ2IsV0FBVzs7OzswQkFDUixlQUFlOzs7O0FBRXRDLENBQUMsWUFBTTtBQUNMLE1BQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0MsTUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQzs7O0FBR2pELE1BQUksT0FBTyxZQUFBLENBQUM7QUFD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QUN2QixRQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztHQUM1Qjs7ZUFMRyxPQUFPOztXQU9MLGdCQUFDLEtBQUssRUFBRTtBQUNaLFVBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDNUMsVUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNuQixVQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDZjs7O1dBRUssZ0JBQUMsS0FBSyxFQUFFO0FBQ1osVUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7QUFDcEMsYUFBSyxFQUFFLEtBQUs7QUFDWixpQkFBUyxFQUFFLElBQUksQ0FBQyxTQUFTO09BQzFCLENBQUMsQ0FBQztBQUNILFVBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztLQUNwQzs7O1dBRUssa0JBQUc7QUFDUCxVQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQztBQUN0RCxVQUFJLGFBQWEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFlBQVksQ0FBQztBQUNqRSxVQUFLLGFBQWEsR0FBRyxTQUFTLEVBQUc7QUFDL0IsWUFBSSxDQUFDLFFBQU0sYUFBYSxPQUFJLENBQUM7QUFDN0IsZ0JBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDL0IsZ0JBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztPQUMzRDtLQUNGOzs7U0E3QkcsT0FBTzs7O0FBZ0NiLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IE1ldGEgZnJvbSAnLi9tZXRhJztcbmltcG9ydCBLZXlib2FyZCBmcm9tICcuL2tleWJvYXJkJztcbmltcG9ydCBVcGRhdGVyIGZyb20gJy4vdXBkYXRlcic7XG5pbXBvcnQgVHJlZU1hcHBlciBmcm9tICcuL3RyZWVfbWFwcGVyJztcblxuKCgpID0+IHtcbiAgdmFyIGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lucHV0Jyk7XG4gIHZhciByZXN1bHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3VsdHMnKTtcblxuICAvLyBIYW5kbGUgYW55IGxpc3QgdXBkYXRlcyB0aGF0IGFyZSBuZWVkZWRcbiAgbGV0IHVwZGF0ZXI7XG4gIHZhciB0cmVlID0gY2hyb21lLmJvb2ttYXJrcy5nZXRUcmVlKCh0cmVlKSA9PiB7XG4gICAgbGV0IHRyZWVtYXAgPSBuZXcgVHJlZU1hcHBlcih0cmVlKTtcbiAgICB1cGRhdGVyID0gbmV3IFVwZGF0ZXIodHJlZW1hcCwgaW5wdXQsIHJlc3VsdHMpO1xuICB9KTtcblxuICAvLyBTZXQgdXAgdGhlIGtleWJvYXJkIHRvIGxpc3RlbiBmb3Iga2V5IHByZXNzZXMgYW5kIGludGVycHJldCB0aGVpciBrZXljb2Rlc1xuICB2YXIga2V5Ym9hcmQgPSBuZXcgS2V5Ym9hcmQoKTtcbiAga2V5Ym9hcmQubGlzdGVuKGlucHV0KTtcblxuICAvLyBSZXNwb25zaWJsZSBmb3Igc2VsZWN0aW9uIG1vdmVtZW50ICYgYWN0aW9ucyB3aXRoaW4gdGhlIHJlc3VsdCBzZXRcbiAgdmFyIG1ldGEgPSBuZXcgTWV0YShyZXN1bHRzKTtcblxuICBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoZnVuY3Rpb24obWVzc2FnZSwgc2VuZGVyLCBfcmVzcCkge1xuICAgIGNvbnNvbGUubG9nKCdvbk1lc3NhZ2UnLCBtZXNzYWdlKTtcbiAgICBzd2l0Y2ggKCBtZXNzYWdlLnR5cGUgKSB7XG4gICAgICBjYXNlICdmaWx0ZXInOlxuICAgICAgICB1cGRhdGVyLmZpbHRlcihpbnB1dC52YWx1ZSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdtZXRhJzpcbiAgICAgICAgbWV0YS5wZXJmb3JtKG1lc3NhZ2UuYWN0aW9uKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGNvbnNvbGUubG9nKCd1bmhhbmRsZWQgbWVzc2FnZScsIG1lc3NhZ2UsIHNlbmRlcik7XG4gICAgfVxuICB9KTtcbn0pKCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNsYXNzIERPTUVsZW1lbnQge1xuICBzdGF0aWMgZm9yKGVsKSB7XG4gICAgcmV0dXJuIG5ldyBET01FbGVtZW50KGVsKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGVsKSB7XG4gICAgdGhpcy5lbCA9IGVsO1xuICB9XG5cbiAgYWRkQ2xhc3Moa2xhc3MpIHtcbiAgICBpZiAoIHRoaXMuaGFzQ2xhc3Moa2xhc3MpICkgcmV0dXJuO1xuICAgIHRoaXMuZWwuY2xhc3NMaXN0LmFkZChrbGFzcyk7XG4gIH1cblxuICBoYXNDbGFzcyhrbGFzcykge1xuICAgIHJldHVybiB0aGlzLmVsLmNsYXNzTGlzdC5jb250YWlucyhrbGFzcyk7XG4gIH1cblxuICByZW1vdmVDbGFzcyhrbGFzcykge1xuICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZShrbGFzcyk7XG4gIH1cblxuICBtYXRjaChkb21FbCkge1xuICAgIHJldHVybiB0aGlzLmVsID09IGRvbUVsLmVsO1xuICB9XG5cbiAgdXJsKCkge1xuICAgIGxldCBhbmNob3IgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoJ2EnKTtcbiAgICBpZiAoICFhbmNob3IgKSByZXR1cm4gbnVsbDtcblxuICAgIHJldHVybiBhbmNob3IuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBET01FbGVtZW50O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgS2V5Y29kZXMgZnJvbSAnLi9rZXljb2Rlcyc7XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgS2V5Ym9hcmQge1xuICBsaXN0ZW4oZWwpIHtcbiAgICBlbC5vbmtleWRvd24gPSBLZXljb2Rlcy5vbmtleWRvd247XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmNsYXNzIEtleWNvZGVzIHtcbiAgc3RhdGljIG9ua2V5ZG93bihlKSB7XG4gICAgLy8gQXNzdW1lIGFueSBrZXlzdHJva2UgaXMgbWVhbnQgdG8gZnVydGhlciBmaWx0ZXIgcmVzdWx0cy4gQW55IG90aGVyXG4gICAgLy8gYWN0aW9uIG11c3QgYmUgZXhwbGljaXRseSBoYW5kbGVkIGZvciBoZXJlLlxuICAgIHZhciBtZXNzYWdlID0ge1xuICAgICAga2V5Y29kZTogZS5rZXlDb2RlLFxuICAgICAgdHlwZTogJ2ZpbHRlcicsXG4gICAgICBhY3Rpb246IG51bGxcbiAgICB9O1xuXG4gICAgc3dpdGNoICggZS5rZXlDb2RlICkge1xuICAgICAgY2FzZSAxMzogLy8gZW50ZXJcbiAgICAgICAgbWVzc2FnZS50eXBlID0gJ21ldGEnO1xuICAgICAgICBtZXNzYWdlLmFjdGlvbiA9ICdvcGVuVVJMJztcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgMTc6IC8vIGN0cmxcbiAgICAgIGNhc2UgOTM6IC8vIGNtZFxuICAgICAgICBtZXNzYWdlLnR5cGUgPSAnbm9vcCc7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIDM4OiAvLyB1cCBhcnJvd1xuICAgICAgICBtZXNzYWdlLnR5cGUgPSAnbWV0YSc7XG4gICAgICAgIG1lc3NhZ2UuYWN0aW9uID0gJ21vdmVVcCc7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIDQwOiAvLyBkb3duIGFycm93XG4gICAgICAgIG1lc3NhZ2UudHlwZSA9ICdtZXRhJztcbiAgICAgICAgbWVzc2FnZS5hY3Rpb24gPSAnbW92ZURvd24nO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSA3ODogLy8gblxuICAgICAgICBpZiAoIGUuY3RybEtleSApIHtcbiAgICAgICAgICBtZXNzYWdlLnR5cGUgPSAnbWV0YSc7XG4gICAgICAgICAgbWVzc2FnZS5hY3Rpb24gPSAnbW92ZURvd24nO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIDgwOiAvLyBwXG4gICAgICAgIGlmICggZS5jdHJsS2V5ICkge1xuICAgICAgICAgIG1lc3NhZ2UudHlwZSA9ICdtZXRhJztcbiAgICAgICAgICBtZXNzYWdlLmFjdGlvbiA9ICdtb3ZlVXAnO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBjb25zb2xlLmxvZyhga2V5Q29kZTogJHtlLmtleUNvZGV9YCk7XG4gICAgfTtcblxuICAgIC8vIEVtaXQgbWVzc2FnZSBzbyB0aGUgcHJvcGVyIGFjdGlvbiBjYW4gYmUgdGFrZW5cbiAgICBpZiAoIG1lc3NhZ2UudHlwZSAhPSAnbm9vcCcgKSB7XG4gICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShtZXNzYWdlKSBcbiAgICB9XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gS2V5Y29kZXM7XG4iLCJjbGFzcyBNYXRjaGVyIHtcbiAgY29uc3RydWN0b3IgKHN0cmluZykge1xuICAgIHRoaXMuc3RyaW5nID0gKHN0cmluZyB8fCAnJykudG9Mb3dlckNhc2UoKTtcbiAgICB0aGlzLnByZXZpb3VzTWF0Y2hlcyA9IHt9O1xuICB9XG5cbiAgbWF0Y2hlcyhxdWVyeSkge1xuICAgIGlmICggdGhpcy5oYXNNYXRjaERhdGEocXVlcnkpICkgcmV0dXJuIHRoaXMubWF0Y2hEYXRhKHF1ZXJ5KTtcblxuICAgIGxldCBtYXRjaCA9IGZhbHNlO1xuICAgIGxldCBsb2NhdGlvbnMgPSBbXTtcbiAgICBsZXQgcSA9IHF1ZXJ5LnRvTG93ZXJDYXNlKCk7XG4gICAgbGV0IHFsZW4gPSBxLmxlbmd0aDtcbiAgICBsZXQgaiA9IDA7XG4gICAgZm9yICggbGV0IGkgPSAwOyBpIDwgdGhpcy5zdHJpbmcubGVuZ3RoICYmICFtYXRjaDsgaSsrKSB7XG4gICAgICBpZiAoIHRoaXMuY2hhckF0KGkpID09IHFbal0gKSB7XG4gICAgICAgIGxvY2F0aW9ucy5wdXNoKGkpO1xuICAgICAgICBqKys7XG4gICAgICB9XG4gICAgICBtYXRjaCA9ICggaiA9PSBxbGVuICk7XG4gICAgfVxuXG4gICAgaWYgKCBtYXRjaCkgdGhpcy5zZXRNYXRjaERhdGEocXVlcnksIG1hdGNoLCBsb2NhdGlvbnMpO1xuXG4gICAgcmV0dXJuIG1hdGNoO1xuICB9XG5cbiAgc2V0TWF0Y2hEYXRhKHF1ZXJ5LCBib29sLCBsb2NhdGlvbnMpIHtcbiAgICB0aGlzLnByZXZpb3VzTWF0Y2hlc1txdWVyeV0gPSB7XG4gICAgICBtYXRjaDogYm9vbCxcbiAgICAgIGxvY2F0aW9uczogbG9jYXRpb25zXG4gICAgfTtcbiAgfVxuXG4gIGhhc01hdGNoRGF0YShxdWVyeSkge1xuICAgIHJldHVybiAhIXRoaXMubWF0Y2hEYXRhKHF1ZXJ5KTtcbiAgfVxuXG4gIG1hdGNoRGF0YShxdWVyeSkge1xuICAgIHJldHVybiB0aGlzLnByZXZpb3VzTWF0Y2hlc1txdWVyeV07XG4gIH1cblxuICBjaGFyQXQoaSkge1xuICAgIHJldHVybiB0aGlzLnN0cmluZy5jaGFyQXQoaSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNYXRjaGVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgUmVzdWx0c0RPTSBmcm9tICcuL3Jlc3VsdHNfZG9tJztcblxuY2xhc3MgTWV0YSB7XG4gIGNvbnN0cnVjdG9yKGxpc3QpIHtcbiAgICB0aGlzLmxpc3QgPSBuZXcgUmVzdWx0c0RPTShsaXN0KTtcbiAgfVxuXG4gIHBlcmZvcm0oYWN0aW9uKSB7XG4gICAgY29uc29sZS5sb2coYHBlcmZvcm06ICR7YWN0aW9ufWApO1xuICAgIHRoaXNbYWN0aW9uXSgpO1xuICB9XG5cbiAgb3BlblVSTCgpIHtcbiAgICBsZXQgaXRlbSA9IHRoaXMubGlzdC5zZWxlY3RlZCgpO1xuICAgIGxldCB1cmwgPSBpdGVtLnVybCgpO1xuICAgIGlmICggdXJsICkgY2hyb21lLnRhYnMuY3JlYXRlKHsgdXJsOiB1cmwgfSk7XG4gIH0gIFxuXG4gIG1vdmVVcCgpIHtcbiAgICB2YXIgaXRlbSA9IHRoaXMubGlzdC5zZWxlY3RlZCgpO1xuICAgIHZhciBwcmV2ID0gdGhpcy5saXN0LnByZXZpb3VzKGl0ZW0pO1xuXG4gICAgaWYgKCBwcmV2ICYmIGl0ZW0gIT0gcHJldiApIHtcbiAgICAgIHRoaXMubGlzdC51bnNlbGVjdChpdGVtKTtcbiAgICAgIHRoaXMubGlzdC5zZWxlY3QocHJldik7XG4gICAgfVxuICB9XG5cbiAgbW92ZURvd24oKSB7XG4gICAgdmFyIGl0ZW0gPSB0aGlzLmxpc3Quc2VsZWN0ZWQoKTtcbiAgICB2YXIgbmV4dCA9IHRoaXMubGlzdC5uZXh0KGl0ZW0pO1xuXG4gICAgaWYgKCBuZXh0ICYmIGl0ZW0gIT0gbmV4dCApIHtcbiAgICAgIHRoaXMubGlzdC51bnNlbGVjdChpdGVtKTtcbiAgICAgIHRoaXMubGlzdC5zZWxlY3QobmV4dCk7XG4gICAgfVxuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1ldGE7XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBNYXRjaGVyIGZyb20gJy4vbWF0Y2hlcic7XG5cbmNsYXNzIE5vZGVQYXRoIHtcbiAgY29uc3RydWN0b3IodXJsLCBwaWVjZXMpIHtcbiAgICB0aGlzLnVybCA9IHVybDtcbiAgICB0aGlzLnBpZWNlcyA9IHBpZWNlcztcbiAgICB0aGlzLnBhdGggPSBwaWVjZXMuam9pbignLycpO1xuICAgIHRoaXMubWF0Y2hlcnMgPSB7XG4gICAgICBwYXRoOiBuZXcgTWF0Y2hlcih0aGlzLnBhdGgpLFxuICAgICAgdXJsOiBuZXcgTWF0Y2hlcih0aGlzLnVybClcbiAgICB9O1xuICB9XG5cbiAgbG9vc2VNYXRjaChxKSB7XG4gICAgLy8gTWF0Y2ggYm90aCBzbyB3ZSBoYXZlIG1hdGNoIGxvY2F0aW9ucyAoZm9yIHRoZSBVSSlcbiAgICB2YXIgYSA9IHRoaXMubWF0Y2hGb3IoJ3BhdGgnLCBxKTtcbiAgICB2YXIgYiA9IHRoaXMubWF0Y2hGb3IoJ3VybCcsIHEpO1xuICAgIHJldHVybiBhIHx8IGI7XG4gIH1cblxuICBtYXRjaERhdGFGb3IodHlwZSwgcSkge1xuICAgIHJldHVybiB0aGlzLm1hdGNoZXJzW3R5cGVdLm1hdGNoRGF0YShxKTtcbiAgfVxuXG4gIG1hdGNoRm9yKHR5cGUsIHEpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaGVyc1t0eXBlXS5tYXRjaGVzKHEpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTm9kZVBhdGg7XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBET01FbGVtZW50IGZyb20gJy4vZG9tX2VsZW1lbnQnO1xuXG5jbGFzcyBSZXN1bHRzRE9NIHtcbiAgY29uc3RydWN0b3IoY29udGFpbmVyKSB7XG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG4gIH1cblxuICBpdGVtcygpIHtcbiAgICByZXR1cm4gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLnJlc3VsdC5ib3gnKTtcbiAgfVxuXG4gIGZpcnN0KCkge1xuICAgIGxldCBpdGVtID0gdGhpcy5pdGVtc1swXTtcbiAgICByZXR1cm4gdGhpcy5kb21FbE9yTnVsbChpdGVtKTtcbiAgfVxuXG4gIGxhc3QoKSB7XG4gICAgbGV0IGxpc3QgPSB0aGlzLml0ZW1zKCk7XG4gICAgbGV0IGl0ZW0gPSBsaXN0W2xpc3QubGVuZ3RoIC0gMV07XG4gICAgcmV0dXJuIHRoaXMuZG9tRWxPck51bGwoaXRlbSk7XG4gIH1cblxuICBzZWxlY3RlZCgpIHtcbiAgICBsZXQgaXRlbSA9IHRoaXMuY29udGFpbmVyLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3NlbGVjdGVkJylbMF07XG4gICAgcmV0dXJuIHRoaXMuZG9tRWxPck51bGwoaXRlbSk7XG4gIH1cblxuICAvLyBHZXQgdGhlIG5leHQgZWxlbWVudCBpbiB0aGUgbGlzdCByZWxhdGl2ZSB0byB0aGUgcHJvdmlkZWQgZG9tRWxcbiAgbmV4dChkb21FbCkge1xuICAgIGlmICggIWRvbUVsICkgcmV0dXJuIHRoaXMuZmlyc3QoKTtcblxuICAgIGxldCBpbmRleCA9IHRoaXMuaW5kZXhPZihkb21FbCk7XG4gICAgbGV0IGl0ZW1zID0gdGhpcy5pdGVtcygpO1xuICAgIGxldCBuZXh0ID0gaXRlbXNbaW5kZXggKyAxXTtcbiAgICBpZiAoICFuZXh0ICkgbmV4dCA9IHRoaXMubGFzdCgpO1xuICAgIHJldHVybiB0aGlzLmRvbUVsT3JOdWxsKG5leHQpO1xuICB9XG5cbiAgcHJldmlvdXMoZG9tRWwpIHtcbiAgICBpZiAoICFkb21FbCApIHJldHVybiBudWxsO1xuXG4gICAgbGV0IGluZGV4ID0gdGhpcy5pbmRleE9mKGRvbUVsKTtcbiAgICBsZXQgaXRlbXMgPSB0aGlzLml0ZW1zKCk7XG4gICAgbGV0IHByZXYgPSBpdGVtc1tpbmRleCAtIDFdO1xuICAgIHJldHVybiB0aGlzLmRvbUVsT3JOdWxsKHByZXYpO1xuICB9XG5cbiAgZG9tRWxPck51bGwoZWwpIHtcbiAgICBpZiAoICFlbCApIHJldHVybiBudWxsO1xuICAgIC8vIGVsIGlzIGFscmVhZHkgYSBET01FTGVtZW50XG4gICAgaWYgKCAhISh0eXBlb2YgZWwgPT0gJ29iamVjdCcgJiYgZWxbJ2VsJ10pICkgcmV0dXJuIGVsO1xuICAgIHJldHVybiBuZXcgRE9NRWxlbWVudChlbCk7XG4gIH1cblxuICAvLyBBZGQgJ3NlbGVjdGVkJyBjbGFzcyB0byB0aGUgcHJvdmlkZWQgZG9tRWxcbiAgc2VsZWN0KGRvbUVsKSB7XG4gICAgaWYgKCAhZG9tRWwgKSBkb21FbCA9IHRoaXMubGFzdCgpO1xuICAgIGRvbUVsLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuICB9XG5cbiAgLy8gUmVtb3ZlICdzZWxlY3RlZCcgY2xhc3MgZnJvbSB0aGUgcHJvdmlkZWQgZG9tRWxcbiAgdW5zZWxlY3QoZG9tRWwpIHtcbiAgICBpZiAoICFkb21FbCApIHJldHVybjtcbiAgICBkb21FbC5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcbiAgfVxuXG4gIHVuc2VsZWN0QWxsKCkge1xuICAgIHRoaXMuZWFjaCgoZG9tRWwpID0+IHsgdGhpcy51bnNlbGVjdChkb21FbCkgfSk7XG4gIH1cblxuICBlYWNoKGZuLCBhcmdzPXt9KSB7XG4gICAgbGV0IGJvdW5kID0gZm4uYmluZCh0aGlzKTtcbiAgICBsZXQgaXRlbXMgPSB0aGlzLml0ZW1zKCk7XG4gICAgZm9yICggbGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKysgKSB7XG4gICAgICBib3VuZChuZXcgRE9NRWxlbWVudChpdGVtc1tpXSksIGFyZ3MsIGkpO1xuICAgIH1cbiAgfVxuXG4gIGluZGV4T2YoZG9tRWwpIHtcbiAgICBsZXQgaXRlbXMgPSB0aGlzLml0ZW1zKCk7XG4gICAgbGV0IGluZGV4O1xuICAgIGZvciAoIGxldCBpID0gMDsgIWluZGV4ICYmIGkgPCBpdGVtcy5sZW5ndGg7IGkrKyApIHtcbiAgICAgIGlmICggZG9tRWwuZWwgPT0gaXRlbXNbaV0gKSBpbmRleCA9IGk7XG4gICAgfVxuICAgIHJldHVybiBpbmRleDtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlc3VsdHNET007XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBOb2RlUGF0aCBmcm9tICcuL25vZGVfcGF0aCc7XG5cbmNsYXNzIFRyZWVNYXBwZXIge1xuICBjb25zdHJ1Y3Rvcih0cmVlKSB7XG4gICAgdGhpcy50cmVlID0gdHJlZTtcbiAgICB0aGlzLmNvbGxlY3Rpb24gPSB0aGlzLnBhcnNlKCk7XG4gIH1cblxuICBmaWx0ZXIocXVlcnkpIHtcbiAgICByZXR1cm4gdGhpcy5jb2xsZWN0aW9uLmZpbHRlcigobm9kZXBhdGgpID0+IHtcbiAgICAgIHJldHVybiBub2RlcGF0aC5sb29zZU1hdGNoKHF1ZXJ5KTtcbiAgICB9KTtcbiAgfVxuXG4gIHBhcnNlKCkge1xuICAgIGxldCBjb2xsZWN0aW9uID0gW107XG5cbiAgICB2YXIgYiA9IChub2RlLCBwYXRoKSA9PiB7XG4gICAgICBwYXRoLnB1c2gobm9kZS50aXRsZSk7XG5cbiAgICAgIGlmICggdGhpcy5ub2RlSGFzQ2hpbGRyZW4obm9kZSkgKSB7XG4gICAgICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgICAgICBsZXQgY29weSA9IHBhdGguc2xpY2UoMCk7XG4gICAgICAgICAgYihjaGlsZCwgY29weSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IG5vZGVQYXRoID0gbmV3IE5vZGVQYXRoKG5vZGUudXJsLCBwYXRoKTtcbiAgICAgICAgY29sbGVjdGlvbi5wdXNoKG5vZGVQYXRoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgYih0aGlzLnRyZWVbMF0sIFtdKTtcblxuICAgIHJldHVybiBjb2xsZWN0aW9uO1xuICB9XG5cbiAgbm9kZUhhc0NoaWxkcmVuKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZVsnY2hpbGRyZW4nXSAmJiBub2RlLmNoaWxkcmVuLmxlbmd0aCA+IDA7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUcmVlTWFwcGVyO1xuIiwiaW1wb3J0IE1hdGNoZXIgZnJvbSAnLi9tYXRjaGVyJztcblxuY2xhc3MgVXBkYXRlciB7XG4gIGNvbnN0cnVjdG9yKHRyZWVtYXAsIGlucHV0RWwsIHJlc3VsdHNFbCkge1xuICAgIHRoaXMudHJlZW1hcCA9IHRyZWVtYXA7XG4gICAgdGhpcy5pbnB1dEVsID0gaW5wdXRFbDtcbiAgICB0aGlzLnJlc3VsdHNFbCA9IHJlc3VsdHNFbDtcbiAgfVxuXG4gIGZpbHRlcihxdWVyeSkge1xuICAgIHRoaXMuYm9va21hcmtzID0gdGhpcy50cmVlbWFwLmZpbHRlcihxdWVyeSk7XG4gICAgdGhpcy5yZW5kZXIocXVlcnkpO1xuICAgIHRoaXMucmVzaXplKCk7XG4gIH1cblxuICByZW5kZXIocXVlcnkpIHtcbiAgICBsZXQgY29udGVudCA9IEZpbmRyLnRlbXBsYXRlcy5yZXN1bHRzKHtcbiAgICAgIHF1ZXJ5OiBxdWVyeSxcbiAgICAgIGJvb2ttYXJrczogdGhpcy5ib29rbWFya3NcbiAgICB9KTtcbiAgICB0aGlzLnJlc3VsdHNFbC5pbm5lckhUTUwgPSBjb250ZW50O1xuICB9XG5cbiAgcmVzaXplKCkge1xuICAgIGxldCBkb2NIZWlnaHQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgIGxldCBjb250ZW50SGVpZ2h0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21haW4nKS5vZmZzZXRIZWlnaHQ7XG4gICAgaWYgKCBjb250ZW50SGVpZ2h0IDwgZG9jSGVpZ2h0ICkge1xuICAgICAgdmFyIGggPSBgJHtjb250ZW50SGVpZ2h0fXB4YDtcbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuaGVpZ2h0ID0gaDtcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaHRtbFwiKVswXS5zdHlsZS5oZWlnaHQgPSBoO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFVwZGF0ZXI7XG4iXX0=
