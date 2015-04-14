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
  var meta = new _Meta2['default']();

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

},{"./keyboard":2,"./meta":5,"./updater":6}],2:[function(require,module,exports){
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

},{"./keycodes":3}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var Meta = (function () {
  function Meta() {
    _classCallCheck(this, Meta);
  }

  _createClass(Meta, [{
    key: 'perform',
    value: function perform(action) {
      this[action]();
    }
  }, {
    key: 'moveUp',
    value: function moveUp() {
      console.log('move up');
    }
  }, {
    key: 'moveDown',
    value: function moveDown() {
      console.log('move down');
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

},{}],6:[function(require,module,exports){
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
      // debugger
      var content = Bookmarkr.templates.results({ bookmarks: this.bookmarks });
      this.resultsEl.innerHTML = content;
    }
  }]);

  return Updater;
})();

module.exports = Updater;

},{"./matcher":4}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvd2Vic2l0ZXMvY2hyb21lX2V4dGVuc2lvbnMvYm9va21hcmtyL3NyYy9qcy9wb3B1cC5qcyIsIi93ZWJzaXRlcy9jaHJvbWVfZXh0ZW5zaW9ucy9ib29rbWFya3Ivc3JjL2pzL2tleWJvYXJkLmpzIiwiL3dlYnNpdGVzL2Nocm9tZV9leHRlbnNpb25zL2Jvb2ttYXJrci9zcmMvanMva2V5Y29kZXMuanMiLCIvd2Vic2l0ZXMvY2hyb21lX2V4dGVuc2lvbnMvYm9va21hcmtyL3NyYy9qcy9tYXRjaGVyLmpzIiwiL3dlYnNpdGVzL2Nocm9tZV9leHRlbnNpb25zL2Jvb2ttYXJrci9zcmMvanMvbWV0YS5qcyIsIi93ZWJzaXRlcy9jaHJvbWVfZXh0ZW5zaW9ucy9ib29rbWFya3Ivc3JjL2pzL3VwZGF0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxZQUFZLENBQUM7Ozs7b0JBRUksUUFBUTs7Ozt3QkFDSixZQUFZOzs7O3VCQUNiLFdBQVc7Ozs7QUFFL0IsQ0FBQyxZQUFNOztBQUVMLE1BQUksUUFBUSxHQUFHLDJCQUFjLENBQUM7QUFDOUIsTUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM3QyxVQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDOzs7QUFHdkIsTUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNqRCxNQUFJLE9BQU8sR0FBRyx5QkFBWSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7OztBQUcxQyxNQUFJLElBQUksR0FBRyx1QkFBVSxDQUFDOztBQUV0QixRQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsVUFBUyxPQUFPLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRTtBQUMzRSxZ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LE9BQU8sQ0FBQyxFQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFDLENBQUMsQ0FBQztBQUN2RSxVQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7S0FDcEM7OztTQTFERyxPQUFPOzs7QUE2RGIsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgTWV0YSBmcm9tICcuL21ldGEnO1xuaW1wb3J0IEtleWJvYXJkIGZyb20gJy4va2V5Ym9hcmQnO1xuaW1wb3J0IFVwZGF0ZXIgZnJvbSAnLi91cGRhdGVyJztcblxuKCgpID0+IHtcbiAgLy8gU2V0IHVwIHRoZSBrZXlib2FyZCB0byBsaXN0ZW4gZm9yIGtleSBwcmVzc2VzIGFuZCBpbnRlcnByZXQgdGhlaXIga2V5Y29kZXNcbiAgdmFyIGtleWJvYXJkID0gbmV3IEtleWJvYXJkKCk7XG4gIHZhciBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnB1dCcpO1xuICBrZXlib2FyZC5saXN0ZW4oaW5wdXQpO1xuXG4gIC8vIEhhbmRsZSBhbnkgbGlzdCB1cGRhdGVzIHRoYXQgYXJlIG5lZWRlZFxuICB2YXIgcmVzdWx0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN1bHRzJyk7XG4gIHZhciB1cGRhdGVyID0gbmV3IFVwZGF0ZXIoaW5wdXQsIHJlc3VsdHMpO1xuXG4gIC8vIFJlc3BvbnNpYmxlIGZvciBzZWxlY3Rpb24gbW92ZW1lbnQsIGFjdGlvbiBjYW5jZWxsYXRpb25zLCBldGNcbiAgdmFyIG1ldGEgPSBuZXcgTWV0YSgpO1xuXG4gIGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihmdW5jdGlvbihtZXNzYWdlLCBzZW5kZXIsIHNlbmRSZXNwb25zZSkge1xuICAgIHN3aXRjaCAoIG1lc3NhZ2UudHlwZSApIHtcbiAgICAgIGNhc2UgJ3VwZGF0ZSc6XG4gICAgICAgIHZhciBxdWVyeSA9IGlucHV0LnZhbHVlXG4gICAgICAgIHVwZGF0ZXIuc2VhcmNoKHF1ZXJ5KTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ21ldGEnOlxuICAgICAgICBtZXRhLnBlcmZvcm0obWVzc2FnZS5hY3Rpb24pO1xuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgY29uc29sZS5sb2coJ3VuaGFuZGxlZCBtZXNzYWdlJywgbWVzc2FnZSwgc2VuZGVyKTtcbiAgICB9XG4gIH0pO1xufSkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IEtleWNvZGVzIGZyb20gJy4va2V5Y29kZXMnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEtleWJvYXJkIHtcbiAgbGlzdGVuKGVsKSB7XG4gICAgZWwub25rZXlkb3duID0gS2V5Y29kZXMub25rZXlkb3duO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBLZXljb2RlcyB7XG4gIHN0YXRpYyBvbmtleWRvd24oZSkge1xuICAgIC8vIEFzc3VtZSB0aGUgYWN0aW9uIGlzIGFuIHVwZGF0ZS4gQW55IG90aGVyIHR5cGUgb2YgYWN0aW9uIG11c3QgYmVcbiAgICAvLyBoYW5kbGVkIGZvciBoZXJlLlxuICAgIHZhciBtZXNzYWdlID0ge1xuICAgICAga2V5Y29kZTogZS5rZXlDb2RlLFxuICAgICAgdHlwZTogJ3VwZGF0ZScsXG4gICAgICBhY3Rpb246IG51bGxcbiAgICB9O1xuXG4gICAgc3dpdGNoICggZS5rZXlDb2RlICkge1xuICAgICAgY2FzZSAzNzogLy8gbGVmdCBhcnJvd1xuICAgICAgICBtZXNzYWdlLnR5cGUgPSAnbWV0YSc7XG4gICAgICAgIG1lc3NhZ2UuYWN0aW9uID0gJ21vdmVCYWNrJztcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgMzg6IC8vIHVwIGFycm93XG4gICAgICAgIG1lc3NhZ2UudHlwZSA9ICdtZXRhJztcbiAgICAgICAgbWVzc2FnZS5hY3Rpb24gPSAnbW92ZVVwJztcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgMzk6IC8vIHJpZ2h0IGFycm93XG4gICAgICAgIG1lc3NhZ2UudHlwZSA9ICdtZXRhJztcbiAgICAgICAgbWVzc2FnZS5hY3Rpb24gPSAnbW92ZUZvcndhcmQnO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSA0MDogLy8gZG93biBhcnJvd1xuICAgICAgICBtZXNzYWdlLnR5cGUgPSAnbWV0YSc7XG4gICAgICAgIG1lc3NhZ2UuYWN0aW9uID0gJ21vdmVEb3duJztcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgNjY6IC8vIGJcbiAgICAgICAgaWYgKCBlLmN0cmxLZXkgKSB7XG4gICAgICAgICAgbWVzc2FnZS50eXBlID0gJ21ldGEnO1xuICAgICAgICAgIG1lc3NhZ2UuYWN0aW9uID0gJ21vdmVCYWNrJztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICBjYXNlIDcwOiAvLyBmXG4gICAgICAgIGlmICggZS5jdHJsS2V5ICkge1xuICAgICAgICAgIG1lc3NhZ2UudHlwZSA9ICdtZXRhJztcbiAgICAgICAgICBtZXNzYWdlLmFjdGlvbiA9ICdtb3ZlRm9yd2FyZCc7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgNzE6IC8vIGdcbiAgICAgICAgaWYgKCBlLmN0cmxLZXkgKSB7XG4gICAgICAgICAgbWVzc2FnZS50eXBlID0gJ21ldGEnO1xuICAgICAgICAgIG1lc3NhZ2UuYWN0aW9uID0gJ2NhbmNlbCc7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgNzg6IC8vIG5cbiAgICAgICAgaWYgKCBlLmN0cmxLZXkgKSB7XG4gICAgICAgICAgbWVzc2FnZS50eXBlID0gJ21ldGEnO1xuICAgICAgICAgIG1lc3NhZ2UuYWN0aW9uID0gJ21vdmVEb3duJztcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSA4MDogLy8gcFxuICAgICAgICBpZiAoIGUuY3RybEtleSApIHtcbiAgICAgICAgICBtZXNzYWdlLnR5cGUgPSAnbWV0YSc7XG4gICAgICAgICAgbWVzc2FnZS5hY3Rpb24gPSAnbW92ZVVwJztcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICB9O1xuXG4gICAgY29uc29sZS5sb2coJ2tleWNvZGVzJywgbWVzc2FnZSk7XG5cbiAgICAvLyBFbWl0IG1lc3NhZ2Ugc28gdGhlIHByb3BlciBhY3Rpb24gY2FuIGJlIHRha2VuXG4gICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UobWVzc2FnZSk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gS2V5Y29kZXM7XG4iLCJjbGFzcyBNYXRjaGVyIHtcbiAgY29uc3RydWN0b3IgKHN0cmluZ3M9e30pIHtcbiAgICB0aGlzLnN0cmluZ3MgPSBzdHJpbmdzO1xuICAgIC8vIHRoaXMuc3RyaW5ncyA9IHN0cmluZ3MubWFwKChzdHIpID0+IHsgcmV0dXJuIHN0ci50b0xvd2VyQ2FzZSgpIH0pO1xuICB9XG5cbiAgbWF0Y2hlcyhxdWVyeSkge1xuICAgIHF1ZXJ5ID0gcXVlcnkudG9Mb3dlckNhc2UoKTtcbiAgICBsZXQgcWxlbiA9IHF1ZXJ5Lmxlbmd0aDtcblxuICAgIC8vIE1hdGNoIG9uIGFueSBzdHJpbmdcbiAgICBsZXQgbWF0Y2ggPSBmYWxzZTtcblxuICAgIC8vIGxvY2F0aW9uIHRoYXQgZWFjaCBtYXRjaCBvY2N1cnJlZFxuICAgIC8vIHRoaXMuZGV0YWlsc1txdWVyeV0gPSB7fTtcblxuICAgIE9iamVjdC5rZXlzKHRoaXMuc3RyaW5ncykuc29tZSgodHlwZSkgPT4ge1xuICAgICAgbGV0IHN0ciA9IHRoaXMuc3RyaW5nc1t0eXBlXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgbGV0IGogPSAwO1xuICAgICAgbGV0IGxlbiA9IHN0ci5sZW5ndGg7XG5cbiAgICAgIC8vIGEgcHJldmlvdXMgc3RyaW5nIG1hdGNoZWQsIHNvIGV4aXRcbiAgICAgIGlmICggbWF0Y2ggKSByZXR1cm4gdHJ1ZTtcblxuICAgICAgbGV0IG1hdGNoTG9jYXRpb25zID0gW107XG4gICAgICBmb3IgKCBsZXQgaSA9IDA7IGkgPCBsZW4gJiYgIW1hdGNoOyBpKyspIHtcbiAgICAgICAgaWYgKCBzdHIuY2hhckF0KGkpID09IHF1ZXJ5W2pdICkge1xuICAgICAgICAgIG1hdGNoTG9jYXRpb25zLnB1c2goaSk7XG4gICAgICAgICAgaisrO1xuICAgICAgICB9XG4gICAgICAgIG1hdGNoID0gKCBqID09IHFsZW4gKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCBtYXRjaCApIHtcbiAgICAgICAgdGhpcy5kZXRhaWxzID0ge307XG4gICAgICAgIHRoaXMuZGV0YWlsc1t0eXBlXSA9IG1hdGNoTG9jYXRpb25zO1xuICAgICAgfVxuXG4gICAgICAvLyB3aGVuIHRydWUgd2lsbCBicmVhayBvdXQgb2Ygc29tZSgpIGxvb3BcbiAgICAgIHJldHVybiBtYXRjaDtcbiAgICB9KTtcblxuICAgIGNvbnNvbGUubG9nKGBNYXRjaCBGb3VuZD8gJHttYXRjaH1gLCB0aGlzKTtcbiAgICByZXR1cm4gbWF0Y2g7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNYXRjaGVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBNZXRhIHtcbiAgcGVyZm9ybShhY3Rpb24pIHtcbiAgICB0aGlzW2FjdGlvbl0oKTtcbiAgfVxuXG4gIG1vdmVVcCgpIHtcbiAgICBjb25zb2xlLmxvZygnbW92ZSB1cCcpO1xuICB9XG5cbiAgbW92ZURvd24oKSB7XG4gICAgY29uc29sZS5sb2coJ21vdmUgZG93bicpO1xuICB9XG5cbiAgbW92ZUZvcndhcmQoKSB7XG4gICAgY29uc29sZS5sb2coJ21vdmUgZm9yd2FyZCcpO1xuICB9XG5cbiAgbW92ZUJhY2soKSB7XG4gICAgY29uc29sZS5sb2coJ21vdmUgYmFjaycpO1xuICB9XG5cbiAgY2FuY2VsKCkge1xuICAgIGNvbnNvbGUubG9nKCdjYW5jZWwnKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNZXRhO1xuIiwiaW1wb3J0IE1hdGNoZXIgZnJvbSAnLi9tYXRjaGVyJztcblxuY2xhc3MgVXBkYXRlciB7XG4gIGNvbnN0cnVjdG9yKGlucHV0RWwsIHJlc3VsdHNFbCkge1xuICAgIHRoaXMuaW5wdXRFbCA9IGlucHV0RWw7XG4gICAgdGhpcy5yZXN1bHRzRWwgPSByZXN1bHRzRWw7XG4gICAgdGhpcy5tYXRjaGVyTWFwID0ge307XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgY2hyb21lLmJvb2ttYXJrcy5nZXRUcmVlKChpdGVtcykgPT4ge1xuICAgICAgdGhpcy5tYXRjaGVyTWFwWycnXSA9IGl0ZW1zWzBdLmNoaWxkcmVuO1xuICAgICAgc2VsZi5ib29rbWFya3MgPSB0aGlzLm1hdGNoZXJNYXBbJyddO1xuICAgICAgc2VsZi5yZW5kZXIoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNlYXJjaChxKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKCB0aGlzLmlucHV0RWwudmFsdWUubGVuZ3RoID09IDAgKSB7XG4gICAgICAvLyB3ZSBqdXN0IGNsZWFyZWQgdGhlIHF1ZXJ5IHNvIHJlc2V0IHVzaWduIHRoZSBiYXNlUmVzdWx0cyAoZ29cbiAgICAgIC8vIGludG8gYnJvd3NlIG1vZGUpXG4gICAgICB0aGlzLmJvb2ttYXJrcyA9IHRoaXMubWF0Y2hlck1hcFsnJ107XG4gICAgICBzZWxmLnJlbmRlcigpO1xuXG4gICAgfSBlbHNlIGlmICggdGhpcy5tYXRjaGVyTWFwW3FdICkge1xuICAgICAgc2VsZi5ib29rbWFya3MgPSB0aGlzLm1hdGNoZXJNYXBbcV07XG4gICAgICBzZWxmLnJlbmRlcigpO1xuXG4gICAgfSBlbHNlIGlmICggdGhpcy5ib29rbWFya3MgPT0gdGhpcy5tYXRjaGVyTWFwWycnXSApIHtcbiAgICAgIGNvbnNvbGUubG9nKCdQZXJmb3JtIGluaXRpYWwgc2VhcmNoOiAnKyBxKTtcbiAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgIGNocm9tZS5ib29rbWFya3Muc2VhcmNoKHEsIGZ1bmN0aW9uIChpdGVtcykge1xuICAgICAgICBzZWxmLm1hdGNoZXJNYXBbcV0gPSBpdGVtcztcbiAgICAgICAgc2VsZi5ib29rbWFya3MgPSBpdGVtcztcbiAgICAgICAgc2VsZi5yZW5kZXIoKTtcbiAgICAgIH0pO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCdmaWx0ZXIgdGhlc2UgcmVzdWx0cycsIHRoaXMuYm9va21hcmtzKTtcbiAgICAgIGxldCBmaWx0ZXJlZCA9IHRoaXMuYm9va21hcmtzLmZpbHRlcihmdW5jdGlvbihvYmopIHtcbiAgICAgICAgLy8gT25seSBpbmNsdWRlIChhY3Rpb25hYmxlKSBib29rbWFya3MgKHdpdGggYSB1cmwpXG4gICAgICAgIGlmICggIW9iai51cmwgKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgaWYgKCAhb2JqLm1hdGNoZXIgKSB7XG4gICAgICAgICAgb2JqLm1hdGNoZXIgPSBuZXcgTWF0Y2hlcih7dGl0bGU6IG9iai50aXRsZSwgdXJsOiBvYmoudXJsfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9iai5tYXRjaGVyLm1hdGNoZXMocSk7XG4gICAgICB9KTtcblxuICAgICAgc2VsZi5tYXRjaGVyTWFwW3FdID0gZmlsdGVyZWQ7XG4gICAgICB0aGlzLmJvb2ttYXJrcyA9IGZpbHRlcmVkO1xuICAgICAgc2VsZi5yZW5kZXIoKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgLy8gZGVidWdnZXJcbiAgICBsZXQgY29udGVudCA9IEJvb2ttYXJrci50ZW1wbGF0ZXMucmVzdWx0cyh7Ym9va21hcmtzOiB0aGlzLmJvb2ttYXJrc30pO1xuICAgIHRoaXMucmVzdWx0c0VsLmlubmVySFRNTCA9IGNvbnRlbnQ7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBVcGRhdGVyIDtcbiJdfQ==
