/*
Timer:
- timeRemaining(): 
  - Returns time remaining till scheduled change in state, in milliseconds

- timeRemainingString():
  - Returns time remaining, in the format "12m 8s" 




Internal details:
- stores a variable "endTime" in chrome storage, which is an integer time
  in milliseconds since epoch that the current state is supposed to end at.

- Provides function resetState(), which resets the duration of the current state

- Provides function toggleState(), which toggles the current state
  - When state is toggled, endTime is also automatically reset

*/

//Stores the id of the currently active timeout, to facilitate cancelling
var timeout_id = -1;

// Resets the duration of a state to its full duration
function resetState(){
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
                console.log("chrome.storage endTime write "
                    + (endTime === item.endTime?"success":"FAILURE"));
            }
        );
    });
}

// Toggles state between 'work' and 'rest'
// Due to Listener checking for changes in state, this automatically resets
//   duration of state as well when called.
function toggleState(){
   console.log("Toggling state:");
   chrome.storage.local.get("state", function(item){
        var state = item.state;
        var newstate = state === "work"? "rest" : "work";

        chrome.storage.local.set({"state": newstate});
        
        chrome.storage.local.get("state", function(item){
                var state = item.state;
                console.log("New state is: " + state);
            }
        );
   });
}

// Refreshes itself every 5 seconds, checking if timer has elapsed; if 
//   so then call toggleState() (and thereby resetState()).
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
            toggleState();
        } 
        
        // Keep track of timeout id, to facilitate cancelling
        timeout_id = setTimeout(looper, 1000);
    });
}

// Listen for changes in chrome.storage, and update accordingly
chrome.storage.onChanged.addListener(
    function(changes, areaName) {
        console.log(JSON.stringify(changes));

        // If state has changed for any reason, reset duration
        if (changes.state != undefined) {
            console.log("'state' has been changed, resetting stopTime");
            resetState();

        } 
        
        // If inactive, stop checking for time exceeded.
        if (changes.track != undefined) {
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

// timeRemaining(callback) accepts a callback function(t) which processes
//   the outputted time 't'. 
function timeRemaining(callback){
    chrome.storage.local.get("endTime", function(item){
        var endTime = item.endTime;
        var interval = endTime - $.now();
        if (interval < 0) {
            interval = 0;
        }
        callback(interval);
    });
}

function timeRemainingString(callback){
    timeRemaining(function(t){
        var mins = Math.floor(t / 1000 / 60);
        var secs = Math.floor(t / 1000 % 60);
        callback(mins + "m " + secs + "s");
    });
}


