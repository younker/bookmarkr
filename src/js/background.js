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
