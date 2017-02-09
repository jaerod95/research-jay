var jr_key = {
    apiKey: 'nt-qNa0ZdNPonR-ocAUj8A4R1A-hLLL-',
    URL: 'https://api.mlab.com/api/1/databases/keystroke-data/collections/',
    login: {},
    users: null,
    w: new Worker('./lib/js/work.js'),
    pages: [1,2,3,4,5],
    currentPage: 0,

    init: function () {
        console.log('init ran');
        //jr_key.getUsers();
    },

    /*********************************************************
     * Gathers all the login users from databases            *
     * @returns {void}                                       *
     *********************************************************/
    getUsers: function () {
        $.ajax({
            url: jr_key.URL + 'users?apiKey=' + jr_key.apiKey,
            type: "GET",
            success: function (response) {
                jr_key.users = response[0].users;
            },
            error: function (data, response, err) {
                console.log(data);
                return null;
            }
        });
    },

    authenticate: function () {
        console.log('authenticate ran');
        var user = $("#login-user").val();
        var pass = $("#login-pass").val();
        var found = false;
        jr_key.users.forEach(function (element) {
            if (element.user === user && element.pass === pass) {
                jr_key.initStroke();
                found = true;
            }
        });
        if (!found) jr_key.loginErr('login');

    },
    createUser: function () {
        console.log('createUser ran');
        var name = $("#create-name").val();
        var user = $("#create-user").val();
        var pass = $("#create-pass").val();
        var found = false;
        jr_key.users.forEach(function (element) {
            if (element.user === user || element.pass === pass) {
                jr_key.loginErr('create');
                found = true;
            }
        });
        if (!found) {
            jr_key.users.push({ "name": name, "user": user, "pass": pass });

            var DATA = { "_id": "Users", "users": jr_key.users }

            $.ajax({
                url: jr_key.URL + 'users?apiKey=' + jr_key.apiKey,
                type: "POST",
                data: JSON.stringify(DATA),
                contentType: 'application/json',
                success: function (response) {
                    console.log('upload successful');
                },
                error: function (data, response, err) {
                    console.log(data);
                }
            });
        }
    },
    loginErr: function (err) {
        alert('credentials wrong');
    },
    initStroke: function () {
        jr_key.randomlyLoadPage();
        document.addEventListener('keydown' , jr_key.keyEvent);
        document.addEventListener('keyup'   , jr_key.keyEvent);
    },
    keyEvent: function(e) {
        var data = {altKey: e.altKey, bubbles: e.bubbles, cancelBubble: e.cancelBubble, cancelable: e.cancelable, charCode: e.charCode, code: e.code, composed: e.composed, ctrlKey: e.ctrlKey, currentTarget: e.currentTarget, defaultPrevented: e.defaultPrevented, detail: e.detail, eventPhase: e.eventPhase, isComposing: e.isComposing, isTrusted: e.isTrusted, key: e.key, keyCode: e.keyCode, location: e.location, metaKey: e.metaKey, /*path: e.path, */repeat: e.repeat, returnValue: e.returnValue, shiftKey: e.shiftKey, timeStamp: e.timeStamp, type: e.type, which: e.which/*,others*/};
        jr_key.w.postMessage(['key', data]);
    },
    randomlyLoadPage: function() {
        if (jr_key.pages.length == 0) jr_key.finish();
        else {
            jr_key.currentPage = jr_key.pages[Math.round((Math.random() * Date.now())) % jr_key.pages.length];
            jr_key.pages.splice(jr_key.pages.indexOf(jr_key.currentPage), 1);
            //DO SOME LOADING MAGIC
            jr_key.w.postMessage(['newPage', jr_key.currentPage])
        }
    },
    finish: function() {
        console.log('finish ran');
    }
}
document.addEventListener('DOMContentLoaded', jr_key.init)