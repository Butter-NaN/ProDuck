var STATE_REST = 0;
var STATE_WORK = 1;
chrome.storage.local.set( {'state': STATE_REST} );  // default

chrome.storage.onChanged.addListener(
    function(changes, areaName) {
        alert(String(changes) + String(areaName));
    }
);

// TODO: are these sample code useful to us?
// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });
//example of using a message handler from the inject scripts
//chrome.extension.onMessage.addListener(
//  function(request, sender, sendResponse) {
//  	chrome.pageAction.show(sender.tab.id);
//    sendResponse();
//  });

