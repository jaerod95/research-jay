/**
 * TO DO
 * 1.need to finish the create user part
 * 2. need to reset all the upload data info
 * 3. need to create a collection for how many data types in each section since last process.
 */
const apiKey = 'nt-qNa0ZdNPonR-ocAUj8A4R1A-hLLL-';
var URL = 'https://api.mlab.com/api/1/databases/keystroke-data/collections/';

/**********************************************
 * Variable object to non-globalize functions *
 * @type {Object}                             *
 **********************************************/
var jr_key = {
  keystrokeCount: 0,
  data: {
    "Id": null,
    "ActingUsername": null,
    "Username": null,
    "StartingEventType": 'focusin',
    "EndingEventType": 'focusout',
    "StartTimestamp": null,
    "Target": null,
    "KeyEvents": [
      // "KeyCode"      : evt.keyCode,
      // "Target"       : evt.target.name,
      // "Timestamp"    : Date.now(),
      // "EventType"    : evt.type
      // "Key"          : evt.key
    ],
    "EndTimestamp": null
  },

  /**********************************************
   * Uploads the data to the mongoDB Database   *
   * @return {void} void                        *
   **********************************************/
  uploadData: function () {

    self.postMessage(['data', jr_key.data]);

    jr_key.data.EndTimestamp = Date.now();
    console.log('upload Started');


    var getData = jr_key.sendRequest('GET', URL + jr_key.data.Username + '?apiKey=' + apiKey + '&q={"_id":"' + jr_key.data.Username + '-data-files"}');

    if (getData.status === 200) {
      var response = JSON.parse(getData.responseText);
      var TYPE = null;
      console.log(response);
      if (!response[0]) {
        console.log('DNE');
        TYPE = 'POST';
        response = {};
        response['_id'] = jr_key.data.Username + '-data-files';
        response[jr_key.data.ActingUsername] = [jr_key.data];

        jr_key.createUser();

      }
      else if (response[0][jr_key.data.ActingUsername]) {
        TYPE = 'PUT';
        response[0][jr_key.data.ActingUsername].push(jr_key.data);
      } else {
        TYPE = 'PUT'
        response[0][jr_key.data.ActingUsername] = [jr_key.data];
      }

      var data = JSON.stringify(response);
      var sendData = jr_key.sendRequest(TYPE, URL + jr_key.data.Username + '?apiKey=' + apiKey);

      if (sendData.status == 200 || sendData.status == 201) {
        console.log(sendData.responseText);
      } else {
        console.log(sendData.status);
        console.log(sendData.responseText);
      }
    }
    else if (getData.status !== 200) {
      console.log('Request failed.  Returned status of ' + getData.status);
      console.log(getData.responseText)
    }
  },
  //NEED TO FINISH THIS
  createUser: function () {

    var getData = new XMLHttpRequest();
    var sendData = new XMLHttpRequest();

    getData.open('GET', URL + 'users?apiKey=' + apiKey + '&q={"_id":"Users"}');

    getData.setRequestHeader('Content-Type', 'application/json');

    getData.onload = function () {

      if (getData.status === 200) {

        var response = JSON.parse(getData.responseText);
        var TYPE = null;
        console.log(response);
        response[0][users].push(jr_key.data.Username);

        var data = JSON.stringify(response);

        sendData.open(TYPE, URL + jr_key.data.Username + '?apiKey=' + apiKey);
        sendData.setRequestHeader('Content-Type', 'application/json');
        sendData.onload = function () {

          if (sendData.status == 200 || sendData.status == 201) {
            console.log(sendData.responseText);
          } else {
            console.log(sendData.status);
            console.log(sendData.responseText);
          }
        };
        sendData.send(data);
      }

      else if (getData.status !== 200) {
        console.log('Request failed.  Returned status of ' + getData.status);
        console.log(getData.responseText)
      }
    };
    getData.send();

    //old
    var createUser = new XMLHttpRequest();
    createUser.open('PUT', URL + 'users?apiKey=' + apiKey + '&q={"_id":"Users"}');
    createUser.setRequestHeader('Content-Type', 'application/json');

    createUser.onload = function () {
      if (createUser.status == 200 || createUser.status == 201) {
        console.log(createUser.responseText);
      }
      else {
        console.log(createUser.status);
        console.log(createUser.responseText);
      }
    }
    var temp = {};
    temp["_id"] = 'Users';
    temp["users"] = [""];
    var data = JSON.stringify(temp);
    createUser.send(data);
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

    getData.send()
    
    return getData
  }
}

/******************************************************************************
 * Function switchboard that listens for input from the keystroke.js file and *
 * pipes the request to the right function                                    *
 * @type {switchboard}                                                        *
 ******************************************************************************/

self.addEventListener('message', function (e) {
  switch (e.data[0]) {

    /********************************************************************
     * //Creates the session ID == Date-(loginName-username)b64 Encoded *
     ********************************************************************/
    case 'createSession':

      jr_key.data.Id = Date.now()
        + '-'
        + btoa(e.data[1][0])
        + '-'
        + btoa(e.data[1][1]);
      jr_key.data.ActingUsername = e.data[1].keystroke_login_name;
      jr_key.data.Username = e.data[1].keystroke_login_username;

      jr_key.data.StartTimestamp = Date.now();
      jr_key.data.Target = e.data[1][2];

      self.postMessage(['runAnalysis']);
      break;

    /**************************************************************
     * Gathers the keystroke data and pushes it to the data node  *
     **************************************************************/
    case 'key':
      //if(jr_key.keystrokeCount >= 2000)  //This is the real data capture value
      if (jr_key.keystrokeCount >= 10) { //This is for tests
        jr_key.keystrokeCount = 0;
        jr_key.uploadData();
        jr_key.data.KeyEvents = [];
      }
      var keystroke_obj = {
        "KeyCode": e.data[1],
        "Target": e.data[2],
        "Timestamp": e.data[3],
        "EventType": e.data[4],
        "Key": e.data[5]
      };

      jr_key.data.KeyEvents.push(keystroke_obj)
      if (e.data[4] == 'keydown') {
        jr_key.keystrokeCount++;
      }
      break;
  }
});
