function get_state() {
    console.log('get_state');
    return chrome.storage.local.get(
        'state', function(item) { 
            console.log('get_state#anon: ' + JSON.stringify(item));
            return item.state; 
        }
    );
}

function toggle_state(last_state) {
    console.log('toggle_state: ' + last_state);
    return last_state == 'rest' ? 'work' : 'rest';
}

function toggle_state_callback() {
    console.log('toggle_state_callback');
    toggle_state(get_state());
}

// action for button#toggleStateButton
$(document).ready(function() {
    console.log('$(document).ready call');
    $("#toggleStateButton").click(toggle_state_callback);
});
