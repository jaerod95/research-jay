var jr_key = {
    apiKey: 'nt-qNa0ZdNPonR-ocAUj8A4R1A-hLLL-',
    URL: 'https://api.mlab.com/api/1/databases/keystroke-data/collections/',
    login: {},
    users: {},
    init: () => {
        console.log('init ran');
        jr_key.getUsers();
    },

    /*********************************************************
     * Gathers all the login users from databases            *
     * @returns {void}                                       *
     *********************************************************/
    getUsers: () => {
        var result     = jr_key.sendRequest('GET', jr_key.URL + 'users?apiKey = ' + jr_key.apiKey)
        console.log(result);
        var getResults = setInterval(results, 100);

        function results() {
            if (!result) { console.log('no results yet'); return; } else {
                clearInterval(getResults);
                var response = JSON.parse(result.responseText);
                jr_key.users = response[0].users;
            }
        }
    },

    authenticate: () => {
        console.log('authenticate ran');
    },
    createUser: () => {
        console.log("create ran");
    },
    
  /*************************************************************
   * Sends an http request to the url with the determined type *
   * @param {String} TYPE                                      *
   * @param {String} URL                                       *
   * @returns XMLHttpRequestResult                             * 
   *************************************************************/
  sendRequest: function (TYPE, URL) {

      $.ajax({
          url: URL,
          type: TYPE,
          success: (response, status, req) => {
            console.log(response);
            console.log(status);
            console.log(req);
            return response;
          },
          error: (res, err, error) => {
              console.log(res);
              console.log(err);
              console.log(error);
            return res;
          }
      });
  }
}
document.addEventListener('DOMContentLoaded', jr_key.init)