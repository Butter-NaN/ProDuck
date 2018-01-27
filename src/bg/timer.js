/*
Timer:
- stores a variable "endTime" in chrome storage, which is an integer time
  in milliseconds since epoch that the current state is supposed to end at.

- Provides function resetState(), which resets the duration of the current state

- Provides function toggleState(), which toggles the current state

- Provides function finishState(), which toggles state then calls resetState().

- 


*/
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
