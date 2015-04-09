(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

(function background() {
  console.log("background loaded");

  chrome.commands.onCommand.addListener(function(command) {
    console.log('Command:', command);
  });

//  chrome.extension.onRequest.addListener(function(request, sender, callback) {
//         // chrome.bookmarks.getChildren(request.itemId,function (items){
//         //   chrome.windows.create({"url": items[0].url}, function (windows){
//         //     for (var i=1; i < items.length; i++){
//         //       if(check.bookmarklet(items[i].url)==true){console.log("next");continue;}
//         //       chrome.tabs.create( {"windowId": windows.id,"url": items[i].url}, function (){});
//         //     }
//         //   });
//         // });
//         // break;
//   });

})();

},{}]},{},[1]);
