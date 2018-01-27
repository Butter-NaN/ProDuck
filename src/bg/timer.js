/* Instructions for use: 
 *   
 * In the background html doc, make sure the following is included in the same
 * document as your script:
 * <script src="timer.js"></script>
 *
 * Call getState() to obtain the current state, which will a string:
 *  - "inactive" : the user has not started a timer before
 *  - "work" : currently in the 25 minute work cycle
 *  - "rest" : currently in the 5 minute rest cycle
 *
 */

//Public methods

//Returns the current state: "inactive", "work", or "rest".
function getState(){
    var startTime = parseInt($("#startTime").text());
    if (startTime === -1) {
        return "inactive";
    } 

    var timeNow = parseInt($.now());
    var MINUTE = 1000 * 60; // in milliseconds
    var elapsedTime = timeNow - startTime;
    var currentCycleTime = elapsedTime % (30 * MINUTE);
    
    console.log("Time in current cycle: " + Math.floor(currentCycleTime/(MINUTE)) + "m " + Math.floor(currentCycleTime/1000) + "s");

    if (currentCycleTime < (25 * MINUTE)) {
        return "work";
    } else {
        return "rest";
    }
}


