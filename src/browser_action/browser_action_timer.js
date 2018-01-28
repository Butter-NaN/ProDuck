// Updates time remaining in browser_action every second. 
function update_time(t){
   $("#browserActionStateTimer").text("(" + t + ")"); 
}


function timer_loop(){
    timeRemainingString(update_time);
    timeRemaining(action_time);

    setTimeout(timer_loop, 1000);
}

function action_time(t){
    var t = Math.floor(t/1000);
    var mins = Math.floor(t/60);
    var secs = t % 60;
    secs = String(secs); mins = String(mins)
    secs = secs.length < 2 ? '0' + secs : secs;
    mins = mins.length < 2 ? '0' + mins : mins;
    var timestring = mins + ':' + secs;
    chrome.storage.local.get('state',
        function(item) {
            var color = item.state == 'rest'
                ? "#008bb2" : "#b25f00";
            chrome.browserAction.setBadgeText( { 'text': timestring } );
            chrome.browserAction.setBadgeBackgroundColor( { 'color': color } );
        }
    );
}
