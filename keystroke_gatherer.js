var keystroke_gather = {
  keystrokeCount: 0,  //The keystroke Count of the current Session

  loginData: {},  //The name and username used during login

  data: {
    "Id": null, //a unique identifier for the data collected ex timestamp-name-login base64 encoded
    "StartingEventType": 'focusin', //what triggered the program to start recording eg. focusin
    "EndingEventType": 'focusout', //what triggered the program to stop recording eg. focusout
    "StartTimestamp": null,
    "EndTimestamp": null,
    "Target": null, //The name of the person who is giving this info?
    "KeyEvents": [ //The collection of every keystroke gathered
      //      "KeyCode": evt.keyCode,
      //      "Target": evt.target.name,
      //      "Timestamp": Date.now(),
      //      "EventType": evt.type
    ],
  },

  DataString: "",
  init: function() {
    console.log('This is where I will put an intro text to the document')

    //Create the login HTML
    var loginDiv = document.createElement('div');
    loginDiv.id = "keystroke_gather_login";
    loginDiv.style = `width: 100%; height: 25px; display: flex; justify-content: space-between;`;
    loginDiv.innerHTML = `Name<input type="text" name="user" id="keystroke_name">
              Username<input type="text" name="username" id="keystroke_username">
              <input type="submit" name="keystoke_login" id="keystroke_gather_login_submit" onclick="keystroke_gather.login()">`;
    document.body.prepend(loginDiv);

    //Just to speed up the login process, login on 'enter'
    document.getElementById('keystroke_gather_login').onkeydown = function(e) {
      if (e.keyCode == 13) {
        keystroke_gather.login();
      }
    };
  },

  login: function() {
    //Gather data of Name and username;
    var keystroke_login_name = document.getElementById('keystroke_name').value;
    var keystroke_login_username = document.getElementById('keystroke_username').value;
    keystroke_gather.loginData = {
      keystroke_login_name,
      keystroke_login_username
    };

    //Delete Login Bar;
    var elem = document.getElementById('keystroke_gather_login');
    elem.parentNode.removeChild(elem);

    //create Initial Session;
    keystroke_gather.createSession();

  },

  createSession: function() {
    keystroke_gather.data.Id = Date.now() + '-' + btoa(keystroke_gather.loginData.keystroke_login_name) + '-' + btoa(keystroke_gather.loginData.keystroke_login_username);

    keystroke_gather.DataString += `{
      id:` + Date.now() + `-` + btoa(keystroke_gather.loginData.keystroke_login_name) + `-` + btoa(keystroke_gather.loginData.keystroke_login_username) + `,
      StartingEventType:focusin,
      EndingEventType:focusout,
      StartTimestamp:` + Date.now() + `,
      Target:` + window.location.href + `,
      KeyEvents:[
        `;

    //sets StartTimestamp
    keystroke_gather.data.StartTimestamp = Date.now();

    //sets the window targets
    keystroke_gather.data.target = window.location.href;

    keystroke_gather.runAnalysis();
  },

  runAnalysis: function() {
    document.addEventListener('keydown', keystroke_gather.key);
    document.addEventListener('keyup', keystroke_gather.key);
  },

  key: function(evt) {
    if(keystroke_gather.keystrokeCount >= 2000) {
      keystroke_gather.keystrokeCount = 0;
      keystroke_gather.uploadData();
    }

    //we can get the timestamp from the event or from a date.now() function. Date.now could also be used to measure differences by what time they are typing.
    //console.log(evt);
    var showPanel = document.getElementById('currentKey');
    var keystroke_obj = {
      "KeyCode": evt.keyCode,
      "Target": evt.target.name,
      "Timestamp": Date.now(),
      "EventType": evt.type
    };


    keystroke_gather.data.KeyEvents.push(keystroke_obj)
    keystroke_gather.DataString += `{
      ` + evt.keyCode + `,
      ` + evt.target.name + `,
      ` + Date.now() + `,
      ` + evt.type + `
    }
    `;


    if (evt.type == 'keydown') {
      keystroke_gather.keystrokeCount++;
      showPanel.innerHTML = evt.key;
    }
  },

  uploadData: function() {

    keystroke_gather.data.EndTimestamp = Date.now();
    keystroke_gather.DataString += `
  ],
  EndTimestamp:` + Date.now() + `
}`;

    console.log('start time' + Date.now());
    console.log(keystroke_gather.DataString);
    console.log('end time' + Date.now());
  }
}

document.addEventListener('DOMContentLoaded', keystroke_gather.init);
