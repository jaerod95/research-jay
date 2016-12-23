console.log('work.js ran');

var jr_key = {
  keystrokeCount: 0,
  data: {
    "Id": null,
    "StartingEventType": 'focusin',
    "EndingEventType": 'focusout',
    "StartTimestamp": null,
    "Target": null,
    "KeyEvents": [
      //      "KeyCode": evt.keyCode,
      //      "Target": evt.target.name,
      //      "Timestamp": Date.now(),
      //      "EventType": evt.type
    ],
    "EndTimestamp": null
  },
  uploadData: function() {
    console.log('upload Started');
    console.log(JSON.stringify(jr_key.data));
    console.log('upload Ended');
  }
}

self.addEventListener('message', function(e) {
  switch(e.data[0]) {
    case 'init':
    break;
    case 'login':
    break;
    case 'createSession':
    //Creates the session ID == Date-(loginName-username)b64 Encoded
    jr_key.data.Id = Date.now() + '-' + btoa(e.data[1][0]) + '-' + btoa(e.data[1][1]);
    jr_key.data.StartTimestamp = Date.now();
    jr_key.data.Target = e.data[1][2];

    self.postMessage(['runAnalysis']);
    break;
    case 'runAnalysis':
    break;
    case 'key':
    if(jr_key.keystrokeCount >= 2000) {
      jr_key.keystrokeCount = 0;
      jr_key.uploadData();
      jr_key.data.KeyEvents = [];
    }
    var keystroke_obj = {
      "KeyCode": e.data[1],
      "Target": e.data[2],
      "Timestamp": e.data[3],
      "EventType": e.data[4]
    };

    jr_key.data.KeyEvents.push(keystroke_obj)
    if (e.data[4] == 'keydown') {
      jr_key.keystrokeCount++;
    }
    break;
    case 'uploadData':
    break;
  }
}, false);
