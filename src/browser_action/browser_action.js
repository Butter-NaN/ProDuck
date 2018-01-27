/////////////////
// DEFINITIONS //
/////////////////

/**
 * State functions
 */

// generates onclick function for
//   - button#toggleStateButton
//   - button#toggleTrackButton
function toggleCallbackFactory(key, val1, val2) {
    // string, any, any -> function
    return function() { 
        chrome.storage.local.get(key,
            function(item) {
                var lastValue = item[key];
                var nextValue = lastValue == val1 ? val2 : val1;
                prep = {}; prep[key] = nextValue;
                chrome.storage.local.set(prep);
            }
        );
    }
}

// initialises value of key in chrome.storage to html of id_attr
//   - span#browserActionState
//   - span#browserActionTrack
function initHtmlValues(key, id_attr) {
    chrome.storage.local.get(key,
        function(item) {
            $(id_attr).html(item[key]);
        }
    );
}

/**
 * Tab map handling
 */

// Adds the tab into the tabMap with stage stage,
// stored as [tabId, cat(egory)]
// Will replace if the tab already has a cat.
function addTabCat(tab, stage) {
    // Access the tabMap
    var tabMap;
    chrome.storage.local.get('tabMap',
                    function(item) {
                        console.log(item.tabMap);
                        tabMap = item.tabMap;
                    });
    // Use the tab.id as a key to store the stage
    tabMap[tab.id] = [];
    tabMap[tab.id][0] = stage;
}

// Change/add the cat of the current tab to work
function addCurrentToWork() {
    chrome.tabs.query( { 'active': true,
                         'currentWindow': true },
                       function(tabs) {
                           console.log(tabs[0].id);
                           addTabCat(tabs[0], "work");
                       });
}

// Change/add the cat of the current tab to rest
function addCurrentToRest() {
    chrome.tabs.query( { 'active': true,
                         'currentWindow': true },
                       function(tabs) {
                           console.log(tabs[0].id);
                           addTabCat(tabs[0], "rest");
                       });
}

/**
 * Tab Pin handling
 */

// Go through the tabMap and toggle all pins
function toggleTabMapPins() {
    // Retrieve the tabMap
    var tabMap;
    chrome.storage.local.get('tabMap',
                    function(item) {
                        console.log(item.tabMap);
                        tabMap = item.tabMap;
                    });
    // retrieve current state
    var state;
    chrome.storage.local.get('state',
                    function(item) {
                        console.log(item.state);
                        state = item.state;
                    });

    for (tab in tabMap) {
        // Unpin all in the current state
        if (tab[0] === state) {
            chrome.tabs.update(tab, 
                               {'pinned': false },
                               function() {});
        } else {
            chrome.tabs.update(tab, 
                               {'pinned': true },
                               function() {});
        }
    };
}


///////////////
// EXECUTION //
///////////////

// executes chrome.storage.onChanged.addListener 
chrome.storage.onChanged.addListener(
    function(changes, areaName) {
        console.log(JSON.stringify(changes));
        if (changes.state != undefined) {
            $("#browserActionState").html(
                changes.state.newValue
            );
        } else if (changes.track != undefined) {
            // false is string-casted to the empty string
            var display = changes.track.newValue ? 'true' : 'false';
            $("#browserActionTrack").html(display);
        }
    }
);

$(document).ready(
    function() { 
        console.log('$(document).ready call');
        
        // add onclick for button#toggleStateButton
        $("#toggleStateButton").click(
            toggleCallbackFactory("state", "rest", "work")
        );
        // add onclick for button#toggleTrackButton
        $("#toggleTrackButton").click(
            toggleCallbackFactory("track", true, false)
        );
        

        // initialise state of spans
        initHtmlValues('state', '#browserActionState');
        initHtmlValues('track', '#browserActionTrack');
    }
);
