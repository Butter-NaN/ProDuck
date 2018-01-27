function toggle_state_callback() {
    chrome.storage.local.get('state', 
        function(item) { 
            var last_state = item.state;
            var next_state = last_state == 'rest' ? 'work' : 'rest';
            console.log(
                'toggle_state_callback#(last_state, next_state): ' + 
                '('  + last_state +
                ', ' + next_state + ')'
            );
            chrome.storage.local.set( { 'state': next_state } );
        }
    );
}

function start_timer(){
    var timeNow = $.now();
    console.log("Starting timer - time now is " + timeNow + "ms.");
    chrome.runtime.sendMessage({"message": "startTimer", "time": timeNow})
}

function stop_timer(){
    console.log("Stopping timer");
    chrome.runtime.sendMessage({"message": "stopTimer"});
}

// action for button#toggleStateButton
$(document).ready(function() {
    console.log('$(document).ready call');
    $("#toggleStateButton").click(toggle_state_callback);
    $("#startTimerButton").click(start_timer);
    $("#stopTimerButton").click(stop_timer);
});
