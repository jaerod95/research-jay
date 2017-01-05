/********************************************
 * TODO: Upload the new worker url          *
 ********************************************/

/**********************************************
 * Variable object to non-globalize functions *
 * @type {Object}                             *
 **********************************************/
var jr_key  = {
  count     : 0,
  data      : {},
  apiKey    : 'nt-qNa0ZdNPonR-ocAUj8A4R1A-hLLL-',
  URL       : 'https://api.mlab.com/api/1/databases/keystroke-data/collections/',
  users     : undefined,
  w         : new Worker('https://cdn.rawgit.com/jaerod95/research-jay/master/work.js'),

  /*********************************************************
   * Creates the login bar at the top of the html document *
   * @returns {void}                                       *
   *********************************************************/
  init: function () {

    jr_key.getUsers();

    console.log('This is where I will put an intro text to the document')

    var loginDiv = document.createElement('div');

    loginDiv.id = "keystroke_gather_login";

    loginDiv.style = `width: 100%; height: 25px; display: flex; justify-content: space-between;`;

    loginDiv.innerHTML = `
    Acting Username
    <div style="display:flex; flex-direction: column;">
      <input type="text" name="user" id="keystroke_name">
      <div style="color: #BD362F;" id="keystroke_error_message_username">
      </div>
    </div>
    Username
    <div style="display:flex; flex-direction: column;">
      <input type="text" name="username" id="keystroke_username">
      <div style="color: #BD362F;" id="keystroke_error_message_user">
      </div>
    </div>
    <input type="submit" name="keystoke_login" id="keystroke_gather_login_submit" onclick="jr_key.login()">
     `;

    document.body.insertBefore(loginDiv, document.body.firstChild);

    document.getElementById('keystroke_username').addEventListener('keydown', function (evt) {
      if (evt.keyCode == 13) {
        document.getElementById('keystroke_gather_login_submit').click();
      }
    });

    jr_key.w.addEventListener('message', function (e) {

      switch (e.data[0]) {

        case 'runAnalysis':

          document.addEventListener('keydown', function (evt) {
            //console.log(evt); This is for seeing each individual keytroke data.
            jr_key.count++;
            document.getElementById('currentKeyCount').innerHTML = jr_key.count;
            jr_key.w.postMessage(['key', evt.which, evt.target.name, Date.now(), evt.type, evt.key])
          });
          document.addEventListener('keyup', function (evt) {
            jr_key.w.postMessage(['key', evt.which, evt.target.name, Date.now(), evt.type, evt.key])
          });
          break;

        case 'data':

          jr_key.data = e.data[1];
          break;

        case 'console':

          console.log(e.data[1]);
          break;
      }
    }, false);
  },

  /*********************************************************
   * Gathers all the login users from databases            *
   * @returns {void}                                       *
   *********************************************************/
  getUsers: function () {
    var result      = jr_key.sendRequest('GET', jr_key.URL + 'users?apiKey=' + jr_key.apiKey)
    var getResults  = setInterval(results, 100);

    function results() {

      if (!result.responseText) {
        return
      }

      else {
        clearInterval(getResults);
        var response = JSON.parse(result.responseText);
        jr_key.users = response[0].users;
      }
    }
  },

  /*********************************************************
   * Validates the login and checks to make sure the       *
   * Username and test username are both valid             *
   * @returns {void}                                       *
   *********************************************************/
  login: function () {

    var keystroke_login_name      = document.getElementById('keystroke_name').value;
    var keystroke_login_username  = document.getElementById('keystroke_username').value;

    var getResults = setInterval(results, 100);

    /*********************************************************
     * Waits for the http request to get results then        *
     * tests the response to see if input username and user  *
     * are valid                                             *
     * @returns {void}                                       *
     *********************************************************/
    function results() {

      if (!jr_key.users) {
        return
      }

      else {
        clearInterval(getResults);

        document.getElementById('keystroke_error_message_username').innerHTML = '';
        document.getElementById('keystroke_error_message_user').innerHTML     = '';

        var err1, err2 = false;

        var res  = jr_key.users.find(function (e) { return e == keystroke_login_name })
        var res2 = jr_key.users.find(function (e) { return e == keystroke_login_username })

        if (!jr_key.users.find(function (e) { return e == keystroke_login_name })) {
          err1 = true;
          document.getElementById('keystroke_error_message_username').innerHTML = 'Incorrect Acting Name'
        }

        if (!jr_key.users.find(function (e) { return e == keystroke_login_username })) {
          err2 = true;
          document.getElementById('keystroke_error_message_user').innerHTML = 'Incorrect Username'
        }

        if (!err1 && !err2) {
          var elem = document.getElementById('keystroke_gather_login');
          elem.parentNode.removeChild(elem);
          var tarLoc = window.location.href;
          jr_key.w.postMessage(['createSession', { keystroke_login_name, keystroke_login_username, tarLoc }]);
        }
      }
    }
  },

  /*************************************************************
   * Sends an http request to the url with the determined type *
   * @param {String} TYPE                                      *
   * @param {String} URL                                       *
   * @returns XMLHttpRequestResult                             * 
   *************************************************************/
  sendRequest: function (TYPE, URL) {

    var getData = new XMLHttpRequest();

    getData.open(TYPE, URL);

    getData.setRequestHeader('Content-Type', 'application/json');

    getData.send();

    return getData;
  }
}
document.addEventListener('DOMContentLoaded', jr_key.init);