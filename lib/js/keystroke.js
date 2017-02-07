var jr_key = {
    apiKey: 'nt-qNa0ZdNPonR-ocAUj8A4R1A-hLLL-',
    URL: 'https: //api.mlab.com/api/1/databases/keystroke-data/collections/',
    login: {},
    users: null,
    init: () => {
        console.log('init ran');
        jrkey.getUsers();
    },

    /*********************************************************
     * Gathers all the login users from databases            *
     * @returns {void}                                       *
     *********************************************************/
    getUsers: () => {
        var result     = jr_key.sendRequest('GET', jr_key.URL + 'users?apiKey = ' + jr_key.apiKey)
        var getResults = setInterval(results, 100);

        function results() {
            if (!result.responseText) { return; } else {
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
    }
}
document.addEventListener('DOMContentLoaded', jr_key.init)