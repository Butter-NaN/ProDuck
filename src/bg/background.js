// set default values
chrome.storage.local.set({ 
        'state': 'rest',
        'track': false, 
        'tabMap': {}
});

function debug_storage() {
    chrome.storage.local.get(null,
        function(item) {
            var l1 = "vvvvvvvvv DEBUG INFO vvvvvvvvv";
            var l2 = "may you find your answers here";
            var l3 = JSON.stringify(item, null, 2);
            var l4 = "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^";
            console.log (l1+'\n'+l2+'\n'+l3+'\n'+l4);
        }
    );
}

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

