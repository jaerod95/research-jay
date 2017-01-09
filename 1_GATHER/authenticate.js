console.log('Authenticate.js initiated');

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