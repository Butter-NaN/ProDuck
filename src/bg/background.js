// helpers
function change_badge(text, colour) {
    chrome.browserAction.setBadgeText( { 'text': text } );
    chrome.browserAction.setBadgeBackgroundColor( { 'color': colour } );
}

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

// set default values
chrome.storage.local.set({ 
        'state': 'rest',
        'track': false, 
        'tabMap': {}
});
change_badge('zZzZ', '#8e8e8e'); // GREY

// listeners
chrome.storage.onChanged.addListener(
    function(changes, areaName) {
        // changes.track
        if (changes.track != undefined && changes.track.newValue) {
            chrome.storage.local.get('state',
                function(item) {
                    var state = item.state
                    state == 'rest'
                        ? change_badge('REST', '#008bb2') /* BLUE */
                        : change_badge('WORK', '#b25f00');// ORANGE
                }
            );
        } else if (changes.track != undefined && !changes.track.newValue) {
            change_badge('zZzZ', '#8e8e8e'); // GREY
        } else if (changes.state != undefined) {
            chrome.storage.local.get('track',
                function(item) {
                    if (item.track) {
                        changes.state.newValue == 'rest'
                            ? change_badge('REST', '#008bb2') /* BLUE */
                            : change_badge('WORK', '#b25f00');// ORANGE
                    } else {}
                }
            );
        } else {}
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

