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

function addAllTabCat() {
    chrome.storage.local.get('tabMap',
        function(item) { 
            var tabMap = item.tabMap; 
            chrome.tabs.query( {},
                function(tabs) {
                    // Do not overwrite tabs, but initialize tabs to work
                    for(var i = 0; i < tabs.length; i ++) {
                        if (tabMap[String(tabs[i].id)] == null) {
                            tabMap[String(tabs[i].id)] = { "cat": "work" };
                        } else {}
                    }
                    chrome.storage.local.set( { 'tabMap': tabMap } );
                }
            );
        }
    );
}

// Changes the tab Cat to the other cat 
// i.e. change work to rest, vice versa
// Set to current state by default
function toggleTabCat(tab) {
    chrome.storage.local.get('tabMap',
        function(item) { 
            var tabMap = item.tabMap; 
            chrome.storage.local.get('state',
                function(item) {
                    state = item.state;
                    console.log("current state:" + state);
                    chrome.tabs.query({ 'active': true },
                        function(tabs) {
                            console.log(tabMap[String(tabs[0].id)]);
                            // default if there is no tab
                            // otherwise change the state
                            if (tabMap[String(tabs[0].id)] == null) {
                                tabMap[String(tabs[0].id)] = { "cat": state };
                            } else {
                                if (tabMap[String(tabs[0].id)]["cat"] == "work") {
                                    tabMap[String(tabs[0].id)] = { "cat": "rest" };
                                } else {
                                    tabMap[String(tabs[0].id)] = { "cat": "work" };    
                                }
                            }
                            chrome.storage.local.set( { 'tabMap': tabMap } );
                        }
                    );
            });
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

// Changes UI to show a "tracking" state:
//     - Show state
//     - Show status toggle buttons
//     - Show "toggle tab category" menu
//     - Change "toggle tracking" button to "stop tracking"
function enableUiTrackingMode(){
    console.log('enableUiTrackingMode'); 
    $("#browserActionStateDisplay").show();
    $("#toggleStateButton").show();
    $("#toggleTabCategory").show();
    $("#toggleTrackButton").html(
       "Stop Tracking" 
    );
}

// Changes UI to show a NON "tracking" state:
//     - Hide state
//     - Hide status toggle buttons
//     - Hide "toggle tab category" menu
//     - Change "stop tracking" button to "toggle tracking"
function enableUiNonTrackingMode(){
    console.log('enableUiNonTrackingMode'); 
    $("#browserActionStateDisplay").hide();
    $("#toggleStateButton").hide();
    $("#toggleTabCategory").hide();
    $("#toggleTrackButton").html(
       "Start Tracking" 
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

            //Update state timer immediately when state is changed
            timeRemainingString(update_time);

        } else if (changes.track != undefined) {
            // false is string-casted to the empty string
            var display = changes.track.newValue ? 'true' : 'false';
            $("#browserActionTrack").html(display);
            if (display == 'true') {
                enableUiTrackingMode();
            } else {
                enableUiNonTrackingMode();
            }
        }
    }
);

// Add a new tab listener
chrome.tabs.onCreated.addListener(
    function(tab) {
        chrome.storage.local.get('state',
            function(item) {
                state = item.state;
                addTabCat(tab, state);
            });
})

$(document).ready(
    function() { 
        console.log('$(document).ready call');
        
        // add onclick for button#toggleStateButton
        $("#toggleStateButton").click(
            toggleCallbackFactory("state", "rest", "work")
        );
        // add onclick for button#toggleTrackButton
        $("#toggleTrackButton").click(
            function() {
                toggleCallbackFactory("track", true, false)();
                addAllTabCat();
            }
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
        // add onclick for button#addTabMapButton
        $("#toggleTabCategory").click(
            function() {
                chrome.tabs.query( { 'active': true, 'currentWindow': true },
                    function(tabs) {
                        toggleTabCat(tabs[0]);
                    }); 
            }
        );
        // add onclick for button#runMinimizerButton
        $("#runMinimizerButton").click(toggleTabMapPins);

        // initialise state of spans
        initHtmlValues('state', '#browserActionState');
        initHtmlValues('track', '#browserActionTrack');

        //Start displaying state timer
        timer_loop();
    }
);
