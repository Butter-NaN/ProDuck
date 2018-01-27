function get_state() {
    return chrome.storage.local.get(
        'state', function(item) { return item.state; }
    );
}

function toggle_state(last_state) {
    console.log("toggling state from " + last_state);
    return last_state == STATE_REST ? STATE_WORK : STATE_REST;
}

function toggle_state_callback() {
    toggle_state(get_state());
    console.log("state toggled. State is now " + get_state());
}


// action for button#toggleStateButton
$(document).ready(function() {
    $("#toggleStateButton").click(toggle_state_callback);
});
