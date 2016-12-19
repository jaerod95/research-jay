var keystroke_gather = {
    data: {
        "id": "d7af3c71-771b-4666-88ee-41f736e84db1",
        "startingEventType": "focusin",
        "endingEventType": "focusout",
        "startTimestamp": 1481187131061,
        "endTimestamp": 1481187149357,
        "Target": "given-name",
        "keyEvents": [{
            "KeyCode": 65,
            "Target": "given-name",
            "Timestamp": 1481187135347,
            "EventType": "keydown"
        }, {
            "KeyCode": 65,
            "Target": "given-name",
            "Timestamp": 1481187136048,
            "EventType": "keyup"
        }, {
            "KeyCode": 66,
            "Target": "given-name",
            "Timestamp": 1481187136050,
            "EventType": "keydown"
        }, {
            "KeyCode": 66,
            "Target": "given-name",
            "Timestamp": 1481187136175,
            "EventType": "keyup"
        }, {
            "KeyCode": 67,
            "Target": "given-name",
            "Timestamp": 1481187136548,
            "EventType": "keydown"
        }, {
            "KeyCode": 67,
            "Target": "given-name",
            "Timestamp": 1481187137158,
            "EventType": "keyup"
        }, {
            "KeyCode": 68,
            "Target": "given-name",
            "Timestamp": 1481187137160,
            "EventType": "keydown"
        }, {
            "KeyCode": 68,
            "Target": "given-name",
            "Timestamp": 1481187137298,
            "EventType": "keyup"
        }, {
            "KeyCode": 69,
            "Target": "given-name",
            "Timestamp": 1481187137498,
            "EventType": "keydown"
        }, {
            "KeyCode": 69,
            "Target": "given-name",
            "Timestamp": 1481187137607,
            "EventType": "keyup"
        }, {
            "KeyCode": 70,
            "Target": "given-name",
            "Timestamp": 1481187137788,
            "EventType": "keydown"
        }, ]
    },
    init: function() {
        console.log('This init function ran!')
        var loginDiv = document.createElement('div');
        loginDiv.style = `width: 100%; height: 25px; display: flex; justify-content: space-between;`;
        loginDiv.innerHTML = `Name<input type="text" name="user" id="keystroke_name">
              Username<input type="text" name="username" id="keystroke_username">
              <input type="submit" name="keystoke_login" onclick="keystroke_gather.login()">`;
        document.body.prepend(loginDiv);
    },
    login: function() {
        console.log('this ran');
        var keystroke_login_name = document.getElementById('keystroke_name').value;
        var keystroke_login_username = document.getElementById('keystroke_username').value;
        var keystroke_login_data = {
            keystroke_login_name,
            keystroke_login_username
        };
        keystroke_gather.runAnalysis(keystroke_gather.data);

    },
    runAnalysis: function(jsondata) {
        console.log(jsondata);
    }
}

document.addEventListener('DOMContentLoaded', keystroke_gather.init);
