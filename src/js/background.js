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
