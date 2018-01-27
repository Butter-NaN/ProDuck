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

// action for button#toggleStateButton
$(document).ready(function() {
    console.log('$(document).ready call');
    $("#toggleStateButton").click(toggle_state_callback);
});
