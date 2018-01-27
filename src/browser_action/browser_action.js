// action for button#toggleStateButton
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

// action for spam#browser_action_state
chrome.storage.onChanged.addListener(
    function(changes, areaName) {
        var state_new = changes.state.newValue;
        console.log('storage.onChanged#anon: ' + JSON.stringify(changes));
        $("#browser_action_state").html(state_new);
    }
);

$(document).ready(
    function() { 
        console.log('$(document).ready call');
        
        // add onclick for button#toggleStateButton
        $("#toggleStateButton").click(toggle_state_callback);

        // initialise state
        chrome.storage.local.get('state',
            function(item) {
                $("#browser_action_state").html(item.state);
            }
        );
    }
);
