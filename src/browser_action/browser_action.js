/////////////////
// DEFINITIONS //
/////////////////

// generate onclick function for
//   - button#toggleStateButton
//   - button#toggleTrackButton
function toggleCallbackFactory(key, val1, val2) {
    // string, any, any -> function
    return function() { 
        chrome.storage.local.get(key,
            function(item) {
                var lastValue = item[key];
                var nextValue = lastValue == val1 ? val2 : val1;
                var prep = {}; prep[key] = nextValue;
                chrome.storage.local.set(prep);
            }
        );
    }
}

// initialise value of key in chrome.storage to html of id_attr
//   - span#browserActionState
//   - span#browserActionTrack
function initHtmlValues(key, id_attr) {
    chrome.storage.local.get(key,
        function(item) {
            // tenary fixes boolean false casting as empty string ''
            var initValue = item[key] === false ? 'false' : item[key]
            $(id_attr).html(initValue);
        }
    );
}

// add the current Tab to tabMap with addTabCat helper func (below)
function addActiveTabAs(state) {
    chrome.tabs.query( { 'active': true, 'currentWindow': true },
        function(tabs) {
            console.log('addActiveTabAs.anon: ' + JSON.stringify(tabs[0]));
            addTabCat(tabs[0], state);
        }
    );
}

// add the given Tab to tabMap in chrome.storage
//   with key-values "cat": state and "id": id
//   i.e. tabMap{ tab.id:str : { "cat": state:str, "id": id:num }, ... }
function addTabCat(tab, state) {
    chrome.storage.local.get('tabMap',
        function(item) { 
            var tabMap = item.tabMap; 
            // key must be string, otherwise messy
            tabMap[String(tab.id)] = { "cat": state };
            chrome.storage.local.set( { 'tabMap': tabMap } );
        }
    );
}

// onclick function for #runMinimizerButton
function toggleTabMapPins() {
    chrome.storage.local.get(['tabMap', 'state'],
        function(item) {
            var tabMap = item.tabMap;
            var state = item.state;

            for (var tabId in tabMap) {
                console.log('  tabId: ' + typeof(tabId) + '/' + tabId);
                console.log('  tabMap: ' + JSON.stringify(tabMap));
                console.log("  tabMap.tabId: " + JSON.stringify(tabMap.tabId));
                console.log("  tabMap['tabId']: " + JSON.stringify(tabMap['tabId']));
                // note: tabMap.tabId.cat fails
                if (tabMap[tabId].cat == state) {
                    chrome.tabs.update(
                        Number(tabId), { 'pinned': false }, function() {}
                    );
                } else {
                    chrome.tabs.update(
                        Number(tabId), { 'pinned': true }, function() {}
                    );
                }
            }
        }
    );
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
        // add onclick for button#addTabMapButton
        $("#addTabMapButon").click(
            function() {
                chrome.storage.local.get('state',
                    function(item) {
                        state = item.state;
                        addActiveTabAs(state);
                    });
            }
        );
        // add onclick for button#runMinimizerButton
        $("#runMinimizerButton").click(toggleTabMapPins);

        // initialise state of spans
        initHtmlValues('state', '#browserActionState');
        initHtmlValues('track', '#browserActionTrack');
    }
);
