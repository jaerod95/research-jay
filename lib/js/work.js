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
    }
  },

  recordData: function(e) {
    console.log(jr_key.data[jr_key.currentPage]);
    //jr_key.data[]
  },

  /**********************************************
   * Uploads the data to the mongoDB Database   *
   * @return {void} void                        *
   **********************************************/
  uploadData: function () {
    console.log('upload Started');
    var DATA = jr_key.data;

    $.ajax({
      url: jr_key.URL + DATA.user + '?apiKey=' + jr_key.apiKey,
      type: "POST",
      data: JSON.stringify(jr_key.data),
      contentType: 'application/json',
      success: function (response) {
        console.log('upload ended');
        console.log(response);
      },
      error: function (err, response, lol) {
        console.log('there was an error with updating the to process database');
        console.log([err, response, lol]);
      }
    });
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
     * Starts collecting data into a different data object              *
     * @param e.data[0] == 'newPage'
     * @param e.data[1] == currentPage {Integer}
     ********************************************************************/
    case 'newPage':
      jr_key.currentPage = "p" + e.data[1];
      //setInput();
      
      break;

    /**************************************************************
     * Gathers the keystroke data and pushes it to the data node  *
     * @param e.data[1] == event {event}
     **************************************************************/
    case 'key':
      recordData(e.data[1]);
    break;
  }
});