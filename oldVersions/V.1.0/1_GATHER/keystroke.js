/**********************************************************************
*	TODO:										                                            *
* 1. Create a run time authentication program in work.js              *
**********************************************************************/

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
  w         : null,
  a         : null,

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

        case 'authenticate':

          jr_key.a.postMessage(['authenticate', jr_key.data]);
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
      console.log('Waiting for Users...');

      if (!result.responseText) {
        return
      }

      else {
        clearInterval(getResults);
        console.log('Got Users');
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


var workjs = new Blob([
  `console.log('Work.js Initiated')
/**********************************************
 * Variable object to non-globalize functions *
 * @type {Object}                             *
 **********************************************/
var jr_key = {
  number_of_collection_keystrokes: 200,
  number_of_validation_keystrokes: 20,
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
    validation    : false,



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

        if (sendData.status == 200 || sendData.status == 201)
          console.log('Upload Ended')

        else {

          console.error(registerSend.status)
          console.log('there was an error with updating the to process database');

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
        + btoa(e.data[1].keystroke_login_name)
        + '-'
        + btoa(e.data[1].keystroke_login_username);
      jr_key.data.ActingUsername = e.data[1].keystroke_login_name;
      jr_key.data.Username = e.data[1].keystroke_login_username;

      jr_key.data.StartTimestamp = Date.now();
      jr_key.data.Target = e.data[1][2];

      if (e.data[1].keystroke_login_name != e.data[1].keystroke_login_username) {
        jr_key.validation = true;
      }

      self.postMessage(['runAnalysis']);
      break;

    /**************************************************************
     * Gathers the keystroke data and pushes it to the data node  *
     **************************************************************/
    case 'key':
      if (jr_key.keystrokeCount >= jr_key.number_of_collection_keystrokes && !jr_key.validation) { //This is the real data capture value

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
      if (jr_key.keystrokeCount >= jr_key.number_of_validation_keystrokes && jr_key.validation) {
        self.postMessage(['data', jr_key.data]);
        self.postMessage(['authenticate']);
        jr_key.keystrokeCount = 0;
        jr_key.number_of_validation_keystrokes = 50;
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
});`]);

var authenticatejs = new Blob([
`console.log('Authenticate.js initiated');

var jr_a_key = {
    test_against_data       : undefined,
    test_against_analytics  : undefined,
    real_user_analytics     : undefined,
    apiKey          : 'nt-qNa0ZdNPonR-ocAUj8A4R1A-hLLL-',
    URL             : 'https://api.mlab.com/api/1/databases/keystroke-data/collections/',

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
  },

  getTestAnalytics: function() {
      jr_a_key.test_against_analytics = interpreter.init(jr_a_key.test_against_data);
  },

  authenticate: function() {
      var validData = setInterval(valid, 10);

      function valid() {
          if (!jr_a_key.test_against_analytics) {
              console.log('waiting on analytics');
            return;   
          }
          else {
              clearInterval(validData);
              console.log(jr_a_key)
          }
      }
  }
}

self.addEventListener('message', function (e) {

    switch (e.data[0]) {
        case 'authenticate':
            jr_a_key.test_against_data = e.data[1];
            jr_a_key.getTestAnalytics();


            if (!jr_a_key.real_user_analytics) {

                var response = jr_a_key.sendRequest('GET', jr_a_key.URL + 'medians?apiKey=' + jr_a_key.apiKey + '&q={"_id": "' + jr_a_key.test_against_data.Username + '"}');
                var getResults = setInterval(results, 10);

                function results() {
                    if (!response.responseText) {
                        console.log('waiting on results')
                        return;
                    }

                    else {
                        clearInterval(getResults);
                        var processResults = setInterval(parse, 10);
                        function parse() {
                            var bool = false;
                            try {
                                jr_a_key.real_user_analytics = JSON.parse(response.responseText);
                                jr_a_key.authenticate()
                                bool = true;
                            }
                            catch (e) {
                            }
                            if (bool) {
                                clearInterval(processResults);
                            }
                            return;
                        }
                    }
                }

            }


            break;

    }
});



/******************************************************************
 * Main variable to contail all funcitons out of the global scope *
 * @type {Object}                                                 *
 ******************************************************************/
var interpreter =  {
  data                     : [],
  orderedEvents            : [],
  dwell_time               : {},
  flight_time_one          : {},
  flight_time_two          : {},
  flight_time_three        : {},
  flight_time_four         : {},

    /************************************************************************
     * Organizer for All parsing and link to csv conver and master analysis *
     * @param  {Array} data  An array of JSON KeyStroke Data Files          *
     * @return {void}       void;                                           *
     ************************************************************************/
     init : function (data) {
         console.log(data)
        interpreter.data = data;
        interpreter.parse(data);
        return interpreter.mainAnalysis();

    },

    /************************************************
     * All Analysis Start Here, Calculates:         *
     *  Dwell Time,                                 *
     *  Flight Time,                                *
     *  N-Graph                                     *
     * @param  {String} str Data in String Format   *
     * @return {void}       void;                   *
     ************************************************/
    parse : function (data) {

      interpreter.orderedEvents            = interpreter.orderKeyEvents(interpreter.data.KeyEvents);
      interpreter.dwell_time               = interpreter.calculateDwellTime(interpreter.data.KeyEvents);
      interpreter.flight_time_one          = interpreter.calculateFlightTimeOne(interpreter.orderedEvents);
      interpreter.flight_time_two          = interpreter.calculateFlightTimeTwo(interpreter.orderedEvents);
      interpreter.flight_time_three        = interpreter.calculateFlightTimeThree(interpreter.orderedEvents);
      interpreter.flight_time_four         = interpreter.calculateFlightTimeFour(interpreter.orderedEvents);
    },

    /*****************************************************************************
     * Orders every keystroke Press and Release pair by Timestamp of Press       *
     * @param  {JSON} data Key Events of data                                    *
     * @return {array}     An array of JSON Objects sorted by Timestamp of Press *
     *                     [Format]   : {                                        *
     *                     Press      : Timestamp(numeric),                      *
     *                     Release    : Timestamp(numeric),                      *
     *                     allData    : [{                                       *
     *                                    EventType: ex.("keydown"),             *
     *                                    Key: ex.("T"),                         *
     *                                    KeyCode: ex.(84),                      *
     *                                    Target: ex.("question_one"),           *
     *                                    Timestamp: ex.(1483093174757)          *
     *                                   },                                      *
     *                                   {                                       *
     *                                    EventType: ex.("keyup"),               *
     *                                    Key: ex.("T"),                         *
     *                                    KeyCode: ex.(84),                      *
     *                                    Target: ex.("question_one"),           *
     *                                    Timestamp: ex.(1483093174869)          *
     *                                   }]                                      *
     *                                                                           *
     *     //8,9,10,14,15,27,32-127  POSSIBLE TO TRACK KEYS                      *
     ****************************************************************************/
    orderKeyEvents : function (data) {
        
      var result = {};
      var str = '{';

      for (var i = 0; i < data.length; i++) {
        str += '"' + data[i].Key + '": [],';
      }

      str         = str.slice(0, -1);
      str        += '}';
      result      = JSON.parse(str);
      var keyTemp = [];
      var temp    = [];

      for (var k  = data.length - 1; k >= 0; k--) {
        var index = keyTemp.indexOf(data[k].KeyCode);

        if (index != -1) {
          var dwelltime   = temp[index].Timestamp - data[k].Timestamp;
          var PressValues = [
            {
              "Press"   : data[k].Timestamp,
              "Release" : temp[index].Timestamp,
              "allData" : [data[k], data[index]]
            }
          ];

          result[data[k].Key].push(PressValues)
          temp.splice(index, 1);
          keyTemp.splice(index, 1);
        } else {
          keyTemp.push(data[k].KeyCode);
          temp.push(data[k]);
        }
      }
      var toSort = [];
      for (var value in result) {
        if (!result.hasOwnProperty(value)) {
          continue;
        }
        for (var j = 0; j < result[value].length; j++) {
          toSort.push(result[value][j][0]);
        }
      }
      interpreter.sortByKey(toSort, 'Press');
      result = toSort;
      return result;
    },

    /**********************************************************
     * Sorts an array of JSON objects by property value       *
     * @param  {array} array An Array of JSON Objects         *
     * @param  {String} key  The property you want to sort by *
     * @return {array}       The sorted Array                 *
     **********************************************************/
    sortByKey : function (array, key) {
      return array.sort(function (a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });
    },

    /********************************************************
     * Calculates the DwellTime by Key                      *
     * @param  {JSON} data KeyEvents of data                *
     * @return {JSON}      JSON object of DwellTime per Key *
     ********************************************************/
    calculateDwellTime : function (data) {
      var result  = {}
      var str     = '{'

      for (var i = 0; i < data.length; i++) {

        str += '"' + data[i].Key + '": [],';

      }

      str         = str.slice(0, -1);
      str        += '}';
      result      = JSON.parse(str);

      var keyTemp = [];
      var temp    = [];

      for (var k = data.length - 1; k >= 0; k--) {

        var index = keyTemp.indexOf(data[k].KeyCode);

        if (index != -1) {

          var dwelltime = temp[index].Timestamp - data[k].Timestamp;
          result[data[k].Key].push(dwelltime)
          temp.splice(index, 1);
          keyTemp.splice(index, 1);

        } 
        
        else {

          keyTemp.push(data[k].KeyCode);
          temp.push(data[k]);

        }
      }
      return result;
    },

    /************************************************************
     * Calculates the flight time between all key combinations, *
     * uses the formula: FTtype1,n=Pn+1−Rn.                     *
     * @param  {array} obj An ordered array of keystrokes       *
     * @return {JSON}     A JSON object of the Flight Times     *
     ************************************************************/

    calculateFlightTimeOne : function (obj) {
      var result = {};

      for (var i = 0; i < obj.length - 1; i++) {

        var flight_time   = obj[i + 1].Press - obj[i].Release;
        var from_key      = obj[i].allData[0].Key;
        var to_key        = obj[i + 1].allData[0].Key;
        var both_keys     = from_key + to_key;

        if (result.hasOwnProperty(both_keys)) {

          result[both_keys].FlightTime.push(flight_time);

        } 
        
        else {

          var temp          = { "From": from_key, "To": to_key, "FlightTime": [flight_time] };
          result[both_keys] = temp;

        }
      }
      return result;
    },

    /************************************************************
     * Calculates the flight time between all key combinations, *
     * uses the formula: FTtype2,n=Rn+1−Rn.                     *
     * @param  {array} obj An ordered array of keystrokes       *
     * @return {JSON}     A JSON object of the Flight Times     *
     ************************************************************/
    calculateFlightTimeTwo : function (obj) {
      var result = {};

      for (var i = 0; i < obj.length - 1; i++) {

        var flight_time   = obj[i + 1].Release - obj[i].Release;
        var from_key      = obj[i].allData[0].Key;
        var to_key        = obj[i + 1].allData[0].Key;
        var both_keys     = from_key + to_key;

        if (result.hasOwnProperty(both_keys)) {

          result[both_keys].FlightTime.push(flight_time);

        }
        else {

          var temp          = { "From": from_key, "To": to_key, "FlightTime": [flight_time] };
          result[both_keys] = temp;

        }
      }
      return result;
    },

    /************************************************************
     * Calculates the flight time between all key combinations, *
     * uses the formula: FTtype3,n=Pn+1−Pn.                     *
     * @param  {array} obj An ordered array of keystrokes       *
     * @return {JSON}     A JSON object of the Flight Times     *
     ************************************************************/
    calculateFlightTimeThree : function (obj) {
      var result = {};

      for (var i = 0; i < obj.length - 1; i++) {

        var flight_time   = obj[i + 1].Press - obj[i].Press;
        var from_key      = obj[i].allData[0].Key;
        var to_key        = obj[i + 1].allData[0].Key;
        var both_keys     = from_key + to_key;

        if (result.hasOwnProperty(both_keys)) {

          result[both_keys].FlightTime.push(flight_time);

        } 
        else {

          var temp          = { "From": from_key, "To": to_key, "FlightTime": [flight_time] };
          result[both_keys] = temp;

        }
      }
      return result;
    },

    /************************************************************
     * Calculates the flight time between all key combinations, *
     * uses the formula: FTtype4,n=Rn+1−Pn.                     *
     * @param  {array} obj An ordered array of keystrokes       *
     * @return {JSON}     A JSON object of the Flight Times     *
     ************************************************************/
    calculateFlightTimeFour : function (obj) {
      var result = {};

      for (var i = 0; i < obj.length - 1; i++) {

        var flight_time     = obj[i + 1].Release - obj[i].Press;
        var from_key        = obj[i].allData[0].Key;
        var to_key          = obj[i + 1].allData[0].Key;
        var both_keys       = from_key + to_key;

        if (result.hasOwnProperty(both_keys)) {

          result[both_keys].FlightTime.push(flight_time);
        } 
        else {

          var temp          = { "From": from_key, "To": to_key, "FlightTime": [flight_time] };
          result[both_keys] = temp;

        }
      }
      return result;
    },

    mainAnalysis : function () {

      var DT_M  = calculateMedianDT(interpreter.dwell_time);
      var FT1_M = calculateMedianFT(interpreter.flight_time_one);
      var FT2_M = calculateMedianFT(interpreter.flight_time_two);
      var FT3_M = calculateMedianFT(interpreter.flight_time_three);
      var FT4_M = calculateMedianFT(interpreter.flight_time_four);

      function calculateMedianDT(obj) {
        var result = {};
        for (item in obj) {
          result[item] = getMedian(obj[item]);
        }
        return result
      }

      function calculateMedianFT(obj) {
        var result = {};
        for (item in obj) {
          result[item] = getMedian(obj[item].FlightTime);
        }
        return result
      }

      function getMedian(values) {
        values.sort((a, b) => a - b);
        let lowMiddle = Math.floor((values.length - 1) / 2);
        let highMiddle = Math.ceil((values.length - 1) / 2);
        let median = (values[lowMiddle] + values[highMiddle]) / 2;
        return median
      }

      return {DT_M,FT1_M,FT3_M,FT4_M};

    }
}`
])

// Obtain a blob URL reference to our worker 'file'.
var workjsURL         = window.URL.createObjectURL(workjs);
var authenticatejsURL = window.URL.createObjectURL(authenticatejs);
jr_key.w              = new Worker(workjsURL);
jr_key.a              = new Worker(authenticatejsURL);