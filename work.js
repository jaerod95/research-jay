console.log('work.js ran');

var jr_key = {
  keystrokeCount: 0,
  data          : {
    "Id"                : null,
    "StartingEventType" : 'focusin',
    "EndingEventType"   : 'focusout',
    "StartTimestamp"    : null,
    "Target"            : null,
    "KeyEvents"         : [
      // "KeyCode"      : evt.keyCode,
      // "Target"       : evt.target.name,
      // "Timestamp"    : Date.now(),
      // "EventType"    : evt.type
      // "Key"          : evt.key
    ],
    "EndTimestamp"      : null
  },


  uploadData: function() {
    jr_key.data.EndTimestamp = Date.now();
    console.log('upload Started');
     var j = JSON.stringify(jr_key.data);
     console.log(j);
     console.log('uploadEnded')

  }
}

self.addEventListener('message', function(e) {
  switch(e.data[0]) {
    case 'createSession':
    //Creates the session ID == Date-(loginName-username)b64 Encoded
    jr_key.data.Id = Date.now() + '-' + btoa(e.data[1][0]) + '-' + btoa(e.data[1][1]);
    jr_key.data.StartTimestamp = Date.now();
    jr_key.data.Target = e.data[1][2];

    self.postMessage(['runAnalysis']);
    break;
    case 'key':
    //if(jr_key.keystrokeCount >= 2000) { //This is the real data capture value
      if(jr_key.keystrokeCount >= 100) { //This is for tests
      jr_key.keystrokeCount = 0;
      jr_key.uploadData();
      jr_key.data.KeyEvents = [];
    }
    var keystroke_obj = {
      "KeyCode"   : e.data[1],
      "Target"    : e.data[2],
      "Timestamp" : e.data[3],
      "EventType" : e.data[4],
      "Key"       : e.data[5]
    };

    jr_key.data.KeyEvents.push(keystroke_obj)
    if (e.data[4] == 'keydown') {
      jr_key.keystrokeCount++;
    }
    break;
    case 'u':
    if (e.data[1] == 'keyCount')
      console.log(jr_key.keystrokeCount);
    break;
  }
}, false);
