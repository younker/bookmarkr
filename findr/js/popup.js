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
    switch (message.type) {
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
      };

      console.log('keycodes', message);

      // Emit message so the proper action can be taken
      chrome.runtime.sendMessage(message);
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
    // this.strings = strings.map((str) => { return str.toLowerCase() });
  }

  _createClass(Matcher, [{
    key: "matches",
    value: function matches(query) {
      var _this = this;

      query = query.toLowerCase();
      var qlen = query.length;

      // Match on any string
      var match = false;

      // location that each match occurred
      // this.details[query] = {};

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

      console.log("Match Found? " + match, this);
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
      this[action]();
    }
  }, {
    key: 'trigger',
    value: function trigger() {
      var sel = this.list.selected();
      chrome.tabs.create({ url: sel.data('url') });
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

    this.lastQuery = null;

    var self = this;
    chrome.bookmarks.getTree(function (items) {
      _this.matcherMap[''] = items[0].children;
      self.bookmarks = _this.matcherMap[''];
      self.render();
    });
  }

  _createClass(Updater, [{
    key: 'search',
    value: function search(q) {
      var _this2 = this;

      var self = this;

      // debugger

      if (this.lastQuery == q) {
        return;
      }this.lastQuery = q;

      console.log('new query', this.lastQuery, q);

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
          console.log('Perform initial search: ' + q);
          var self = _this2;
          chrome.bookmarks.search(q, function (items) {
            self.matcherMap[q] = items;
            self.bookmarks = items;
            self.render();
          });
        })();
      } else {
        console.log('filter these results', this.bookmarks);
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
        var hasChildren = obj.children && obj.children.length > 0;
        return hasChildren || obj.url;
      });
    }
  }]);

  return Updater;
})();

