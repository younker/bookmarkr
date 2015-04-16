(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

// import Matcher from './matcher';

// (() => {
//   var a = (s, q, expected) => {
//     console.log('--- Start:', s, q);
//     let m = new Matcher(s);
//     m.matches(q);
//     var d = m.matchData(q);
//     if ( d.locations.toString() != expected.toString() ) {
//       throw(d.locations.toString() +' != '+ expected.toString());
//     }
//   };

//   a('foo', 'f', [[0,1]]);
//   a('foo', 'o', [[1,2]]);
//   a('/dadmz', 'dm', [[3,5]]);
//   a('ababc', 'abc', [[2,5]]);
//   a('abcdefgabcdefgh', 'abcdefgh', [[7,15]]);
//   a('abcd', 'abd', [[0,2],[3,4]]);
//   a('zyab/cd/blu', 'abdlu', [[2,4],[6,7], [9,11]]);
// })();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvd2Vic2l0ZXMvY2hyb21lX2V4dGVuc2lvbnMvZmluZHIvc3JjL2pzL2JhY2tncm91bmQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxZQUFZLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBpbXBvcnQgTWF0Y2hlciBmcm9tICcuL21hdGNoZXInO1xuXG4vLyAoKCkgPT4ge1xuLy8gICB2YXIgYSA9IChzLCBxLCBleHBlY3RlZCkgPT4ge1xuLy8gICAgIGNvbnNvbGUubG9nKCctLS0gU3RhcnQ6JywgcywgcSk7XG4vLyAgICAgbGV0IG0gPSBuZXcgTWF0Y2hlcihzKTtcbi8vICAgICBtLm1hdGNoZXMocSk7XG4vLyAgICAgdmFyIGQgPSBtLm1hdGNoRGF0YShxKTtcbi8vICAgICBpZiAoIGQubG9jYXRpb25zLnRvU3RyaW5nKCkgIT0gZXhwZWN0ZWQudG9TdHJpbmcoKSApIHtcbi8vICAgICAgIHRocm93KGQubG9jYXRpb25zLnRvU3RyaW5nKCkgKycgIT0gJysgZXhwZWN0ZWQudG9TdHJpbmcoKSk7XG4vLyAgICAgfVxuLy8gICB9O1xuXG4vLyAgIGEoJ2ZvbycsICdmJywgW1swLDFdXSk7XG4vLyAgIGEoJ2ZvbycsICdvJywgW1sxLDJdXSk7XG4vLyAgIGEoJy9kYWRteicsICdkbScsIFtbMyw1XV0pO1xuLy8gICBhKCdhYmFiYycsICdhYmMnLCBbWzIsNV1dKTtcbi8vICAgYSgnYWJjZGVmZ2FiY2RlZmdoJywgJ2FiY2RlZmdoJywgW1s3LDE1XV0pO1xuLy8gICBhKCdhYmNkJywgJ2FiZCcsIFtbMCwyXSxbMyw0XV0pO1xuLy8gICBhKCd6eWFiL2NkL2JsdScsICdhYmRsdScsIFtbMiw0XSxbNiw3XSwgWzksMTFdXSk7XG4vLyB9KSgpO1xuIl19
