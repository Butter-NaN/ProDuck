/*
Timer:
- stores a variable "endTime" in chrome storage, which is an integer time
  in milliseconds since epoch that the current state is supposed to end at.

- Provides function resetState(), which resets the duration of the current state

- Provides function toggleState(), which toggles the current state

- Provides function finishState(), which toggles state then calls resetState().

- 


*/

var timeout_id = -1;

function resetState(){
    return __resetState(function(){});
}

function __resetState(doNext){
    console.log("Resetting state: ");
    chrome.storage.local.get("state", function(item){
        var state = item.state;
        var MINUTE_MS = 1000 * 60;
        var endTime = -1;
        var timeNow = $.now();

        switch (state){
            case "work":
                endTime = timeNow + 25 * MINUTE_MS;
                break;
            case "rest":
                endTime = timeNow + 5 * MINUTE_MS;
                break;
            default:
                console.error("Unknown value of 'state' in chrome.storage - "
                    + state);
        }
        console.log("Current state is: " + state);
        console.log("Current time: " + timeNow + "; endTime: " + endTime);
        console.log("State ends in " + (endTime - timeNow)/1000 + " seconds");
        chrome.storage.local.set({"endTime": endTime});
        
        chrome.storage.local.get("endTime", function(item){
                console.log("Intended endTime: " + endTime);
                console.log("chrome.storage's endTime: " + item.endTime);
                console.log("chrome.storage endTime write successful?");
                console.log(endTime === item.endTime);


                //KEEP THIS AT THE INNERMOST ASYNC
                doNext();
            }
        );
    });
}

function toggleState(){
    return __toggleState(function(){});
}

function __toggleState(doNext){
   console.log("Toggling state:");
   chrome.storage.local.get("state", function(item){
        var state = item.state;
        var newstate = state === "work"? "rest" : "work";

        chrome.storage.local.set({"state": newstate});
        
        chrome.storage.local.get("state", function(item){
                var state = item.state;
                console.log("New state is: " + state);

                //KEEP THIS AT THE INNERMOST ASYNC
                doNext();
            }
        );
   });
}

function finishState(){
    return __finishState(function(){});
}

function __finishState(doNext){
    __toggleState(function(){__resetState(doNext);});
}


// Refreshes itself every 5 seconds to check if timer has elapsed; if 
//   so then call finishState().
function looper(){
    timeout_id = -1;
    console.log("Looping");

    chrome.storage.local.get("endTime", function(item){
        var endTime = item.endTime;
        var timeNow = $.now();
        var minutes = Math.floor((endTime - timeNow) / 1000 / 60);
        var seconds = Math.floor((endTime - timeNow) / 1000 % 60);
        console.log(minutes + "m " + seconds + "s remaining");

        if (timeNow > endTime){
            //finishState();
            toggleState();

            //Need to notify people that state has changed?
            //Probably not; there's already a listener
            
        } 
        
        timeout_id = setTimeout(looper, 1000);
    });
}


// executes chrome.storage.onChanged.addListener
chrome.storage.onChanged.addListener(
    function(changes, areaName) {
        console.log(JSON.stringify(changes));

        if (changes.state != undefined) {
            console.log("'state' has been changed, resetting stopTime");
            resetState();

        } else if (changes.track != undefined) {
            // "track" has changed
            if (changes.track.newValue){
                // i.e., user are now tracking
                console.log("Beginning to track");
                looper();
            } else {
                // No longer being tracked
                console.log("Stopping tracking");

                //Clear existing timeout
                if (timeout_id != -1) {
                    clearTimeout(timeout_id);
                    timeout_id = -1;
                }
            }
        }
    }
);