module.exports = Updater;

},{"./matcher":5}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvd2Vic2l0ZXMvY2hyb21lX2V4dGVuc2lvbnMvZmluZHIvc3JjL2pzL3BvcHVwLmpzIiwiL3dlYnNpdGVzL2Nocm9tZV9leHRlbnNpb25zL2ZpbmRyL3NyYy9qcy9kb21fZWxlbWVudC5qcyIsIi93ZWJzaXRlcy9jaHJvbWVfZXh0ZW5zaW9ucy9maW5kci9zcmMvanMva2V5Ym9hcmQuanMiLCIvd2Vic2l0ZXMvY2hyb21lX2V4dGVuc2lvbnMvZmluZHIvc3JjL2pzL2tleWNvZGVzLmpzIiwiL3dlYnNpdGVzL2Nocm9tZV9leHRlbnNpb25zL2ZpbmRyL3NyYy9qcy9tYXRjaGVyLmpzIiwiL3dlYnNpdGVzL2Nocm9tZV9leHRlbnNpb25zL2ZpbmRyL3NyYy9qcy9tZXRhLmpzIiwiL3dlYnNpdGVzL2Nocm9tZV9leHRlbnNpb25zL2ZpbmRyL3NyYy9qcy9yZXN1bHRzX2RvbS5qcyIsIi93ZWJzaXRlcy9jaHJvbWVfZXh0ZW5zaW9ucy9maW5kci9zcmMvanMvdXBkYXRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLFlBQVksQ0FBQzs7OztvQkFFSSxRQUFROzs7O3dCQUNKLFlBQVk7Ozs7dUJBQ2IsV0FBVzs7OztBQUUvQixDQUFDLFlBQU07O0FBRUwsTUFBSSxRQUFRLEdBQUcsMkJBQWMsQ0FBQztBQUM5QixNQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdDLFVBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7OztBQUd2QixNQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2pELE1BQUksT0FBTyxHQUFHLHlCQUFZLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQzs7O0FBRzFDLE1BQUksSUFBSSxHQUFHLHNCQUFTLE9B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QyxFQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDO0FBQzdELFVBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztLQUNwQzs7O1dBRWMsMkJBQUc7QUFDaEIsYUFBTyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFDLEdBQUcsRUFBSztBQUNwQyxZQUFJLFdBQVcsR0FBRyxHQUFHLFNBQVksSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDN0QsZUFBTyxXQUFXLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQztPQUMvQixDQUFDLENBQUM7S0FDSjs7O1NBMUVHLE9BQU87OztBQTZFYixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBRSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBNZXRhIGZyb20gJy4vbWV0YSc7XG5pbXBvcnQgS2V5Ym9hcmQgZnJvbSAnLi9rZXlib2FyZCc7XG5pbXBvcnQgVXBkYXRlciBmcm9tICcuL3VwZGF0ZXInO1xuXG4oKCkgPT4ge1xuICAvLyBTZXQgdXAgdGhlIGtleWJvYXJkIHRvIGxpc3RlbiBmb3Iga2V5IHByZXNzZXMgYW5kIGludGVycHJldCB0aGVpciBrZXljb2Rlc1xuICB2YXIga2V5Ym9hcmQgPSBuZXcgS2V5Ym9hcmQoKTtcbiAgdmFyIGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lucHV0Jyk7XG4gIGtleWJvYXJkLmxpc3RlbihpbnB1dCk7XG5cbiAgLy8gSGFuZGxlIGFueSBsaXN0IHVwZGF0ZXMgdGhhdCBhcmUgbmVlZGVkXG4gIHZhciByZXN1bHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3VsdHMnKTtcbiAgdmFyIHVwZGF0ZXIgPSBuZXcgVXBkYXRlcihpbnB1dCwgcmVzdWx0cyk7XG5cbiAgLy8gUmVzcG9uc2libGUgZm9yIHNlbGVjdGlvbiBtb3ZlbWVudCwgYWN0aW9uIGNhbmNlbGxhdGlvbnMsIGV0Y1xuICB2YXIgbWV0YSA9IG5ldyBNZXRhKHJlc3VsdHMpO1xuXG4gIGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihmdW5jdGlvbihtZXNzYWdlLCBzZW5kZXIsIHNlbmRSZXNwb25zZSkge1xuICAgIHN3aXRjaCAoIG1lc3NhZ2UudHlwZSApIHtcbiAgICAgIGNhc2UgJ3VwZGF0ZSc6XG4gICAgICAgIHZhciBxdWVyeSA9IGlucHV0LnZhbHVlXG4gICAgICAgIHVwZGF0ZXIuc2VhcmNoKHF1ZXJ5KTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ21ldGEnOlxuICAgICAgICBtZXRhLnBlcmZvcm0obWVzc2FnZS5hY3Rpb24pO1xuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgY29uc29sZS5sb2coJ3VuaGFuZGxlZCBtZXNzYWdlJywgbWVzc2FnZSwgc2VuZGVyKTtcbiAgICB9XG4gIH0pO1xufSkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY2xhc3MgRE9NRWxlbWVudCB7XG4gIHN0YXRpYyBmb3IoZWwpIHtcbiAgICByZXR1cm4gbmV3IERPTUVsZW1lbnQoZWwpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoZWwpIHtcbiAgICB0aGlzLmVsID0gZWw7XG4gIH1cblxuICBhZGRDbGFzcyhrbGFzcykge1xuICAgIGlmICggdGhpcy5oYXNDbGFzcyhrbGFzcykgKSByZXR1cm47XG4gICAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKGtsYXNzKTtcbiAgfVxuXG4gIGhhc0NsYXNzKGtsYXNzKSB7XG4gICAgcmV0dXJuIHRoaXMuZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGtsYXNzKTtcbiAgfVxuXG4gIHJlbW92ZUNsYXNzKGtsYXNzKSB7XG4gICAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKGtsYXNzKTtcbiAgfVxuXG4gIG1hdGNoKGRvbUVsKSB7XG4gICAgcmV0dXJuIHRoaXMuZWwgPT0gZG9tRWwuZWw7XG4gIH1cblxuICBkYXRhKGtleSkge1xuICAgIHJldHVybiB0aGlzLmVsLmdldEF0dHJpYnV0ZShgZGF0YS0ke2tleX1gKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IERPTUVsZW1lbnQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBLZXljb2RlcyBmcm9tICcuL2tleWNvZGVzJztcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBLZXlib2FyZCB7XG4gIGxpc3RlbihlbCkge1xuICAgIGVsLm9ua2V5ZG93biA9IEtleWNvZGVzLm9ua2V5ZG93bjtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY2xhc3MgS2V5Y29kZXMge1xuICBzdGF0aWMgb25rZXlkb3duKGUpIHtcbiAgICAvLyBBc3N1bWUgdGhlIGFjdGlvbiBpcyBhbiB1cGRhdGUuIEFueSBvdGhlciB0eXBlIG9mIGFjdGlvbiBtdXN0IGJlXG4gICAgLy8gaGFuZGxlZCBmb3IgaGVyZS5cbiAgICB2YXIgbWVzc2FnZSA9IHtcbiAgICAgIGtleWNvZGU6IGUua2V5Q29kZSxcbiAgICAgIHR5cGU6ICd1cGRhdGUnLFxuICAgICAgYWN0aW9uOiBudWxsXG4gICAgfTtcblxuICAgIHN3aXRjaCAoIGUua2V5Q29kZSApIHtcbiAgICAgIGNhc2UgMTM6IC8vIGVudGVyXG4gICAgICAgIG1lc3NhZ2UudHlwZSA9ICdtZXRhJztcbiAgICAgICAgbWVzc2FnZS5hY3Rpb24gPSAndHJpZ2dlcic7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIDM3OiAvLyBsZWZ0IGFycm93XG4gICAgICAgIG1lc3NhZ2UudHlwZSA9ICdtZXRhJztcbiAgICAgICAgbWVzc2FnZS5hY3Rpb24gPSAnbW92ZUJhY2snO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAzODogLy8gdXAgYXJyb3dcbiAgICAgICAgbWVzc2FnZS50eXBlID0gJ21ldGEnO1xuICAgICAgICBtZXNzYWdlLmFjdGlvbiA9ICdtb3ZlVXAnO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAzOTogLy8gcmlnaHQgYXJyb3dcbiAgICAgICAgbWVzc2FnZS50eXBlID0gJ21ldGEnO1xuICAgICAgICBtZXNzYWdlLmFjdGlvbiA9ICdtb3ZlRm9yd2FyZCc7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIDQwOiAvLyBkb3duIGFycm93XG4gICAgICAgIG1lc3NhZ2UudHlwZSA9ICdtZXRhJztcbiAgICAgICAgbWVzc2FnZS5hY3Rpb24gPSAnbW92ZURvd24nO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSA2NjogLy8gYlxuICAgICAgICBpZiAoIGUuY3RybEtleSApIHtcbiAgICAgICAgICBtZXNzYWdlLnR5cGUgPSAnbWV0YSc7XG4gICAgICAgICAgbWVzc2FnZS5hY3Rpb24gPSAnbW92ZUJhY2snO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgIGNhc2UgNzA6IC8vIGZcbiAgICAgICAgaWYgKCBlLmN0cmxLZXkgKSB7XG4gICAgICAgICAgbWVzc2FnZS50eXBlID0gJ21ldGEnO1xuICAgICAgICAgIG1lc3NhZ2UuYWN0aW9uID0gJ21vdmVGb3J3YXJkJztcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSA3MTogLy8gZ1xuICAgICAgICBpZiAoIGUuY3RybEtleSApIHtcbiAgICAgICAgICBtZXNzYWdlLnR5cGUgPSAnbWV0YSc7XG4gICAgICAgICAgbWVzc2FnZS5hY3Rpb24gPSAnY2FuY2VsJztcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSA3ODogLy8gblxuICAgICAgICBpZiAoIGUuY3RybEtleSApIHtcbiAgICAgICAgICBtZXNzYWdlLnR5cGUgPSAnbWV0YSc7XG4gICAgICAgICAgbWVzc2FnZS5hY3Rpb24gPSAnbW92ZURvd24nO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIDgwOiAvLyBwXG4gICAgICAgIGlmICggZS5jdHJsS2V5ICkge1xuICAgICAgICAgIG1lc3NhZ2UudHlwZSA9ICdtZXRhJztcbiAgICAgICAgICBtZXNzYWdlLmFjdGlvbiA9ICdtb3ZlVXAnO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH07XG5cbiAgICBjb25zb2xlLmxvZygna2V5Y29kZXMnLCBtZXNzYWdlKTtcblxuICAgIC8vIEVtaXQgbWVzc2FnZSBzbyB0aGUgcHJvcGVyIGFjdGlvbiBjYW4gYmUgdGFrZW5cbiAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShtZXNzYWdlKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBLZXljb2RlcztcbiIsImNsYXNzIE1hdGNoZXIge1xuICBjb25zdHJ1Y3RvciAoc3RyaW5ncz17fSkge1xuICAgIHRoaXMuc3RyaW5ncyA9IHN0cmluZ3M7XG4gICAgLy8gdGhpcy5zdHJpbmdzID0gc3RyaW5ncy5tYXAoKHN0cikgPT4geyByZXR1cm4gc3RyLnRvTG93ZXJDYXNlKCkgfSk7XG4gIH1cblxuICBtYXRjaGVzKHF1ZXJ5KSB7XG4gICAgcXVlcnkgPSBxdWVyeS50b0xvd2VyQ2FzZSgpO1xuICAgIGxldCBxbGVuID0gcXVlcnkubGVuZ3RoO1xuXG4gICAgLy8gTWF0Y2ggb24gYW55IHN0cmluZ1xuICAgIGxldCBtYXRjaCA9IGZhbHNlO1xuXG4gICAgLy8gbG9jYXRpb24gdGhhdCBlYWNoIG1hdGNoIG9jY3VycmVkXG4gICAgLy8gdGhpcy5kZXRhaWxzW3F1ZXJ5XSA9IHt9O1xuXG4gICAgT2JqZWN0LmtleXModGhpcy5zdHJpbmdzKS5zb21lKCh0eXBlKSA9PiB7XG4gICAgICBsZXQgc3RyID0gdGhpcy5zdHJpbmdzW3R5cGVdLnRvTG93ZXJDYXNlKCk7XG4gICAgICBsZXQgaiA9IDA7XG4gICAgICBsZXQgbGVuID0gc3RyLmxlbmd0aDtcblxuICAgICAgLy8gYSBwcmV2aW91cyBzdHJpbmcgbWF0Y2hlZCwgc28gZXhpdFxuICAgICAgaWYgKCBtYXRjaCApIHJldHVybiB0cnVlO1xuXG4gICAgICBsZXQgbWF0Y2hMb2NhdGlvbnMgPSBbXTtcbiAgICAgIGZvciAoIGxldCBpID0gMDsgaSA8IGxlbiAmJiAhbWF0Y2g7IGkrKykge1xuICAgICAgICBpZiAoIHN0ci5jaGFyQXQoaSkgPT0gcXVlcnlbal0gKSB7XG4gICAgICAgICAgbWF0Y2hMb2NhdGlvbnMucHVzaChpKTtcbiAgICAgICAgICBqKys7XG4gICAgICAgIH1cbiAgICAgICAgbWF0Y2ggPSAoIGogPT0gcWxlbiApO1xuICAgICAgfVxuXG4gICAgICBpZiAoIG1hdGNoICkge1xuICAgICAgICB0aGlzLmRldGFpbHMgPSB7fTtcbiAgICAgICAgdGhpcy5kZXRhaWxzW3R5cGVdID0gbWF0Y2hMb2NhdGlvbnM7XG4gICAgICB9XG5cbiAgICAgIC8vIHdoZW4gdHJ1ZSB3aWxsIGJyZWFrIG91dCBvZiBzb21lKCkgbG9vcFxuICAgICAgcmV0dXJuIG1hdGNoO1xuICAgIH0pO1xuXG4gICAgY29uc29sZS5sb2coYE1hdGNoIEZvdW5kPyAke21hdGNofWAsIHRoaXMpO1xuICAgIHJldHVybiBtYXRjaDtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1hdGNoZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBSZXN1bHRzRE9NIGZyb20gJy4vcmVzdWx0c19kb20nO1xuXG5jbGFzcyBNZXRhIHtcbiAgY29uc3RydWN0b3IobGlzdCkge1xuICAgIHRoaXMubGlzdCA9IG5ldyBSZXN1bHRzRE9NKGxpc3QpO1xuICB9XG5cbiAgcGVyZm9ybShhY3Rpb24pIHtcbiAgICB0aGlzW2FjdGlvbl0oKTtcbiAgfVxuXG4gIHRyaWdnZXIoKSB7XG4gICAgdmFyIHNlbCA9IHRoaXMubGlzdC5zZWxlY3RlZCgpO1xuICAgIGNocm9tZS50YWJzLmNyZWF0ZSh7IHVybDogc2VsLmRhdGEoJ3VybCcpIH0pO1xuICB9XG5cbiAgbW92ZVVwKCkge1xuICAgIHZhciBzZWwgPSB0aGlzLmxpc3Quc2VsZWN0ZWQoKTtcbiAgICB2YXIgcHJldiA9IHRoaXMubGlzdC5wcmV2aW91cyhzZWwpO1xuXG4gICAgaWYgKCBwcmV2ICYmIHNlbCAhPSBwcmV2ICkge1xuICAgICAgdGhpcy5saXN0LnVuc2VsZWN0KHNlbCk7XG4gICAgICB0aGlzLmxpc3Quc2VsZWN0KHByZXYpO1xuICAgIH1cbiAgfVxuXG4gIG1vdmVEb3duKCkge1xuICAgIHZhciBzZWwgPSB0aGlzLmxpc3Quc2VsZWN0ZWQoKTtcbiAgICB2YXIgbmV4dCA9IHRoaXMubGlzdC5uZXh0KHNlbCk7XG5cbiAgICBpZiAoIG5leHQgJiYgc2VsICE9IG5leHQgKSB7XG4gICAgICB0aGlzLmxpc3QudW5zZWxlY3Qoc2VsKTtcbiAgICAgIHRoaXMubGlzdC5zZWxlY3QobmV4dCk7XG4gICAgfVxuICB9XG5cbiAgbW92ZUZvcndhcmQoKSB7XG4gICAgY29uc29sZS5sb2coJ21vdmUgZm9yd2FyZCcpO1xuICB9XG5cbiAgbW92ZUJhY2soKSB7XG4gICAgY29uc29sZS5sb2coJ21vdmUgYmFjaycpO1xuICB9XG5cbiAgY2FuY2VsKCkge1xuICAgIGNvbnNvbGUubG9nKCdjYW5jZWwnKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNZXRhO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgRE9NRWxlbWVudCBmcm9tICcuL2RvbV9lbGVtZW50JztcblxuY2xhc3MgUmVzdWx0c0RPTSB7XG4gIGNvbnN0cnVjdG9yKGNvbnRhaW5lcikge1xuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuICB9XG5cbiAgZmlyc3QoKSB7XG4gICAgbGV0IGYgPSB0aGlzLmNvbnRhaW5lci5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGknKVswXTtcbiAgICByZXR1cm4gdGhpcy5kb21FbE9yTnVsbChmKTtcbiAgfVxuXG4gIGxhc3QoKSB7XG4gICAgbGV0IGxpc3QgPSB0aGlzLmNvbnRhaW5lci5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGknKTtcbiAgICBsZXQgbGFzdCA9IGxpc3RbbGlzdC5sZW5ndGggLSAxXTtcbiAgICByZXR1cm4gdGhpcy5kb21FbE9yTnVsbChsYXN0KTtcbiAgfVxuXG4gIHNlbGVjdGVkKCkge1xuICAgIGxldCBzZWwgPSB0aGlzLmNvbnRhaW5lci5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzZWxlY3RlZCcpWzBdO1xuICAgIHJldHVybiB0aGlzLmRvbUVsT3JOdWxsKHNlbCk7XG4gIH1cblxuICAvLyBHZXQgdGhlIG5leHQgZWxlbWVudCBpbiB0aGUgbGlzdCByZWxhdGl2ZSB0byB0aGUgcHJvdmlkZWQgZG9tRWxcbiAgbmV4dChkb21FbCkge1xuICAgIGlmICggIWRvbUVsICkgcmV0dXJuIHRoaXMuZmlyc3QoKTtcblxuICAgIGxldCBpbmRleCA9IHRoaXMuaW5kZXhPZihkb21FbCk7XG4gICAgbGV0IGl0ZW1zID0gdGhpcy5jb250YWluZXIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2xpJyk7IFxuICAgIGxldCBuZXh0ID0gaXRlbXNbaW5kZXggKyAxXTtcbiAgICBpZiAoICFuZXh0ICkgbmV4dCA9IHRoaXMubGFzdCgpO1xuICAgIHJldHVybiB0aGlzLmRvbUVsT3JOdWxsKG5leHQpO1xuICB9XG5cbiAgcHJldmlvdXMoZG9tRWwpIHtcbiAgICBpZiAoICFkb21FbCApIHJldHVybiBudWxsO1xuXG4gICAgbGV0IGluZGV4ID0gdGhpcy5pbmRleE9mKGRvbUVsKTtcbiAgICBsZXQgaXRlbXMgPSB0aGlzLmNvbnRhaW5lci5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGknKTsgXG4gICAgbGV0IHByZXYgPSBpdGVtc1tpbmRleCAtIDFdO1xuICAgIHJldHVybiB0aGlzLmRvbUVsT3JOdWxsKHByZXYpO1xuICB9XG5cbiAgZG9tRWxPck51bGwoZWwpIHtcbiAgICBpZiAoICFlbCApIHJldHVybiBudWxsO1xuICAgIC8vIGVsIGlzIGFscmVhZHkgYSBET01FTGVtZW50XG4gICAgaWYgKCAhISh0eXBlb2YgZWwgPT0gJ29iamVjdCcgJiYgZWxbJ2VsJ10pICkgcmV0dXJuIGVsO1xuICAgIHJldHVybiBuZXcgRE9NRWxlbWVudChlbCk7XG4gIH1cblxuICAvLyBBZGQgJ3NlbGVjdGVkJyBjbGFzcyB0byB0aGUgcHJvdmlkZWQgZG9tRWxcbiAgc2VsZWN0KGRvbUVsKSB7XG4gICAgaWYgKCAhZG9tRWwgKSBkb21FbCA9IHRoaXMubGFzdCgpO1xuICAgIGRvbUVsLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuICB9XG5cbiAgLy8gUmVtb3ZlICdzZWxlY3RlZCcgY2xhc3MgZnJvbSB0aGUgcHJvdmlkZWQgZG9tRWxcbiAgdW5zZWxlY3QoZG9tRWwpIHtcbiAgICBpZiAoICFkb21FbCApIHJldHVybjtcbiAgICBkb21FbC5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcbiAgfVxuXG4gIHVuc2VsZWN0QWxsKCkge1xuICAgIHRoaXMuZWFjaCgoZG9tRWwpID0+IHsgdGhpcy51bnNlbGVjdChkb21FbCkgfSk7XG4gIH1cblxuICBlYWNoKGZuLCBhcmdzPXt9KSB7XG4gICAgbGV0IGJvdW5kID0gZm4uYmluZCh0aGlzKTtcbiAgICBsZXQgaXRlbXMgPSB0aGlzLmNvbnRhaW5lci5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGknKTtcbiAgICBmb3IgKCBsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKyApIHtcbiAgICAgIGJvdW5kKG5ldyBET01FbGVtZW50KGl0ZW1zW2ldKSwgYXJncywgaSk7XG4gICAgfVxuICB9XG5cbiAgaW5kZXhPZihkb21FbCkge1xuICAgIGxldCBpdGVtcyA9IHRoaXMuY29udGFpbmVyLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdsaScpO1xuICAgIGxldCBpbmRleDtcbiAgICBmb3IgKCBsZXQgaSA9IDA7ICFpbmRleCAmJiBpIDwgaXRlbXMubGVuZ3RoOyBpKysgKSB7XG4gICAgICBpZiAoIGRvbUVsLmVsID09IGl0ZW1zW2ldICkgaW5kZXggPSBpO1xuICAgIH1cbiAgICByZXR1cm4gaW5kZXg7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSZXN1bHRzRE9NO1xuIiwiaW1wb3J0IE1hdGNoZXIgZnJvbSAnLi9tYXRjaGVyJztcblxuY2xhc3MgVXBkYXRlciB7XG4gIGNvbnN0cnVjdG9yKGlucHV0RWwsIHJlc3VsdHNFbCkge1xuICAgIHRoaXMuaW5wdXRFbCA9IGlucHV0RWw7XG4gICAgdGhpcy5yZXN1bHRzRWwgPSByZXN1bHRzRWw7XG4gICAgdGhpcy5tYXRjaGVyTWFwID0ge307XG5cbiAgICB0aGlzLmxhc3RRdWVyeSA9IG51bGw7XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgY2hyb21lLmJvb2ttYXJrcy5nZXRUcmVlKChpdGVtcykgPT4ge1xuICAgICAgdGhpcy5tYXRjaGVyTWFwWycnXSA9IGl0ZW1zWzBdLmNoaWxkcmVuO1xuICAgICAgc2VsZi5ib29rbWFya3MgPSB0aGlzLm1hdGNoZXJNYXBbJyddO1xuICAgICAgc2VsZi5yZW5kZXIoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNlYXJjaChxKSB7XG4gICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgLy8gZGVidWdnZXJcblxuICAgIGlmICggdGhpcy5sYXN0UXVlcnkgPT0gcSApIHJldHVybjtcbiAgICB0aGlzLmxhc3RRdWVyeSA9IHE7XG5cbiAgICBjb25zb2xlLmxvZygnbmV3IHF1ZXJ5JywgdGhpcy5sYXN0UXVlcnksIHEpO1xuXG4gICAgaWYgKCB0aGlzLmlucHV0RWwudmFsdWUubGVuZ3RoID09IDAgKSB7XG4gICAgICAvLyB3ZSBqdXN0IGNsZWFyZWQgdGhlIHF1ZXJ5IHNvIHJlc2V0IHVzaWduIHRoZSBiYXNlUmVzdWx0cyAoZ29cbiAgICAgIC8vIGludG8gYnJvd3NlIG1vZGUpXG4gICAgICB0aGlzLmJvb2ttYXJrcyA9IHRoaXMubWF0Y2hlck1hcFsnJ107XG4gICAgICBzZWxmLnJlbmRlcigpO1xuXG4gICAgfSBlbHNlIGlmICggdGhpcy5tYXRjaGVyTWFwW3FdICkge1xuICAgICAgc2VsZi5ib29rbWFya3MgPSB0aGlzLm1hdGNoZXJNYXBbcV07XG4gICAgICBzZWxmLnJlbmRlcigpO1xuXG4gICAgfSBlbHNlIGlmICggdGhpcy5ib29rbWFya3MgPT0gdGhpcy5tYXRjaGVyTWFwWycnXSApIHtcbiAgICAgIGNvbnNvbGUubG9nKCdQZXJmb3JtIGluaXRpYWwgc2VhcmNoOiAnKyBxKTtcbiAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgIGNocm9tZS5ib29rbWFya3Muc2VhcmNoKHEsIGZ1bmN0aW9uIChpdGVtcykge1xuICAgICAgICBzZWxmLm1hdGNoZXJNYXBbcV0gPSBpdGVtcztcbiAgICAgICAgc2VsZi5ib29rbWFya3MgPSBpdGVtcztcbiAgICAgICAgc2VsZi5yZW5kZXIoKTtcbiAgICAgIH0pO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCdmaWx0ZXIgdGhlc2UgcmVzdWx0cycsIHRoaXMuYm9va21hcmtzKTtcbiAgICAgIGxldCBmaWx0ZXJlZCA9IHRoaXMuYm9va21hcmtzLmZpbHRlcihmdW5jdGlvbihvYmopIHtcbiAgICAgICAgLy8gT25seSBpbmNsdWRlIChhY3Rpb25hYmxlKSBib29rbWFya3MgKHdpdGggYSB1cmwpXG4gICAgICAgIGlmICggIW9iai51cmwgKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgaWYgKCAhb2JqLm1hdGNoZXIgKSB7XG4gICAgICAgICAgb2JqLm1hdGNoZXIgPSBuZXcgTWF0Y2hlcih7dGl0bGU6IG9iai50aXRsZSwgdXJsOiBvYmoudXJsfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9iai5tYXRjaGVyLm1hdGNoZXMocSk7XG4gICAgICB9KTtcblxuICAgICAgc2VsZi5tYXRjaGVyTWFwW3FdID0gZmlsdGVyZWQ7XG4gICAgICB0aGlzLmJvb2ttYXJrcyA9IGZpbHRlcmVkO1xuICAgICAgc2VsZi5yZW5kZXIoKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgbGV0IGZpbHRlcmVkID0gdGhpcy5maWx0ZXJGb3JSZW5kZXIoKTtcbiAgICBsZXQgY29udGVudCA9IEZpbmRyLnRlbXBsYXRlcy5yZXN1bHRzKHtib29rbWFya3M6IGZpbHRlcmVkfSk7XG4gICAgdGhpcy5yZXN1bHRzRWwuaW5uZXJIVE1MID0gY29udGVudDtcbiAgfVxuXG4gIGZpbHRlckZvclJlbmRlcigpIHtcbiAgICByZXR1cm4gdGhpcy5ib29rbWFya3MuZmlsdGVyKChvYmopID0+IHtcbiAgICAgIGxldCBoYXNDaGlsZHJlbiA9IG9ialsnY2hpbGRyZW4nXSAmJiBvYmouY2hpbGRyZW4ubGVuZ3RoID4gMDtcbiAgICAgIHJldHVybiBoYXNDaGlsZHJlbiB8fCBvYmoudXJsO1xuICAgIH0pO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVXBkYXRlciA7XG4iXX0=
