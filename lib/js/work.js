console.log('Work.js Initiated')
/**********************************************
 * Variable object to non-globalize functions *
 * @type {Object}                             *
 **********************************************/
var jr_key = {
  keystrokeCount: 0,
  currentPage: 0,
  apiKey: 'nt-qNa0ZdNPonR-ocAUj8A4R1A-hLLL-',
  URL: 'https://api.mlab.com/api/1/databases/keystroke-data/collections/',
  data: {
    "_id": null,
    "user": null,
    "p1": {
      "KeyEvents": []
    },
    "p2": {
      "KeyEvents": []
    },
    "p3": {
      "KeyEvents": []
    },
    "p4": {
      "KeyEvents": []
    },
    "p5": {
      "KeyEvents": []
    },
    "p6": {
      "KeyEvents": []
    }
  },

  recordData: function(e) {
    jr_key.data[jr_key.currentPage].KeyEvents.push(e);
  },

  /**********************************************
   * Uploads the data to the mongoDB Database   *
   * @return {void} void                        *
   **********************************************/
  uploadData: function () {
    console.log('upload Started');

    var URL = jr_key.URL + jr_key.data.user + '?apiKey=' + jr_key.apiKey;
    var DATA = jr_key.data;

    var postData = new XMLHttpRequest();

    postData.open("POST", URL);

    postData.setRequestHeader('Content-Type', 'application/json');

    postData.send(JSON.stringify(DATA));

    postData.onload = function() {
      console.log('Upload Finished', postData.readyState);
      self.postMessage(['upload']);
    }
  }
}

/******************************************************************************
 * Function switchboard that listens for input from the keystroke.js file and *
 * pipes the request to the right function                                    *
 * @type {switchboard}                                                        *
 ******************************************************************************/

self.addEventListener('message', function (e) {

  switch (e.data[0]) {

    case 'createSession':
    jr_key.data._id  = e.data[1];
    jr_key.data.user = e.data[2];
    break;

    /********************************************************************
     * Starts collecting data into a different data object              *
     * @param e.data[0] == 'newPage'
     * @param e.data[1] == currentPage {Integer}
     ********************************************************************/
    case 'newPage':
      jr_key.currentPage = "p" + e.data[1];      
      break;

    /**************************************************************
     * Gathers the keystroke data and pushes it to the data node  *
     * @param e.data[1] == event {event}
     **************************************************************/
    case 'key':
      jr_key.recordData(e.data[1]);
    break;

    case 'upload':
    jr_key.uploadData();
    break;

    case 'log':
    console.log(jr_key);
    break;
  }
});