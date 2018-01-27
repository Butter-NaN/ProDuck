function get_state() {
    return chrome.storage.local.get(
        'state', function(item) { return item.state; }
    );
}

function toggle_state(last_state) {
    return last_state == STATE_REST ? STATE_WORK : STATE_REST;
}

function toggle_state_callback() {
    toggle_state(get_state());
}
