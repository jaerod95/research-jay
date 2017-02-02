console.log('Authenticate.js initiated');

var jr_a_key = {
    test_against_data       : undefined,
    test_against_analytics  : undefined,
    real_user_analytics     : undefined,
    passScore               : .7,
    indexThreshold          : 50,
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
              console.log('Got the data structures.');
              console.log(jr_a_key);
              for (obj in jr_a_key.test_against_analytics) {

              }
//WORRRRRRRRRRRRRRRRRRRRKKKKKKKKKKKKKKKKKK
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
            console.log('waiting on real median data Rrsults');
            return;
          }

          else {
            clearInterval(getResults);
            console.log('Got real meadina data results');
            var processResults = setInterval(parse, 10);

            function parse() {
              var bool = false;
              try {
                jr_a_key.real_user_analytics = JSON.parse(response.responseText);
                jr_a_key.authenticate()
                bool = true;
              }
              catch (e) {
                "parse didn't work...";
              }
              if (bool) {
                clearInterval(processResults);
              }
              return;
            }


          }
        }

      } else {
        jr_a_key.authenticate();
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
}