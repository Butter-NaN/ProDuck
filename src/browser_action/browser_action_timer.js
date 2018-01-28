// Updates time remaining in browser_action every second. 
function update_time(t){
   $("#browserActionStateTimer").text("(" + t + ")"); 
}


function timer_loop(){
    timeRemainingString(update_time);

    setTimeout(timer_loop, 1000);
}

