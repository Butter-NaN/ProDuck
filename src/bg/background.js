// helpers
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

// set badge text and colour based on state
// ACCEPTED ARGS state:
//      null :null -> track == false
//     'rest':str  -> track == true && state == 'rest'
//     'work':str  -> track == true && state == 'work'
function changeBadgeTo(state) {
    var GREY, BLUE, ORANGE, INACTIVE_STR, REST_STR, WORK_STR;
    GREY = '#8e8e8e', BLUE = '#008bb2', ORANGE = '#b25f00',
    INACTIVE_STR = 'zZzZ', REST_STR = 'REST', WORK_STR = 'WORK';

    if (state === null) {
        change_badge(INACTIVE_STR, GREY);
    } else if (state == 'rest') {
        change_badge(REST_STR, BLUE);
    } else if (state == 'work') {
        change_badge(WORK_STR, ORANGE);
    } else {}
}

function change_badge(text, colour) {
    chrome.browserAction.setBadgeText( { 'text': text } );
    chrome.browserAction.setBadgeBackgroundColor( { 'color': colour } );
}

// set default values
chrome.storage.local.set({ 
        'state': 'rest',
        'track': false, 
        'tabMap': {}
});
changeBadgeTo(null);

// listeners
chrome.storage.onChanged.addListener(
    function(changes, areaName) {
        var isTrackChanged = changes.track != undefined;
        var isStateChanged = changes.state != undefined;

        if (isTrackChanged) {
            changes.track.newValue
                ? chrome.storage.local.get('state',
                    function(item) {
                        changeBadgeTo(item.state);
                    }
                ) : changeBadgeTo(null);
        } else if (isStateChanged) {
            chrome.storage.local.get('track',
                function(item) {
                    item.track
                        ? (changes.state.newValue == 'rest'
                            ? changeBadgeTo('rest')
                            : changeBadgeTo('work')
                        ) : changeBadgeTo(null);
                }
            );
        } else {}
    }
);
