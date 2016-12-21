var keystroke_gather = {
    template: {
      "id": null,                 //a unique identifier for the data collected ex timestamp-name 8 encoded
      "startingEventType": null,  //what triggered the program to start recording eg. focusin
      "endingEventType": null,    //what triggered the program to stop recording eg. focusout
      "Target": null,             //The name of the person who is giving this info?
      "keyEvents": [              //The collection of every keystroke gathered
        {
          "keyCode": null,
          "Target": null,
          "Timestamp": null,
          "EventType": null
        }
      ]
    },
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
        console.log('This is where I will put an intro text to the document')
        var loginDiv = document.createElement('div');
        loginDiv.id = "keystroke_gather_login";
        loginDiv.style = `width: 100%; height: 25px; display: flex; justify-content: space-between;`;
        loginDiv.innerHTML = `Name<input type="text" name="user" id="keystroke_name">
              Username<input type="text" name="username" id="keystroke_username">
              <input type="submit" name="keystoke_login" onclick="keystroke_gather.login()">`;
        document.body.prepend(loginDiv);
        document.getElementById('keystroke_gather_login').onkeydown = function(e){
          if(e.keyCode == 13) {
              keystoke_gather.login();
            }
};
    },
    login: function() {
        console.log('this ran');
        var keystroke_login_name = document.getElementById('keystroke_name').value;
        var keystroke_login_username = document.getElementById('keystroke_username').value;
        var keystroke_login_data = {
            keystroke_login_name,
            keystroke_login_username
        };
        var elem = document.getElementById('keystroke_gather_login');
        elem.parentNode.removeChild(elem);
        keystroke_gather.runAnalysis(keystroke_gather.data);

    },
    runAnalysis: function(jsondata) {
        document.addEventListener('keydown', keystroke_gather.key);
        document.addEventListener('keyup', keystroke_gather.key);
    },
    key: function(evt) {
      //we can get the timestamp from the event or from a date.now() function. Date.now could also be used to measure differences by what time they are typing.
      console.log(evt);
      var showPanel = document.getElementById('currentKey');
      var keystroke_obj = {
        "keyCode": evt.keyCode,
        "Target": evt.target.localName,
        "Timestamp": Date.now(),
        "EventType": evt.type
      };
      keystroke_gather.template.keyEvents.push(keystroke_obj)
      if (evt.type == 'keyup') {
        showPanel.innerHTML = "";
      }
      if (evt.type == 'keydown') {
        showPanel.innerHTML = evt.key;
      }
    }
}

document.addEventListener('DOMContentLoaded', keystroke_gather.init);
