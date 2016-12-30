

var jr_key = {

  count: 0,

  w: new Worker('C:/Users/Jason%20Rodriguez/Documents/8_WORK/2_RESEARCH_JAY/research-jay/work.js'),

  init: function() {

    console.log('This is where I will put an intro text to the document')
    var loginDiv = document.createElement('div');
    loginDiv.id = "keystroke_gather_login";
    loginDiv.style = `width: 100%; height: 25px; display: flex; justify-content: space-between;`;
    loginDiv.innerHTML = `Name<input type="text" name="user" id="keystroke_name">
              Username<input type="text" name="username" id="keystroke_username">
              <input type="submit" name="keystoke_login" id="keystroke_gather_login_submit" onclick="jr_key.login()">`;
    document.body.insertBefore(loginDiv, document.body.firstChild);
    document.getElementById('keystroke_username').addEventListener('keydown', function(evt) {
      if (evt.keyCode == 13) {
        document.getElementById('keystroke_gather_login_submit').click();
      }
    })

    jr_key.w.addEventListener('message', function(e) {
      switch(e.data[0]) {
        case 'runAnalysis':
        document.addEventListener('keydown', function(evt) {
          console.log(evt);
          jr_key.count++;
          document.getElementById('currentKeyCount').innerHTML = jr_key.count;
          jr_key.w.postMessage(['key',evt.which, evt.target.name,Date.now(),evt.type, evt.key])
        });
        document.addEventListener('keyup', function(evt) {
          jr_key.w.postMessage(['key',evt.which, evt.target.name,Date.now(),evt.type,evt.key])
        });
        break;
      }
    }, false);
  },

  login: function() {

    var keystroke_login_name = document.getElementById('keystroke_name').value;
    var keystroke_login_username = document.getElementById('keystroke_username').value;

    var elem = document.getElementById('keystroke_gather_login');
    elem.parentNode.removeChild(elem);

    var tarLoc = window.location.href;

    jr_key.w.postMessage(['createSession',{keystroke_login_name,keystroke_login_username,tarLoc}]);
  },



  u: function(evt) {
    if (evt === 'keyCount')
      jr_key.w.postMessage(['u','keyCount']);
  }
}
document.addEventListener('DOMContentLoaded', jr_key.init);
