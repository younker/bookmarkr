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
    }
  }, {
    key: 'render',
    value: function render(query) {
      debugger;
      var content = Findr.templates.results({
        query: query,
        bookmarks: this.bookmarks
      });
      this.resultsEl.innerHTML = content;
    }
  }]);

  return Updater;
})();

module.exports = Updater;

},{"./matcher":5}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvd2Vic2l0ZXMvY2hyb21lX2V4dGVuc2lvbnMvZmluZHIvc3JjL2pzL3BvcHVwLmpzIiwiL3dlYnNpdGVzL2Nocm9tZV9leHRlbnNpb25zL2ZpbmRyL3NyYy9qcy9kb21fZWxlbWVudC5qcyIsIi93ZWJzaXRlcy9jaHJvbWVfZXh0ZW5zaW9ucy9maW5kci9zcmMvanMva2V5Ym9hcmQuanMiLCIvd2Vic2l0ZXMvY2hyb21lX2V4dGVuc2lvbnMvZmluZHIvc3JjL2pzL2tleWNvZGVzLmpzIiwiL3dlYnNpdGVzL2Nocm9tZV9leHRlbnNpb25zL2ZpbmRyL3NyYy9qcy9tYXRjaGVyLmpzIiwiL3dlYnNpdGVzL2Nocm9tZV9leHRlbnNpb25zL2ZpbmRyL3NyYy9qcy9tZXRhLmpzIiwiL3dlYnNpdGVzL2Nocm9tZV9leHRlbnNpb25zL2ZpbmRyL3NyYy9qcy9ub2RlX3BhdGguanMiLCIvd2Vic2l0ZXMvY2hyb21lX2V4dGVuc2lvbnMvZmluZHIvc3JjL2pzL3Jlc3VsdHNfZG9tLmpzIiwiL3dlYnNpdGVzL2Nocm9tZV9leHRlbnNpb25zL2ZpbmRyL3NyYy9qcy90cmVlX21hcHBlci5qcyIsIi93ZWJzaXRlcy9jaHJvbWVfZXh0ZW5zaW9ucy9maW5kci9zcmMvanMvdXBkYXRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLFlBQVksQ0FBQzs7OztvQkFFSSxRQUFROzs7O3dCQUNKLFlBQVk7Ozs7dUJBQ2IsV0FBVzs7OzswQkFDUixlQUFlOzs7O0FBRXRDLENBQUMsWUFBTTtBQUNMLE1BQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0MsTUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQzs7O0FBR2pELE1BQUksT0FBTyxZQUFBLENBQUM7QUFD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QUN2QixRQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztHQUM1Qjs7ZUFMRyxPQUFPOztXQU9MLGdCQUFDLEtBQUssRUFBRTtBQUNaLFVBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDNUMsVUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNwQjs7O1dBRUssZ0JBQUMsS0FBSyxFQUFFO0FBQ1osZUFBUTtBQUNSLFVBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO0FBQ3BDLGFBQUssRUFBRSxLQUFLO0FBQ1osaUJBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztPQUMxQixDQUFDLENBQUM7QUFDSCxVQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7S0FDcEM7OztTQW5CRyxPQUFPOzs7QUFzQmIsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgTWV0YSBmcm9tICcuL21ldGEnO1xuaW1wb3J0IEtleWJvYXJkIGZyb20gJy4va2V5Ym9hcmQnO1xuaW1wb3J0IFVwZGF0ZXIgZnJvbSAnLi91cGRhdGVyJztcbmltcG9ydCBUcmVlTWFwcGVyIGZyb20gJy4vdHJlZV9tYXBwZXInO1xuXG4oKCkgPT4ge1xuICB2YXIgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5wdXQnKTtcbiAgdmFyIHJlc3VsdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdWx0cycpO1xuXG4gIC8vIEhhbmRsZSBhbnkgbGlzdCB1cGRhdGVzIHRoYXQgYXJlIG5lZWRlZFxuICBsZXQgdXBkYXRlcjtcbiAgdmFyIHRyZWUgPSBjaHJvbWUuYm9va21hcmtzLmdldFRyZWUoKHRyZWUpID0+IHtcbiAgICBsZXQgdHJlZW1hcCA9IG5ldyBUcmVlTWFwcGVyKHRyZWUpO1xuICAgIHVwZGF0ZXIgPSBuZXcgVXBkYXRlcih0cmVlbWFwLCBpbnB1dCwgcmVzdWx0cyk7XG4gIH0pO1xuXG4gIC8vIFNldCB1cCB0aGUga2V5Ym9hcmQgdG8gbGlzdGVuIGZvciBrZXkgcHJlc3NlcyBhbmQgaW50ZXJwcmV0IHRoZWlyIGtleWNvZGVzXG4gIHZhciBrZXlib2FyZCA9IG5ldyBLZXlib2FyZCgpO1xuICBrZXlib2FyZC5saXN0ZW4oaW5wdXQpO1xuXG4gIC8vIFJlc3BvbnNpYmxlIGZvciBzZWxlY3Rpb24gbW92ZW1lbnQgJiBhY3Rpb25zIHdpdGhpbiB0aGUgcmVzdWx0IHNldFxuICB2YXIgbWV0YSA9IG5ldyBNZXRhKHJlc3VsdHMpO1xuXG4gIGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihmdW5jdGlvbihtZXNzYWdlLCBzZW5kZXIsIF9yZXNwKSB7XG4gICAgY29uc29sZS5sb2coJ29uTWVzc2FnZScsIG1lc3NhZ2UpO1xuICAgIHN3aXRjaCAoIG1lc3NhZ2UudHlwZSApIHtcbiAgICAgIGNhc2UgJ2ZpbHRlcic6XG4gICAgICAgIHVwZGF0ZXIuZmlsdGVyKGlucHV0LnZhbHVlKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ21ldGEnOlxuICAgICAgICBtZXRhLnBlcmZvcm0obWVzc2FnZS5hY3Rpb24pO1xuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgY29uc29sZS5sb2coJ3VuaGFuZGxlZCBtZXNzYWdlJywgbWVzc2FnZSwgc2VuZGVyKTtcbiAgICB9XG4gIH0pO1xufSkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY2xhc3MgRE9NRWxlbWVudCB7XG4gIHN0YXRpYyBmb3IoZWwpIHtcbiAgICByZXR1cm4gbmV3IERPTUVsZW1lbnQoZWwpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoZWwpIHtcbiAgICB0aGlzLmVsID0gZWw7XG4gIH1cblxuICBhZGRDbGFzcyhrbGFzcykge1xuICAgIGlmICggdGhpcy5oYXNDbGFzcyhrbGFzcykgKSByZXR1cm47XG4gICAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKGtsYXNzKTtcbiAgfVxuXG4gIGhhc0NsYXNzKGtsYXNzKSB7XG4gICAgcmV0dXJuIHRoaXMuZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGtsYXNzKTtcbiAgfVxuXG4gIHJlbW92ZUNsYXNzKGtsYXNzKSB7XG4gICAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKGtsYXNzKTtcbiAgfVxuXG4gIG1hdGNoKGRvbUVsKSB7XG4gICAgcmV0dXJuIHRoaXMuZWwgPT0gZG9tRWwuZWw7XG4gIH1cblxuICB1cmwoKSB7XG4gICAgbGV0IGFuY2hvciA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcignYScpO1xuICAgIGlmICggIWFuY2hvciApIHJldHVybiBudWxsO1xuXG4gICAgcmV0dXJuIGFuY2hvci5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IERPTUVsZW1lbnQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBLZXljb2RlcyBmcm9tICcuL2tleWNvZGVzJztcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBLZXlib2FyZCB7XG4gIGxpc3RlbihlbCkge1xuICAgIGVsLm9ua2V5ZG93biA9IEtleWNvZGVzLm9ua2V5ZG93bjtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY2xhc3MgS2V5Y29kZXMge1xuICBzdGF0aWMgb25rZXlkb3duKGUpIHtcbiAgICAvLyBBc3N1bWUgYW55IGtleXN0cm9rZSBpcyBtZWFudCB0byBmdXJ0aGVyIGZpbHRlciByZXN1bHRzLiBBbnkgb3RoZXJcbiAgICAvLyBhY3Rpb24gbXVzdCBiZSBleHBsaWNpdGx5IGhhbmRsZWQgZm9yIGhlcmUuXG4gICAgdmFyIG1lc3NhZ2UgPSB7XG4gICAgICBrZXljb2RlOiBlLmtleUNvZGUsXG4gICAgICB0eXBlOiAnZmlsdGVyJyxcbiAgICAgIGFjdGlvbjogbnVsbFxuICAgIH07XG5cbiAgICBzd2l0Y2ggKCBlLmtleUNvZGUgKSB7XG4gICAgICBjYXNlIDEzOiAvLyBlbnRlclxuICAgICAgICBtZXNzYWdlLnR5cGUgPSAnbWV0YSc7XG4gICAgICAgIG1lc3NhZ2UuYWN0aW9uID0gJ29wZW5VUkwnO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAxNzogLy8gY3RybFxuICAgICAgY2FzZSA5MzogLy8gY21kXG4gICAgICAgIG1lc3NhZ2UudHlwZSA9ICdub29wJztcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgMzg6IC8vIHVwIGFycm93XG4gICAgICAgIG1lc3NhZ2UudHlwZSA9ICdtZXRhJztcbiAgICAgICAgbWVzc2FnZS5hY3Rpb24gPSAnbW92ZVVwJztcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgNDA6IC8vIGRvd24gYXJyb3dcbiAgICAgICAgbWVzc2FnZS50eXBlID0gJ21ldGEnO1xuICAgICAgICBtZXNzYWdlLmFjdGlvbiA9ICdtb3ZlRG93bic7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIDc4OiAvLyBuXG4gICAgICAgIGlmICggZS5jdHJsS2V5ICkge1xuICAgICAgICAgIG1lc3NhZ2UudHlwZSA9ICdtZXRhJztcbiAgICAgICAgICBtZXNzYWdlLmFjdGlvbiA9ICdtb3ZlRG93bic7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgODA6IC8vIHBcbiAgICAgICAgaWYgKCBlLmN0cmxLZXkgKSB7XG4gICAgICAgICAgbWVzc2FnZS50eXBlID0gJ21ldGEnO1xuICAgICAgICAgIG1lc3NhZ2UuYWN0aW9uID0gJ21vdmVVcCc7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGNvbnNvbGUubG9nKGBrZXlDb2RlOiAke2Uua2V5Q29kZX1gKTtcbiAgICB9O1xuXG4gICAgLy8gRW1pdCBtZXNzYWdlIHNvIHRoZSBwcm9wZXIgYWN0aW9uIGNhbiBiZSB0YWtlblxuICAgIGlmICggbWVzc2FnZS50eXBlICE9ICdub29wJyApIHtcbiAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKG1lc3NhZ2UpIFxuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBLZXljb2RlcztcbiIsImNsYXNzIE1hdGNoZXIge1xuICBjb25zdHJ1Y3RvciAoc3RyaW5nKSB7XG4gICAgdGhpcy5zdHJpbmcgPSAoc3RyaW5nIHx8ICcnKS50b0xvd2VyQ2FzZSgpO1xuICAgIHRoaXMucHJldmlvdXNNYXRjaGVzID0ge307XG4gIH1cblxuICBtYXRjaGVzKHF1ZXJ5KSB7XG4gICAgaWYgKCB0aGlzLmhhc01hdGNoRGF0YShxdWVyeSkgKSByZXR1cm4gdGhpcy5tYXRjaERhdGEocXVlcnkpO1xuXG4gICAgbGV0IG1hdGNoID0gZmFsc2U7XG4gICAgbGV0IGxvY2F0aW9ucyA9IFtdO1xuICAgIGxldCBxID0gcXVlcnkudG9Mb3dlckNhc2UoKTtcbiAgICBsZXQgcWxlbiA9IHEubGVuZ3RoO1xuICAgIGxldCBqID0gMDtcbiAgICBmb3IgKCBsZXQgaSA9IDA7IGkgPCB0aGlzLnN0cmluZy5sZW5ndGggJiYgIW1hdGNoOyBpKyspIHtcbiAgICAgIGlmICggdGhpcy5jaGFyQXQoaSkgPT0gcVtqXSApIHtcbiAgICAgICAgbG9jYXRpb25zLnB1c2goaSk7XG4gICAgICAgIGorKztcbiAgICAgIH1cbiAgICAgIG1hdGNoID0gKCBqID09IHFsZW4gKTtcbiAgICB9XG5cbiAgICBpZiAoIG1hdGNoKSB0aGlzLnNldE1hdGNoRGF0YShxdWVyeSwgbWF0Y2gsIGxvY2F0aW9ucyk7XG5cbiAgICByZXR1cm4gbWF0Y2g7XG4gIH1cblxuICBzZXRNYXRjaERhdGEocXVlcnksIGJvb2wsIGxvY2F0aW9ucykge1xuICAgIHRoaXMucHJldmlvdXNNYXRjaGVzW3F1ZXJ5XSA9IHtcbiAgICAgIG1hdGNoOiBib29sLFxuICAgICAgbG9jYXRpb25zOiBsb2NhdGlvbnNcbiAgICB9O1xuICB9XG5cbiAgaGFzTWF0Y2hEYXRhKHF1ZXJ5KSB7XG4gICAgcmV0dXJuICEhdGhpcy5tYXRjaERhdGEocXVlcnkpO1xuICB9XG5cbiAgbWF0Y2hEYXRhKHF1ZXJ5KSB7XG4gICAgcmV0dXJuIHRoaXMucHJldmlvdXNNYXRjaGVzW3F1ZXJ5XTtcbiAgfVxuXG4gIGNoYXJBdChpKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RyaW5nLmNoYXJBdChpKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1hdGNoZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBSZXN1bHRzRE9NIGZyb20gJy4vcmVzdWx0c19kb20nO1xuXG5jbGFzcyBNZXRhIHtcbiAgY29uc3RydWN0b3IobGlzdCkge1xuICAgIHRoaXMubGlzdCA9IG5ldyBSZXN1bHRzRE9NKGxpc3QpO1xuICB9XG5cbiAgcGVyZm9ybShhY3Rpb24pIHtcbiAgICBjb25zb2xlLmxvZyhgcGVyZm9ybTogJHthY3Rpb259YCk7XG4gICAgdGhpc1thY3Rpb25dKCk7XG4gIH1cblxuICBvcGVuVVJMKCkge1xuICAgIGxldCBpdGVtID0gdGhpcy5saXN0LnNlbGVjdGVkKCk7XG4gICAgbGV0IHVybCA9IGl0ZW0udXJsKCk7XG4gICAgaWYgKCB1cmwgKSBjaHJvbWUudGFicy5jcmVhdGUoeyB1cmw6IHVybCB9KTtcbiAgfSAgXG5cbiAgbW92ZVVwKCkge1xuICAgIHZhciBpdGVtID0gdGhpcy5saXN0LnNlbGVjdGVkKCk7XG4gICAgdmFyIHByZXYgPSB0aGlzLmxpc3QucHJldmlvdXMoaXRlbSk7XG5cbiAgICBpZiAoIHByZXYgJiYgaXRlbSAhPSBwcmV2ICkge1xuICAgICAgdGhpcy5saXN0LnVuc2VsZWN0KGl0ZW0pO1xuICAgICAgdGhpcy5saXN0LnNlbGVjdChwcmV2KTtcbiAgICB9XG4gIH1cblxuICBtb3ZlRG93bigpIHtcbiAgICB2YXIgaXRlbSA9IHRoaXMubGlzdC5zZWxlY3RlZCgpO1xuICAgIHZhciBuZXh0ID0gdGhpcy5saXN0Lm5leHQoaXRlbSk7XG5cbiAgICBpZiAoIG5leHQgJiYgaXRlbSAhPSBuZXh0ICkge1xuICAgICAgdGhpcy5saXN0LnVuc2VsZWN0KGl0ZW0pO1xuICAgICAgdGhpcy5saXN0LnNlbGVjdChuZXh0KTtcbiAgICB9XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTWV0YTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IE1hdGNoZXIgZnJvbSAnLi9tYXRjaGVyJztcblxuY2xhc3MgTm9kZVBhdGgge1xuICBjb25zdHJ1Y3Rvcih1cmwsIHBpZWNlcykge1xuICAgIHRoaXMudXJsID0gdXJsO1xuICAgIHRoaXMucGllY2VzID0gcGllY2VzO1xuICAgIHRoaXMucGF0aCA9IHBpZWNlcy5qb2luKCcvJyk7XG4gICAgdGhpcy5tYXRjaGVycyA9IHtcbiAgICAgIHBhdGg6IG5ldyBNYXRjaGVyKHRoaXMucGF0aCksXG4gICAgICB1cmw6IG5ldyBNYXRjaGVyKHRoaXMudXJsKVxuICAgIH07XG4gIH1cblxuICBsb29zZU1hdGNoKHEpIHtcbiAgICAvLyBNYXRjaCBib3RoIHNvIHdlIGhhdmUgbWF0Y2ggbG9jYXRpb25zIChmb3IgdGhlIFVJKVxuICAgIHZhciBhID0gdGhpcy5tYXRjaEZvcigncGF0aCcsIHEpO1xuICAgIHZhciBiID0gdGhpcy5tYXRjaEZvcigndXJsJywgcSk7XG4gICAgcmV0dXJuIGEgfHwgYjtcbiAgfVxuXG4gIG1hdGNoRGF0YUZvcih0eXBlLCBxKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2hlcnNbdHlwZV0ubWF0Y2hEYXRhKHEpO1xuICB9XG5cbiAgbWF0Y2hGb3IodHlwZSwgcSkge1xuICAgIHJldHVybiB0aGlzLm1hdGNoZXJzW3R5cGVdLm1hdGNoZXMocSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBOb2RlUGF0aDtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IERPTUVsZW1lbnQgZnJvbSAnLi9kb21fZWxlbWVudCc7XG5cbmNsYXNzIFJlc3VsdHNET00ge1xuICBjb25zdHJ1Y3Rvcihjb250YWluZXIpIHtcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgfVxuXG4gIGl0ZW1zKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcucmVzdWx0LmJveCcpO1xuICB9XG5cbiAgZmlyc3QoKSB7XG4gICAgbGV0IGl0ZW0gPSB0aGlzLml0ZW1zWzBdO1xuICAgIHJldHVybiB0aGlzLmRvbUVsT3JOdWxsKGl0ZW0pO1xuICB9XG5cbiAgbGFzdCgpIHtcbiAgICBsZXQgbGlzdCA9IHRoaXMuaXRlbXMoKTtcbiAgICBsZXQgaXRlbSA9IGxpc3RbbGlzdC5sZW5ndGggLSAxXTtcbiAgICByZXR1cm4gdGhpcy5kb21FbE9yTnVsbChpdGVtKTtcbiAgfVxuXG4gIHNlbGVjdGVkKCkge1xuICAgIGxldCBpdGVtID0gdGhpcy5jb250YWluZXIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc2VsZWN0ZWQnKVswXTtcbiAgICByZXR1cm4gdGhpcy5kb21FbE9yTnVsbChpdGVtKTtcbiAgfVxuXG4gIC8vIEdldCB0aGUgbmV4dCBlbGVtZW50IGluIHRoZSBsaXN0IHJlbGF0aXZlIHRvIHRoZSBwcm92aWRlZCBkb21FbFxuICBuZXh0KGRvbUVsKSB7XG4gICAgaWYgKCAhZG9tRWwgKSByZXR1cm4gdGhpcy5maXJzdCgpO1xuXG4gICAgbGV0IGluZGV4ID0gdGhpcy5pbmRleE9mKGRvbUVsKTtcbiAgICBsZXQgaXRlbXMgPSB0aGlzLml0ZW1zKCk7XG4gICAgbGV0IG5leHQgPSBpdGVtc1tpbmRleCArIDFdO1xuICAgIGlmICggIW5leHQgKSBuZXh0ID0gdGhpcy5sYXN0KCk7XG4gICAgcmV0dXJuIHRoaXMuZG9tRWxPck51bGwobmV4dCk7XG4gIH1cblxuICBwcmV2aW91cyhkb21FbCkge1xuICAgIGlmICggIWRvbUVsICkgcmV0dXJuIG51bGw7XG5cbiAgICBsZXQgaW5kZXggPSB0aGlzLmluZGV4T2YoZG9tRWwpO1xuICAgIGxldCBpdGVtcyA9IHRoaXMuaXRlbXMoKTtcbiAgICBsZXQgcHJldiA9IGl0ZW1zW2luZGV4IC0gMV07XG4gICAgcmV0dXJuIHRoaXMuZG9tRWxPck51bGwocHJldik7XG4gIH1cblxuICBkb21FbE9yTnVsbChlbCkge1xuICAgIGlmICggIWVsICkgcmV0dXJuIG51bGw7XG4gICAgLy8gZWwgaXMgYWxyZWFkeSBhIERPTUVMZW1lbnRcbiAgICBpZiAoICEhKHR5cGVvZiBlbCA9PSAnb2JqZWN0JyAmJiBlbFsnZWwnXSkgKSByZXR1cm4gZWw7XG4gICAgcmV0dXJuIG5ldyBET01FbGVtZW50KGVsKTtcbiAgfVxuXG4gIC8vIEFkZCAnc2VsZWN0ZWQnIGNsYXNzIHRvIHRoZSBwcm92aWRlZCBkb21FbFxuICBzZWxlY3QoZG9tRWwpIHtcbiAgICBpZiAoICFkb21FbCApIGRvbUVsID0gdGhpcy5sYXN0KCk7XG4gICAgZG9tRWwuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gIH1cblxuICAvLyBSZW1vdmUgJ3NlbGVjdGVkJyBjbGFzcyBmcm9tIHRoZSBwcm92aWRlZCBkb21FbFxuICB1bnNlbGVjdChkb21FbCkge1xuICAgIGlmICggIWRvbUVsICkgcmV0dXJuO1xuICAgIGRvbUVsLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuICB9XG5cbiAgdW5zZWxlY3RBbGwoKSB7XG4gICAgdGhpcy5lYWNoKChkb21FbCkgPT4geyB0aGlzLnVuc2VsZWN0KGRvbUVsKSB9KTtcbiAgfVxuXG4gIGVhY2goZm4sIGFyZ3M9e30pIHtcbiAgICBsZXQgYm91bmQgPSBmbi5iaW5kKHRoaXMpO1xuICAgIGxldCBpdGVtcyA9IHRoaXMuaXRlbXMoKTtcbiAgICBmb3IgKCBsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKyApIHtcbiAgICAgIGJvdW5kKG5ldyBET01FbGVtZW50KGl0ZW1zW2ldKSwgYXJncywgaSk7XG4gICAgfVxuICB9XG5cbiAgaW5kZXhPZihkb21FbCkge1xuICAgIGxldCBpdGVtcyA9IHRoaXMuaXRlbXMoKTtcbiAgICBsZXQgaW5kZXg7XG4gICAgZm9yICggbGV0IGkgPSAwOyAhaW5kZXggJiYgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrICkge1xuICAgICAgaWYgKCBkb21FbC5lbCA9PSBpdGVtc1tpXSApIGluZGV4ID0gaTtcbiAgICB9XG4gICAgcmV0dXJuIGluZGV4O1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVzdWx0c0RPTTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IE5vZGVQYXRoIGZyb20gJy4vbm9kZV9wYXRoJztcblxuY2xhc3MgVHJlZU1hcHBlciB7XG4gIGNvbnN0cnVjdG9yKHRyZWUpIHtcbiAgICB0aGlzLnRyZWUgPSB0cmVlO1xuICAgIHRoaXMuY29sbGVjdGlvbiA9IHRoaXMucGFyc2UoKTtcbiAgfVxuXG4gIGZpbHRlcihxdWVyeSkge1xuICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb24uZmlsdGVyKChub2RlcGF0aCkgPT4ge1xuICAgICAgcmV0dXJuIG5vZGVwYXRoLmxvb3NlTWF0Y2gocXVlcnkpO1xuICAgIH0pO1xuICB9XG5cbiAgcGFyc2UoKSB7XG4gICAgbGV0IGNvbGxlY3Rpb24gPSBbXTtcblxuICAgIHZhciBiID0gKG5vZGUsIHBhdGgpID0+IHtcbiAgICAgIHBhdGgucHVzaChub2RlLnRpdGxlKTtcblxuICAgICAgaWYgKCB0aGlzLm5vZGVIYXNDaGlsZHJlbihub2RlKSApIHtcbiAgICAgICAgbm9kZS5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgICAgIGxldCBjb3B5ID0gcGF0aC5zbGljZSgwKTtcbiAgICAgICAgICBiKGNoaWxkLCBjb3B5KTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgbm9kZVBhdGggPSBuZXcgTm9kZVBhdGgobm9kZS51cmwsIHBhdGgpO1xuICAgICAgICBjb2xsZWN0aW9uLnB1c2gobm9kZVBhdGgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBiKHRoaXMudHJlZVswXSwgW10pO1xuXG4gICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gIH1cblxuICBub2RlSGFzQ2hpbGRyZW4obm9kZSkge1xuICAgIHJldHVybiBub2RlWydjaGlsZHJlbiddICYmIG5vZGUuY2hpbGRyZW4ubGVuZ3RoID4gMDtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRyZWVNYXBwZXI7XG4iLCJpbXBvcnQgTWF0Y2hlciBmcm9tICcuL21hdGNoZXInO1xuXG5jbGFzcyBVcGRhdGVyIHtcbiAgY29uc3RydWN0b3IodHJlZW1hcCwgaW5wdXRFbCwgcmVzdWx0c0VsKSB7XG4gICAgdGhpcy50cmVlbWFwID0gdHJlZW1hcDtcbiAgICB0aGlzLmlucHV0RWwgPSBpbnB1dEVsO1xuICAgIHRoaXMucmVzdWx0c0VsID0gcmVzdWx0c0VsO1xuICB9XG5cbiAgZmlsdGVyKHF1ZXJ5KSB7XG4gICAgdGhpcy5ib29rbWFya3MgPSB0aGlzLnRyZWVtYXAuZmlsdGVyKHF1ZXJ5KTtcbiAgICB0aGlzLnJlbmRlcihxdWVyeSk7XG4gIH1cblxuICByZW5kZXIocXVlcnkpIHtcbiAgICBkZWJ1Z2dlclxuICAgIGxldCBjb250ZW50ID0gRmluZHIudGVtcGxhdGVzLnJlc3VsdHMoe1xuICAgICAgcXVlcnk6IHF1ZXJ5LFxuICAgICAgYm9va21hcmtzOiB0aGlzLmJvb2ttYXJrc1xuICAgIH0pO1xuICAgIHRoaXMucmVzdWx0c0VsLmlubmVySFRNTCA9IGNvbnRlbnQ7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBVcGRhdGVyIDtcbiJdfQ==
