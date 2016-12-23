var jr_key = {

  w: new Worker('work.js'),

  init: function() {

    console.log('This is where I will put an intro text to the document')
    var loginDiv = document.createElement('div');
    loginDiv.id = "keystroke_gather_login";
    loginDiv.style = `width: 100%; height: 25px; display: flex; justify-content: space-between;`;
    loginDiv.innerHTML = `Name<input type="text" name="user" id="keystroke_name">
              Username<input type="text" name="username" id="keystroke_username">
              <input type="submit" name="keystoke_login" id="keystroke_gather_login_submit" onclick="jr_key.login()">`;
    document.body.prepend(loginDiv);

    jr_key.w.addEventListener('message', function(e) {
      switch(e.data[0]) {
        case 'runAnalysis':
        document.addEventListener('keydown', function(evt) {
          jr_key.w.postMessage(['key',evt.keyCode, evt.target.name,Date.now(),evt.type])
        });
        document.addEventListener('keyup', function(evt) {
          jr_key.w.postMessage(['key',evt.keyCode, evt.target.name,Date.now(),evt.type])
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
