var jr_key = {
    apiKey: 'nt-qNa0ZdNPonR-ocAUj8A4R1A-hLLL-',
    URL: 'https://api.mlab.com/api/1/databases/keystroke-data/collections/',
    login: {},
    users: [{   
            name: "Jason Rodriguez",
            pass: "254643473",
            user: "jrod95"
            }],
    w: new Worker('./lib/js/work.js'),
    pages: [1,2,3,4,5],
    currentPage: 0,

    /*********************************************************
     * API Request to get login data from database           *
     * @returns {void}                                       *
     *********************************************************/
    init: function () {
        console.log('init ran');
        document.body.innerHTML = jr_key.p0;
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

    
    /*********************************************************
     * Authenticates the user credentials by checking them   *
     * across the login data retreived from the database     *
     * @returns {void}                                       *
     *********************************************************/
    authenticate: function () {
        console.log('authenticate ran');
        var user = $("#login-user").val();
        var pass = $("#login-pass").val();
        var found = false;
        jr_key.users.forEach(function (element) {
            if (element.user === user && element.pass === pass) {
                jr_key.initStroke(user);
                found = true;
            }
        });
        if (!found) jr_key.loginErr('login');
    },

    /***************************************************************
     * Checks for user in the database and creates it if not found *
     * @returns {void}                                             *
     ***************************************************************/
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

    /***************************************************************
     * FILLER TEXT FILLER TEXT FILLER TEXT FILLER TEXT FILLER TEXT *
     * @returns {void}                                             *
     ***************************************************************/
    loginErr: function (err) {
        alert('credentials wrong');
    },

    /***************************************************************
     * FILLER TEXT FILLER TEXT FILLER TEXT FILLER TEXT FILLER TEXT *
     * @returns {void}                                             *
     ***************************************************************/
    initStroke: function (user) {
        jr_key.w.postMessage(['createSession', user + '-' + Date.now(), user])
        jr_key.randomlyLoadPage();
        document.addEventListener('keydown' , jr_key.keyEvent);
        document.addEventListener('keyup'   , jr_key.keyEvent);
    },

    /***************************************************************
     * FILLER TEXT FILLER TEXT FILLER TEXT FILLER TEXT FILLER TEXT *
     * @returns {void}                                             *
     ***************************************************************/
    keyEvent: function(e) {
        console.log(e);
        var data = {
            altKey: e.altKey,
            bubbles: e.bubbles,
            cancelBubble: e.cancelBubble,
            cancelable: e.cancelable,
            charCode: e.charCode,
            code: e.code,
            composed: e.composed,
            ctrlKey: e.ctrlKey,
            defaultPrevented: e.defaultPrevented,
            detail: e.detail,
            eventPhase: e.eventPhase,
            isComposing: e.isComposing,
            isTrusted: e.isTrusted,
            key: e.key,
            keyCode: e.keyCode,
            location: e.location,
            metaKey: e.metaKey,
            repeat: e.repeat,
            returnValue: e.returnValue,
            shiftKey: e.shiftKey,
            target: e.target.localName + '#' + e.target.id + '.' + e.target.class,
            timeStamp: e.timeStamp,
            localTimeStamp: Date.now(),
            type: e.type,
            which: e.which/*,others*/
        };
        console.log(data);
        jr_key.w.postMessage(['key', data]);
    },

    /***************************************************************
     * FILLER TEXT FILLER TEXT FILLER TEXT FILLER TEXT FILLER TEXT *
     * @returns {void}                                             *
     ***************************************************************/
    randomlyLoadPage: function() {
        if (jr_key.pages.length == 0) jr_key.finish();
        else {
            jr_key.currentPage = jr_key.pages[Math.round((Math.random() * Date.now())) % jr_key.pages.length];
            jr_key.pages.splice(jr_key.pages.indexOf(jr_key.currentPage), 1);
            switch (jr_key.currentPage) {
                case 1:
                    document.body.innerHTML = jr_key.p1;
                    break;
                case 2:
                document.body.innerHTML = jr_key.p2;
                    break;
                case 3:
                document.body.innerHTML = jr_key.p3;
                    break;
                case 4:
                document.body.innerHTML = jr_key.p4;
                    break;
                case 5:
                document.body.innerHTML = jr_key.p5;
                    break;
            }
            jr_key.w.postMessage(['newPage', jr_key.currentPage])
        }
    },

    /***************************************************************
     * FILLER TEXT FILLER TEXT FILLER TEXT FILLER TEXT FILLER TEXT *
     * @returns {void}                                             *
     ***************************************************************/
    finish: function() {
        console.log('finish ran');
        document.body.innerHTML = jr_key.p6;
        jr_key.w.postMessage(['upload']);
    },

    p0: `    <div v-html="page_content" id="app">
        <div class="jr_login">
            <div class="input_block">
                <h3 class="center">Login</h3>
                <p>Net ID </p><input type="text" name="netID" id="login-user" value="jrod95">
                <p>Student ID #</p><input type="password" id="login-pass" value="254643473">
                <br>
                <div class="center_div">
                    <input type="submit" class="submit" onclick="jr_key.authenticate()">
                </div>
            </div>
            <hr>
            <div class="input_block">
                <h3 class="center">Create new Account</h3>
                <p>Full Name</p><input type="text" name="full_name" id="create-name">
                <p>Net ID </p><input type="text" name="netID" id="create-user"> (this will be your username)
                <p>Student ID #</p><input type="password" id="create-pass"> (This will be your password);
                <br>
                <div class="center_div">
                    <input type="submit" class="submit" onclick="jr_key.createUser()">
                </div>
            </div>
        </div>
</div>`,

    p1: `<div style="width: 90%; height: 90%; background: #ccc;"><h1>FILLER PAGE 1</h1><button onclick="jr_key.randomlyLoadPage()">Next</button></div>`,
    p2: `<div style="width: 90%; height: 90%; background: #ccc;"><h1>FILLER PAGE 2</h1><button onclick="jr_key.randomlyLoadPage()">Next</button></div>`,
    p3: `<div style="width: 90%; height: 90%; background: #ccc;"><h1>FILLER PAGE 3</h1><button onclick="jr_key.randomlyLoadPage()">Next</button></div>`,
    p4: `<div style="width: 90%; height: 90%; background: #ccc;"><h1>FILLER PAGE 4</h1><button onclick="jr_key.randomlyLoadPage()">Next</button></div>`,
    p5: `<div style="width: 90%; height: 90%; background: #ccc;"><h1>FILLER PAGE 5</h1><button onclick="jr_key.randomlyLoadPage()">Next</button></div>`,
    p6: `<div style="width: 90%; height: 90%; background: #ccc;"><h1>FINISH PAGE</h1></div>`,
}
document.addEventListener('DOMContentLoaded', jr_key.init)