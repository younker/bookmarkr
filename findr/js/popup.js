(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _Meta = require('./meta');

var _Meta2 = _interopRequireWildcard(_Meta);

var _Keyboard = require('./keyboard');

var _Keyboard2 = _interopRequireWildcard(_Keyboard);

var _Updater = require('./updater');

var _Updater2 = _interopRequireWildcard(_Updater);

(function () {
  // Set up the keyboard to listen for key presses and interpret their keycodes
  var keyboard = new _Keyboard2['default']();
  var input = document.getElementById('input');
  keyboard.listen(input);

  // Handle any list updates that are needed
  var results = document.getElementById('results');
  var updater = new _Updater2['default'](input, results);

  // Responsible for selection movement, action cancellations, etc
  var meta = new _Meta2['default'](results);

  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log('onMessage', message);
    switch (message.type) {
      case 'getChildren':
        updater.getChildren(message.id);
        break;

      case 'update':
        var query = input.value;
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

},{"./keyboard":3,"./meta":6,"./updater":8}],2:[function(require,module,exports){
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
    key: 'data',
    value: function data(key) {
      return this.el.getAttribute('data-' + key);
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
      // Assume the action is an update. Any other type of action must be
      // handled for here.
      var message = {
        keycode: e.keyCode,
        type: 'update',
        action: null
      };

      switch (e.keyCode) {
        case 13:
          // enter
          message.type = 'meta';
          message.action = 'trigger';
          break;

        case 17: // ctrl
        case 93:
          // cmd
          message.type = 'noop';
          break;

        case 37:
          // left arrow
          message.type = 'meta';
          message.action = 'moveBack';
          break;

        case 38:
          // up arrow
          message.type = 'meta';
          message.action = 'moveUp';
          break;

        case 39:
          // right arrow
          message.type = 'meta';
          message.action = 'moveForward';
          break;

        case 40:
          // down arrow
          message.type = 'meta';
          message.action = 'moveDown';
          break;

        case 66:
          // b
          if (e.ctrlKey) {
            message.type = 'meta';
            message.action = 'moveBack';
            break;
          }

        case 70:
          // f
          if (e.ctrlKey) {
            message.type = 'meta';
            message.action = 'moveForward';
          }
          break;

        case 71:
          // g
          if (e.ctrlKey) {
            message.type = 'meta';
            message.action = 'cancel';
          }
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
          console.log(e.keyCode);
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
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var Matcher = (function () {
  function Matcher() {
    var strings = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Matcher);

    this.strings = strings;
  }

  _createClass(Matcher, [{
    key: "matches",
    value: function matches(query) {
      var _this = this;

      query = query.toLowerCase();
      var qlen = query.length;

      // Match on any string
      var match = false;

      Object.keys(this.strings).some(function (type) {
        var str = _this.strings[type].toLowerCase();
        var j = 0;
        var len = str.length;

        // a previous string matched, so exit
        if (match) return true;

        var matchLocations = [];
        for (var i = 0; i < len && !match; i++) {
          if (str.charAt(i) == query[j]) {
            matchLocations.push(i);
            j++;
          }
          match = j == qlen;
        }

        if (match) {
          _this.details = {};
          _this.details[type] = matchLocations;
        }

        // when true will break out of some() loop
        return match;
      });

      return match;
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
    key: 'trigger',

    // If we have a url, open it up. Otherwise, treat as a dir and open
    // it up (showing children of the node)
    value: function trigger() {
      var sel = this.list.selected();

      if (sel.data('url')) {
        chrome.tabs.create({ url: sel.data('url') });
      } else if (sel.data('id')) {
        chrome.runtime.sendMessage({
          type: 'getChildren',
          id: sel.data('id')
        });
      }
    }
  }, {
    key: 'moveUp',
    value: function moveUp() {
      var sel = this.list.selected();
      var prev = this.list.previous(sel);

      if (prev && sel != prev) {
        this.list.unselect(sel);
        this.list.select(prev);
      }
    }
  }, {
    key: 'moveDown',
    value: function moveDown() {
      var sel = this.list.selected();
      var next = this.list.next(sel);

      if (next && sel != next) {
        this.list.unselect(sel);
        this.list.select(next);
      }
    }
  }, {
    key: 'moveForward',
    value: function moveForward() {
      console.log('move forward');
    }
  }, {
    key: 'moveBack',
    value: function moveBack() {
      console.log('move back');
    }
  }, {
    key: 'cancel',
    value: function cancel() {
      console.log('cancel');
    }
  }]);

  return Meta;
})();

;

module.exports = Meta;

},{"./results_dom":7}],7:[function(require,module,exports){
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
    key: 'first',
    value: function first() {
      var f = this.container.getElementsByTagName('li')[0];
      return this.domElOrNull(f);
    }
  }, {
    key: 'last',
    value: (function (_last) {
      function last() {
        return _last.apply(this, arguments);
      }

      last.toString = function () {
        return _last.toString();
      };

      return last;
    })(function () {
      var list = this.container.getElementsByTagName('li');
      var last = list[list.length - 1];
      return this.domElOrNull(last);
    })
  }, {
    key: 'selected',
    value: function selected() {
      var sel = this.container.getElementsByClassName('selected')[0];
      return this.domElOrNull(sel);
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
      var items = this.container.getElementsByTagName('li');
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
      var items = this.container.getElementsByTagName('li');
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
      var items = this.container.getElementsByTagName('li');
      for (var i = 0; i < items.length; i++) {
        bound(new _DOMElement2['default'](items[i]), args, i);
      }
    }
  }, {
    key: 'indexOf',
    value: function indexOf(domEl) {
      var items = this.container.getElementsByTagName('li');
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

},{"./dom_element":2}],8:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _Matcher = require('./matcher');

var _Matcher2 = _interopRequireWildcard(_Matcher);

var Updater = (function () {
  function Updater(inputEl, resultsEl) {
    var _this = this;

    _classCallCheck(this, Updater);

    this.inputEl = inputEl;
    this.resultsEl = resultsEl;
    this.matcherMap = {};

    // this.lastQuery = null;

    var self = this;
    chrome.bookmarks.getTree(function (items) {
      _this.matcherMap[''] = items[0].children;
      self.bookmarks = _this.matcherMap[''];
      self.render();
    });
  }

  _createClass(Updater, [{
    key: 'getChildren',
    value: function getChildren(id) {
      var _this2 = this;

      var key = 'id-' + id;

      if (this.matcherMap[key]) {
        this.bookmarks = this.matcherMap[key];
        this.render();
      } else {
        (function () {
          var self = _this2;
          chrome.bookmarks.getChildren(id, function (items) {
            self.matcherMap[key] = items;
            self.bookmarks = items;
            self.render();
          });
        })();
      }
    }
  }, {
    key: 'search',
    value: function search(q) {
      var _this3 = this;

      var self = this;

      console.log('search: ' + q);

      // if ( this.lastQuery == q ) return;
      // this.lastQuery = q;

      if (this.inputEl.value.length == 0) {
        // we just cleared the query so reset usign the baseResults (go
        // into browse mode)
        this.bookmarks = this.matcherMap[''];
        self.render();
      } else if (this.matcherMap[q]) {
        self.bookmarks = this.matcherMap[q];
        self.render();
      } else if (this.bookmarks == this.matcherMap['']) {
        (function () {
          var self = _this3;
          chrome.bookmarks.search(q, function (items) {
            self.matcherMap[q] = items;
            self.bookmarks = items;
            self.render();
          });
        })();
      } else {
        var filtered = this.bookmarks.filter(function (obj) {
          // Only include (actionable) bookmarks (with a url)
          if (!obj.url) return false;

          if (!obj.matcher) {
            obj.matcher = new _Matcher2['default']({ title: obj.title, url: obj.url });
          }
          return obj.matcher.matches(q);
        });

        self.matcherMap[q] = filtered;
        this.bookmarks = filtered;
        self.render();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var filtered = this.filterForRender();
      var content = Findr.templates.results({ bookmarks: filtered });
      this.resultsEl.innerHTML = content;
    }
  }, {
    key: 'filterForRender',
    value: function filterForRender() {
      return this.bookmarks.filter(function (obj) {
        // let hasChildren = obj['children'] && obj.children.length > 0;
        // debugger
        return !!(obj.id || obj.url);
      });
    }
  }]);

  return Updater;
})();

module.exports = Updater;

},{"./matcher":5}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvd2Vic2l0ZXMvY2hyb21lX2V4dGVuc2lvbnMvZmluZHIvc3JjL2pzL3BvcHVwLmpzIiwiL3dlYnNpdGVzL2Nocm9tZV9leHRlbnNpb25zL2ZpbmRyL3NyYy9qcy9kb21fZWxlbWVudC5qcyIsIi93ZWJzaXRlcy9jaHJvbWVfZXh0ZW5zaW9ucy9maW5kci9zcmMvanMva2V5Ym9hcmQuanMiLCIvd2Vic2l0ZXMvY2hyb21lX2V4dGVuc2lvbnMvZmluZHIvc3JjL2pzL2tleWNvZGVzLmpzIiwiL3dlYnNpdGVzL2Nocm9tZV9leHRlbnNpb25zL2ZpbmRyL3NyYy9qcy9tYXRjaGVyLmpzIiwiL3dlYnNpdGVzL2Nocm9tZV9leHRlbnNpb25zL2ZpbmRyL3NyYy9qcy9tZXRhLmpzIiwiL3dlYnNpdGVzL2Nocm9tZV9leHRlbnNpb25zL2ZpbmRyL3NyYy9qcy9yZXN1bHRzX2RvbS5qcyIsIi93ZWJzaXRlcy9jaHJvbWVfZXh0ZW5zaW9ucy9maW5kci9zcmMvanMvdXBkYXRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLFlBQVksQ0FBQzs7OztvQkFFSSxRQUFROzs7O3dCQUNKLFlBQVk7Ozs7dUJBQ2IsV0FBVzs7OztBQUUvQixDQUFDLFlBQU07O0FBRUwsTUFBSSxRQUFRLEdBQUcsMkJBQWMsQ0FBQztBQUM5QixNQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdDLFVBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7OztBQUd2QixNQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2pELE1BQUksT0FBTyxHQUFHLHlCQUFZLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQzs7O0FBRzFDLE1BQUksSUFBSSxHQUFHLHNCQUFTLE9B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Q0FBQyxDQUFDO0tBQ0o7OztTQXZGRyxPQUFPOzs7QUEwRmIsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgTWV0YSBmcm9tICcuL21ldGEnO1xuaW1wb3J0IEtleWJvYXJkIGZyb20gJy4va2V5Ym9hcmQnO1xuaW1wb3J0IFVwZGF0ZXIgZnJvbSAnLi91cGRhdGVyJztcblxuKCgpID0+IHtcbiAgLy8gU2V0IHVwIHRoZSBrZXlib2FyZCB0byBsaXN0ZW4gZm9yIGtleSBwcmVzc2VzIGFuZCBpbnRlcnByZXQgdGhlaXIga2V5Y29kZXNcbiAgdmFyIGtleWJvYXJkID0gbmV3IEtleWJvYXJkKCk7XG4gIHZhciBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnB1dCcpO1xuICBrZXlib2FyZC5saXN0ZW4oaW5wdXQpO1xuXG4gIC8vIEhhbmRsZSBhbnkgbGlzdCB1cGRhdGVzIHRoYXQgYXJlIG5lZWRlZFxuICB2YXIgcmVzdWx0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN1bHRzJyk7XG4gIHZhciB1cGRhdGVyID0gbmV3IFVwZGF0ZXIoaW5wdXQsIHJlc3VsdHMpO1xuXG4gIC8vIFJlc3BvbnNpYmxlIGZvciBzZWxlY3Rpb24gbW92ZW1lbnQsIGFjdGlvbiBjYW5jZWxsYXRpb25zLCBldGNcbiAgdmFyIG1ldGEgPSBuZXcgTWV0YShyZXN1bHRzKTtcblxuICBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoZnVuY3Rpb24obWVzc2FnZSwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpIHtcbiAgICBjb25zb2xlLmxvZygnb25NZXNzYWdlJywgbWVzc2FnZSk7XG4gICAgc3dpdGNoICggbWVzc2FnZS50eXBlICkge1xuICAgICAgY2FzZSAnZ2V0Q2hpbGRyZW4nOlxuICAgICAgICB1cGRhdGVyLmdldENoaWxkcmVuKG1lc3NhZ2UuaWQpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAndXBkYXRlJzpcbiAgICAgICAgdmFyIHF1ZXJ5ID0gaW5wdXQudmFsdWVcbiAgICAgICAgdXBkYXRlci5zZWFyY2gocXVlcnkpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnbWV0YSc6XG4gICAgICAgIG1ldGEucGVyZm9ybShtZXNzYWdlLmFjdGlvbik7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBjb25zb2xlLmxvZygndW5oYW5kbGVkIG1lc3NhZ2UnLCBtZXNzYWdlLCBzZW5kZXIpO1xuICAgIH1cbiAgfSk7XG59KSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBET01FbGVtZW50IHtcbiAgc3RhdGljIGZvcihlbCkge1xuICAgIHJldHVybiBuZXcgRE9NRWxlbWVudChlbCk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihlbCkge1xuICAgIHRoaXMuZWwgPSBlbDtcbiAgfVxuXG4gIGFkZENsYXNzKGtsYXNzKSB7XG4gICAgaWYgKCB0aGlzLmhhc0NsYXNzKGtsYXNzKSApIHJldHVybjtcbiAgICB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoa2xhc3MpO1xuICB9XG5cbiAgaGFzQ2xhc3Moa2xhc3MpIHtcbiAgICByZXR1cm4gdGhpcy5lbC5jbGFzc0xpc3QuY29udGFpbnMoa2xhc3MpO1xuICB9XG5cbiAgcmVtb3ZlQ2xhc3Moa2xhc3MpIHtcbiAgICB0aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUoa2xhc3MpO1xuICB9XG5cbiAgbWF0Y2goZG9tRWwpIHtcbiAgICByZXR1cm4gdGhpcy5lbCA9PSBkb21FbC5lbDtcbiAgfVxuXG4gIGRhdGEoa2V5KSB7XG4gICAgcmV0dXJuIHRoaXMuZWwuZ2V0QXR0cmlidXRlKGBkYXRhLSR7a2V5fWApO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRE9NRWxlbWVudDtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IEtleWNvZGVzIGZyb20gJy4va2V5Y29kZXMnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEtleWJvYXJkIHtcbiAgbGlzdGVuKGVsKSB7XG4gICAgZWwub25rZXlkb3duID0gS2V5Y29kZXMub25rZXlkb3duO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBLZXljb2RlcyB7XG4gIHN0YXRpYyBvbmtleWRvd24oZSkge1xuICAgIC8vIEFzc3VtZSB0aGUgYWN0aW9uIGlzIGFuIHVwZGF0ZS4gQW55IG90aGVyIHR5cGUgb2YgYWN0aW9uIG11c3QgYmVcbiAgICAvLyBoYW5kbGVkIGZvciBoZXJlLlxuICAgIHZhciBtZXNzYWdlID0ge1xuICAgICAga2V5Y29kZTogZS5rZXlDb2RlLFxuICAgICAgdHlwZTogJ3VwZGF0ZScsXG4gICAgICBhY3Rpb246IG51bGxcbiAgICB9O1xuXG4gICAgc3dpdGNoICggZS5rZXlDb2RlICkge1xuICAgICAgY2FzZSAxMzogLy8gZW50ZXJcbiAgICAgICAgbWVzc2FnZS50eXBlID0gJ21ldGEnO1xuICAgICAgICBtZXNzYWdlLmFjdGlvbiA9ICd0cmlnZ2VyJztcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgMTc6IC8vIGN0cmxcbiAgICAgIGNhc2UgOTM6IC8vIGNtZFxuICAgICAgICBtZXNzYWdlLnR5cGUgPSAnbm9vcCc7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIDM3OiAvLyBsZWZ0IGFycm93XG4gICAgICAgIG1lc3NhZ2UudHlwZSA9ICdtZXRhJztcbiAgICAgICAgbWVzc2FnZS5hY3Rpb24gPSAnbW92ZUJhY2snO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAzODogLy8gdXAgYXJyb3dcbiAgICAgICAgbWVzc2FnZS50eXBlID0gJ21ldGEnO1xuICAgICAgICBtZXNzYWdlLmFjdGlvbiA9ICdtb3ZlVXAnO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAzOTogLy8gcmlnaHQgYXJyb3dcbiAgICAgICAgbWVzc2FnZS50eXBlID0gJ21ldGEnO1xuICAgICAgICBtZXNzYWdlLmFjdGlvbiA9ICdtb3ZlRm9yd2FyZCc7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIDQwOiAvLyBkb3duIGFycm93XG4gICAgICAgIG1lc3NhZ2UudHlwZSA9ICdtZXRhJztcbiAgICAgICAgbWVzc2FnZS5hY3Rpb24gPSAnbW92ZURvd24nO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSA2NjogLy8gYlxuICAgICAgICBpZiAoIGUuY3RybEtleSApIHtcbiAgICAgICAgICBtZXNzYWdlLnR5cGUgPSAnbWV0YSc7XG4gICAgICAgICAgbWVzc2FnZS5hY3Rpb24gPSAnbW92ZUJhY2snO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgIGNhc2UgNzA6IC8vIGZcbiAgICAgICAgaWYgKCBlLmN0cmxLZXkgKSB7XG4gICAgICAgICAgbWVzc2FnZS50eXBlID0gJ21ldGEnO1xuICAgICAgICAgIG1lc3NhZ2UuYWN0aW9uID0gJ21vdmVGb3J3YXJkJztcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSA3MTogLy8gZ1xuICAgICAgICBpZiAoIGUuY3RybEtleSApIHtcbiAgICAgICAgICBtZXNzYWdlLnR5cGUgPSAnbWV0YSc7XG4gICAgICAgICAgbWVzc2FnZS5hY3Rpb24gPSAnY2FuY2VsJztcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSA3ODogLy8gblxuICAgICAgICBpZiAoIGUuY3RybEtleSApIHtcbiAgICAgICAgICBtZXNzYWdlLnR5cGUgPSAnbWV0YSc7XG4gICAgICAgICAgbWVzc2FnZS5hY3Rpb24gPSAnbW92ZURvd24nO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIDgwOiAvLyBwXG4gICAgICAgIGlmICggZS5jdHJsS2V5ICkge1xuICAgICAgICAgIG1lc3NhZ2UudHlwZSA9ICdtZXRhJztcbiAgICAgICAgICBtZXNzYWdlLmFjdGlvbiA9ICdtb3ZlVXAnO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgY29uc29sZS5sb2coZS5rZXlDb2RlKTtcbiAgICB9O1xuXG4gICAgLy8gRW1pdCBtZXNzYWdlIHNvIHRoZSBwcm9wZXIgYWN0aW9uIGNhbiBiZSB0YWtlblxuICAgIGlmICggbWVzc2FnZS50eXBlICE9ICdub29wJyApIHtcbiAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKG1lc3NhZ2UpIFxuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBLZXljb2RlcztcbiIsImNsYXNzIE1hdGNoZXIge1xuICBjb25zdHJ1Y3RvciAoc3RyaW5ncz17fSkge1xuICAgIHRoaXMuc3RyaW5ncyA9IHN0cmluZ3M7XG4gIH1cblxuICBtYXRjaGVzKHF1ZXJ5KSB7XG4gICAgcXVlcnkgPSBxdWVyeS50b0xvd2VyQ2FzZSgpO1xuICAgIGxldCBxbGVuID0gcXVlcnkubGVuZ3RoO1xuXG4gICAgLy8gTWF0Y2ggb24gYW55IHN0cmluZ1xuICAgIGxldCBtYXRjaCA9IGZhbHNlO1xuXG4gICAgT2JqZWN0LmtleXModGhpcy5zdHJpbmdzKS5zb21lKCh0eXBlKSA9PiB7XG4gICAgICBsZXQgc3RyID0gdGhpcy5zdHJpbmdzW3R5cGVdLnRvTG93ZXJDYXNlKCk7XG4gICAgICBsZXQgaiA9IDA7XG4gICAgICBsZXQgbGVuID0gc3RyLmxlbmd0aDtcblxuICAgICAgLy8gYSBwcmV2aW91cyBzdHJpbmcgbWF0Y2hlZCwgc28gZXhpdFxuICAgICAgaWYgKCBtYXRjaCApIHJldHVybiB0cnVlO1xuXG4gICAgICBsZXQgbWF0Y2hMb2NhdGlvbnMgPSBbXTtcbiAgICAgIGZvciAoIGxldCBpID0gMDsgaSA8IGxlbiAmJiAhbWF0Y2g7IGkrKykge1xuICAgICAgICBpZiAoIHN0ci5jaGFyQXQoaSkgPT0gcXVlcnlbal0gKSB7XG4gICAgICAgICAgbWF0Y2hMb2NhdGlvbnMucHVzaChpKTtcbiAgICAgICAgICBqKys7XG4gICAgICAgIH1cbiAgICAgICAgbWF0Y2ggPSAoIGogPT0gcWxlbiApO1xuICAgICAgfVxuXG4gICAgICBpZiAoIG1hdGNoICkge1xuICAgICAgICB0aGlzLmRldGFpbHMgPSB7fTtcbiAgICAgICAgdGhpcy5kZXRhaWxzW3R5cGVdID0gbWF0Y2hMb2NhdGlvbnM7XG4gICAgICB9XG5cbiAgICAgIC8vIHdoZW4gdHJ1ZSB3aWxsIGJyZWFrIG91dCBvZiBzb21lKCkgbG9vcFxuICAgICAgcmV0dXJuIG1hdGNoO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG1hdGNoO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWF0Y2hlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IFJlc3VsdHNET00gZnJvbSAnLi9yZXN1bHRzX2RvbSc7XG5cbmNsYXNzIE1ldGEge1xuICBjb25zdHJ1Y3RvcihsaXN0KSB7XG4gICAgdGhpcy5saXN0ID0gbmV3IFJlc3VsdHNET00obGlzdCk7XG4gIH1cblxuICBwZXJmb3JtKGFjdGlvbikge1xuICAgIGNvbnNvbGUubG9nKGBwZXJmb3JtOiAke2FjdGlvbn1gKTtcbiAgICB0aGlzW2FjdGlvbl0oKTtcbiAgfVxuXG4gIC8vIElmIHdlIGhhdmUgYSB1cmwsIG9wZW4gaXQgdXAuIE90aGVyd2lzZSwgdHJlYXQgYXMgYSBkaXIgYW5kIG9wZW5cbiAgLy8gaXQgdXAgKHNob3dpbmcgY2hpbGRyZW4gb2YgdGhlIG5vZGUpXG4gIHRyaWdnZXIoKSB7XG4gICAgbGV0IHNlbCA9IHRoaXMubGlzdC5zZWxlY3RlZCgpO1xuXG4gICAgaWYgKCBzZWwuZGF0YSgndXJsJykgKSB7XG4gICAgICBjaHJvbWUudGFicy5jcmVhdGUoeyB1cmw6IHNlbC5kYXRhKCd1cmwnKSB9KTtcblxuICAgIH0gZWxzZSBpZiAoIHNlbC5kYXRhKCdpZCcpICkge1xuICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1xuICAgICAgICB0eXBlOiAnZ2V0Q2hpbGRyZW4nLFxuICAgICAgICBpZDogc2VsLmRhdGEoJ2lkJylcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG1vdmVVcCgpIHtcbiAgICB2YXIgc2VsID0gdGhpcy5saXN0LnNlbGVjdGVkKCk7XG4gICAgdmFyIHByZXYgPSB0aGlzLmxpc3QucHJldmlvdXMoc2VsKTtcblxuICAgIGlmICggcHJldiAmJiBzZWwgIT0gcHJldiApIHtcbiAgICAgIHRoaXMubGlzdC51bnNlbGVjdChzZWwpO1xuICAgICAgdGhpcy5saXN0LnNlbGVjdChwcmV2KTtcbiAgICB9XG4gIH1cblxuICBtb3ZlRG93bigpIHtcbiAgICB2YXIgc2VsID0gdGhpcy5saXN0LnNlbGVjdGVkKCk7XG4gICAgdmFyIG5leHQgPSB0aGlzLmxpc3QubmV4dChzZWwpO1xuXG4gICAgaWYgKCBuZXh0ICYmIHNlbCAhPSBuZXh0ICkge1xuICAgICAgdGhpcy5saXN0LnVuc2VsZWN0KHNlbCk7XG4gICAgICB0aGlzLmxpc3Quc2VsZWN0KG5leHQpO1xuICAgIH1cbiAgfVxuXG4gIG1vdmVGb3J3YXJkKCkge1xuICAgIGNvbnNvbGUubG9nKCdtb3ZlIGZvcndhcmQnKTtcbiAgfVxuXG4gIG1vdmVCYWNrKCkge1xuICAgIGNvbnNvbGUubG9nKCdtb3ZlIGJhY2snKTtcbiAgfVxuXG4gIGNhbmNlbCgpIHtcbiAgICBjb25zb2xlLmxvZygnY2FuY2VsJyk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTWV0YTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IERPTUVsZW1lbnQgZnJvbSAnLi9kb21fZWxlbWVudCc7XG5cbmNsYXNzIFJlc3VsdHNET00ge1xuICBjb25zdHJ1Y3Rvcihjb250YWluZXIpIHtcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgfVxuXG4gIGZpcnN0KCkge1xuICAgIGxldCBmID0gdGhpcy5jb250YWluZXIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2xpJylbMF07XG4gICAgcmV0dXJuIHRoaXMuZG9tRWxPck51bGwoZik7XG4gIH1cblxuICBsYXN0KCkge1xuICAgIGxldCBsaXN0ID0gdGhpcy5jb250YWluZXIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2xpJyk7XG4gICAgbGV0IGxhc3QgPSBsaXN0W2xpc3QubGVuZ3RoIC0gMV07XG4gICAgcmV0dXJuIHRoaXMuZG9tRWxPck51bGwobGFzdCk7XG4gIH1cblxuICBzZWxlY3RlZCgpIHtcbiAgICBsZXQgc2VsID0gdGhpcy5jb250YWluZXIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc2VsZWN0ZWQnKVswXTtcbiAgICByZXR1cm4gdGhpcy5kb21FbE9yTnVsbChzZWwpO1xuICB9XG5cbiAgLy8gR2V0IHRoZSBuZXh0IGVsZW1lbnQgaW4gdGhlIGxpc3QgcmVsYXRpdmUgdG8gdGhlIHByb3ZpZGVkIGRvbUVsXG4gIG5leHQoZG9tRWwpIHtcbiAgICBpZiAoICFkb21FbCApIHJldHVybiB0aGlzLmZpcnN0KCk7XG5cbiAgICBsZXQgaW5kZXggPSB0aGlzLmluZGV4T2YoZG9tRWwpO1xuICAgIGxldCBpdGVtcyA9IHRoaXMuY29udGFpbmVyLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdsaScpOyBcbiAgICBsZXQgbmV4dCA9IGl0ZW1zW2luZGV4ICsgMV07XG4gICAgaWYgKCAhbmV4dCApIG5leHQgPSB0aGlzLmxhc3QoKTtcbiAgICByZXR1cm4gdGhpcy5kb21FbE9yTnVsbChuZXh0KTtcbiAgfVxuXG4gIHByZXZpb3VzKGRvbUVsKSB7XG4gICAgaWYgKCAhZG9tRWwgKSByZXR1cm4gbnVsbDtcblxuICAgIGxldCBpbmRleCA9IHRoaXMuaW5kZXhPZihkb21FbCk7XG4gICAgbGV0IGl0ZW1zID0gdGhpcy5jb250YWluZXIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2xpJyk7IFxuICAgIGxldCBwcmV2ID0gaXRlbXNbaW5kZXggLSAxXTtcbiAgICByZXR1cm4gdGhpcy5kb21FbE9yTnVsbChwcmV2KTtcbiAgfVxuXG4gIGRvbUVsT3JOdWxsKGVsKSB7XG4gICAgaWYgKCAhZWwgKSByZXR1cm4gbnVsbDtcbiAgICAvLyBlbCBpcyBhbHJlYWR5IGEgRE9NRUxlbWVudFxuICAgIGlmICggISEodHlwZW9mIGVsID09ICdvYmplY3QnICYmIGVsWydlbCddKSApIHJldHVybiBlbDtcbiAgICByZXR1cm4gbmV3IERPTUVsZW1lbnQoZWwpO1xuICB9XG5cbiAgLy8gQWRkICdzZWxlY3RlZCcgY2xhc3MgdG8gdGhlIHByb3ZpZGVkIGRvbUVsXG4gIHNlbGVjdChkb21FbCkge1xuICAgIGlmICggIWRvbUVsICkgZG9tRWwgPSB0aGlzLmxhc3QoKTtcbiAgICBkb21FbC5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcbiAgfVxuXG4gIC8vIFJlbW92ZSAnc2VsZWN0ZWQnIGNsYXNzIGZyb20gdGhlIHByb3ZpZGVkIGRvbUVsXG4gIHVuc2VsZWN0KGRvbUVsKSB7XG4gICAgaWYgKCAhZG9tRWwgKSByZXR1cm47XG4gICAgZG9tRWwucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gIH1cblxuICB1bnNlbGVjdEFsbCgpIHtcbiAgICB0aGlzLmVhY2goKGRvbUVsKSA9PiB7IHRoaXMudW5zZWxlY3QoZG9tRWwpIH0pO1xuICB9XG5cbiAgZWFjaChmbiwgYXJncz17fSkge1xuICAgIGxldCBib3VuZCA9IGZuLmJpbmQodGhpcyk7XG4gICAgbGV0IGl0ZW1zID0gdGhpcy5jb250YWluZXIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2xpJyk7XG4gICAgZm9yICggbGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKysgKSB7XG4gICAgICBib3VuZChuZXcgRE9NRWxlbWVudChpdGVtc1tpXSksIGFyZ3MsIGkpO1xuICAgIH1cbiAgfVxuXG4gIGluZGV4T2YoZG9tRWwpIHtcbiAgICBsZXQgaXRlbXMgPSB0aGlzLmNvbnRhaW5lci5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGknKTtcbiAgICBsZXQgaW5kZXg7XG4gICAgZm9yICggbGV0IGkgPSAwOyAhaW5kZXggJiYgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrICkge1xuICAgICAgaWYgKCBkb21FbC5lbCA9PSBpdGVtc1tpXSApIGluZGV4ID0gaTtcbiAgICB9XG4gICAgcmV0dXJuIGluZGV4O1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVzdWx0c0RPTTtcbiIsImltcG9ydCBNYXRjaGVyIGZyb20gJy4vbWF0Y2hlcic7XG5cbmNsYXNzIFVwZGF0ZXIge1xuICBjb25zdHJ1Y3RvcihpbnB1dEVsLCByZXN1bHRzRWwpIHtcbiAgICB0aGlzLmlucHV0RWwgPSBpbnB1dEVsO1xuICAgIHRoaXMucmVzdWx0c0VsID0gcmVzdWx0c0VsO1xuICAgIHRoaXMubWF0Y2hlck1hcCA9IHt9O1xuXG4gICAgLy8gdGhpcy5sYXN0UXVlcnkgPSBudWxsO1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGNocm9tZS5ib29rbWFya3MuZ2V0VHJlZSgoaXRlbXMpID0+IHtcbiAgICAgIHRoaXMubWF0Y2hlck1hcFsnJ10gPSBpdGVtc1swXS5jaGlsZHJlbjtcbiAgICAgIHNlbGYuYm9va21hcmtzID0gdGhpcy5tYXRjaGVyTWFwWycnXTtcbiAgICAgIHNlbGYucmVuZGVyKCk7XG4gICAgfSk7XG4gIH1cblxuICBnZXRDaGlsZHJlbihpZCkge1xuICAgIGxldCBrZXkgPSBgaWQtJHtpZH1gO1xuXG4gICAgaWYgKCB0aGlzLm1hdGNoZXJNYXBba2V5XSApIHtcbiAgICAgIHRoaXMuYm9va21hcmtzID0gdGhpcy5tYXRjaGVyTWFwW2tleV07XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICBjaHJvbWUuYm9va21hcmtzLmdldENoaWxkcmVuKGlkLCAoaXRlbXMpID0+IHtcbiAgICAgICAgc2VsZi5tYXRjaGVyTWFwW2tleV0gPSBpdGVtcztcbiAgICAgICAgc2VsZi5ib29rbWFya3MgPSBpdGVtcztcbiAgICAgICAgc2VsZi5yZW5kZXIoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHNlYXJjaChxKSB7XG4gICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgY29uc29sZS5sb2coYHNlYXJjaDogJHtxfWApO1xuXG4gICAgLy8gaWYgKCB0aGlzLmxhc3RRdWVyeSA9PSBxICkgcmV0dXJuO1xuICAgIC8vIHRoaXMubGFzdFF1ZXJ5ID0gcTtcblxuICAgIGlmICggdGhpcy5pbnB1dEVsLnZhbHVlLmxlbmd0aCA9PSAwICkge1xuICAgICAgLy8gd2UganVzdCBjbGVhcmVkIHRoZSBxdWVyeSBzbyByZXNldCB1c2lnbiB0aGUgYmFzZVJlc3VsdHMgKGdvXG4gICAgICAvLyBpbnRvIGJyb3dzZSBtb2RlKVxuICAgICAgdGhpcy5ib29rbWFya3MgPSB0aGlzLm1hdGNoZXJNYXBbJyddO1xuICAgICAgc2VsZi5yZW5kZXIoKTtcblxuICAgIH0gZWxzZSBpZiAoIHRoaXMubWF0Y2hlck1hcFtxXSApIHtcbiAgICAgIHNlbGYuYm9va21hcmtzID0gdGhpcy5tYXRjaGVyTWFwW3FdO1xuICAgICAgc2VsZi5yZW5kZXIoKTtcblxuICAgIH0gZWxzZSBpZiAoIHRoaXMuYm9va21hcmtzID09IHRoaXMubWF0Y2hlck1hcFsnJ10gKSB7XG4gICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICBjaHJvbWUuYm9va21hcmtzLnNlYXJjaChxLCBmdW5jdGlvbiAoaXRlbXMpIHtcbiAgICAgICAgc2VsZi5tYXRjaGVyTWFwW3FdID0gaXRlbXM7XG4gICAgICAgIHNlbGYuYm9va21hcmtzID0gaXRlbXM7XG4gICAgICAgIHNlbGYucmVuZGVyKCk7XG4gICAgICB9KTtcblxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgZmlsdGVyZWQgPSB0aGlzLmJvb2ttYXJrcy5maWx0ZXIoZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgIC8vIE9ubHkgaW5jbHVkZSAoYWN0aW9uYWJsZSkgYm9va21hcmtzICh3aXRoIGEgdXJsKVxuICAgICAgICBpZiAoICFvYmoudXJsICkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGlmICggIW9iai5tYXRjaGVyICkge1xuICAgICAgICAgIG9iai5tYXRjaGVyID0gbmV3IE1hdGNoZXIoe3RpdGxlOiBvYmoudGl0bGUsIHVybDogb2JqLnVybH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvYmoubWF0Y2hlci5tYXRjaGVzKHEpO1xuICAgICAgfSk7XG5cbiAgICAgIHNlbGYubWF0Y2hlck1hcFtxXSA9IGZpbHRlcmVkO1xuICAgICAgdGhpcy5ib29rbWFya3MgPSBmaWx0ZXJlZDtcbiAgICAgIHNlbGYucmVuZGVyKCk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCBmaWx0ZXJlZCA9IHRoaXMuZmlsdGVyRm9yUmVuZGVyKCk7XG4gICAgbGV0IGNvbnRlbnQgPSBGaW5kci50ZW1wbGF0ZXMucmVzdWx0cyh7Ym9va21hcmtzOiBmaWx0ZXJlZH0pO1xuICAgIHRoaXMucmVzdWx0c0VsLmlubmVySFRNTCA9IGNvbnRlbnQ7XG4gIH1cblxuICBmaWx0ZXJGb3JSZW5kZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuYm9va21hcmtzLmZpbHRlcigob2JqKSA9PiB7XG4gICAgICAvLyBsZXQgaGFzQ2hpbGRyZW4gPSBvYmpbJ2NoaWxkcmVuJ10gJiYgb2JqLmNoaWxkcmVuLmxlbmd0aCA+IDA7XG4gICAgICAvLyBkZWJ1Z2dlclxuICAgICAgcmV0dXJuICEhKG9iai5pZCB8fCBvYmoudXJsKTtcbiAgICB9KTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFVwZGF0ZXIgO1xuIl19
