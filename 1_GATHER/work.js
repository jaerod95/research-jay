/**
 * TO DO
 * 1.need to finish the create user part
 * 2. need to reset all the upload data info
 * 3. need to create a collection for how many data types in each section since last process.
 */
console.log('Work.js Initiated')
/**********************************************
 * Variable object to non-globalize functions *
 * @type {Object}                             *
 **********************************************/
var jr_key = {
  number_of_keystrokes: 200,
  keystrokeCount  : 0,
  apiKey          : 'nt-qNa0ZdNPonR-ocAUj8A4R1A-hLLL-',
  URL             : 'https://api.mlab.com/api/1/databases/keystroke-data/collections/',
  data            : {
                      "_id"                : null,
                      "ActingUsername"    : null,
                      "Username"          : null,
                      "StartingEventType" : 'focusin',
                      "EndingEventType"   : 'focusout',
                      "StartTimestamp"    : null,
                      "Target"            : null,
                      "KeyEvents"         : [
                      // "KeyCode"        : evt.keyCode,
                      // "Target"         : evt.target.name,
                      // "Timestamp"      : Date.now(),
                      // "EventType"      : evt.type,
                      // "Key"            : evt.key
                      ],
                      "EndTimestamp"      : null
                    },

  /**********************************************
   * Uploads the data to the mongoDB Database   *
   * @return {void} void                        *
   **********************************************/
  uploadData: function () {

    //self.postMessage(['data', jr_key.data]); //this is for localizing the data if you would like to see it for debugging.
    jr_key.data.EndTimestamp = Date.now();
    console.log('upload Started');
    var DATA = jr_key.data;

    var sendData = jr_key.sendRequest('POST', jr_key.URL + DATA.Username + '-AS-' + DATA.ActingUsername + '?apiKey=' + jr_key.apiKey, JSON.stringify(DATA));
    var getResults2 = setInterval(results2, 100);

    function results2() {

      if (!sendData.responseText) {
        return
      }

      else {

        clearInterval(getResults2);

        if (sendData.status == 200 || sendData.status == 201) {

          console.log('Upload Ended')
          var registerSend = jr_key.sendRequest('POST', jr_key.URL + 'to-process?apiKey=' + jr_key.apiKey, JSON.stringify({"_id" : DATA._id}));
          var getResults1 = setInterval(results1, 100);

          function results1() {

            if (!registerSend.responseText) {
              return
            }

            else {

              clearInterval(getResults1);

              if (registerSend.status == 200 || registerSend.status == 201) {

                console.log('to-process uploaded');

              } 
              
              else {

                console.error(registerSend.status)
                console.log('there was an error with updating the to process database');

              }
            }
          }
        }

        else {

          console.log(sendData.status);
          console.log(sendData.responseText);
          console.log('Second Upload Failed')

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
  sendRequest: function (TYPE, URL, DATA) {

    var getData = new XMLHttpRequest();

    getData.open(TYPE, URL);

    getData.setRequestHeader('Content-Type', 'application/json');

    getData.send(DATA)

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

      jr_key.data._id = Date.now()
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
      if (jr_key.keystrokeCount >= jr_key.number_of_keystrokes) { //This is the real data capture value
        jr_key.uploadData();

        jr_key.data._id = Date.now()
        + '-'
        + btoa(jr_key.data.ActingUsername)
        + '-'
        + btoa(jr_key.data.Username);

      jr_key.data.StartTimestamp = Date.now();
      jr_key.data.KeyEvents = [];
      jr_key.keystrokeCount = 0;
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
  }
});