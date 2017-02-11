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
    pages: [1,2,3,4,5,6],
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
            which: e.which
        };
        jr_key.w.postMessage(['key', data]);
    },

    loadPage: function(page) {
        switch (page) {
            case "p5b":
            document.body.innerHTML = jr_key.p5b;
                break;
            case "p5c":
            document.body.innerHTML = jr_key.p5c;
                break;
            case "p6b":
            document.body.innerHTML = jr_key.p6b;
                break;
            case "p6c":
            document.body.innerHTML = jr_key.p6c;
                break;
            default:
            console.error('loadPage Function threw an error');
            break;
        }
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
                case 6:
                document.body.innerHTML = jr_key.p6;
                    break;
                default:
                console.error('loadPageRandomly Function threw an error');
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
        document.getElementsByTagName('button')[0].onclick = "";

        jr_key.w.postMessage(['upload']);
        jr_key.w.addEventListener('message', function(e) {
            if (e.data[0] == 'upload') {
                document.body.innerHTML = jr_key.p7;
            }
        })
    },

    p0: `    <div v-html="page_content" id="app">
        <div class="jr_login">
            <div class="input_block">
                <h1 class="center">Login</h1>
                <p>Net ID </p><input type="text" name="netID" id="login-user" value="jrod95">
                <p>Student ID #</p><input type="password" id="login-pass" value="254643473">
                <br>
                <div class="center_div">
                    <input type="submit" class="submit" onclick="jr_key.authenticate()">
                </div>
            </div>
            <hr>
            <div class="input_block">
                <h1 class="center">Create new Account</h1>
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

    p1: `<div class="jr_content_page">
            <h1>Helen Keller Introduction</h1>
            <h2> Instructions: </h2>
            <h3>Please type out the following paragraph using your computer keyboard in the window below:</h3>
            <p>“It is with a kind of fear that I begin to write the history of my life.  I have, as it were, as superstitious hesitation in lifting the veil that clings about my childhood like a golden mist. The task of writing an autobiography is a difficult one.  When I try to classify my earliest impressions, I find that fact and fancy look alike across the years that link the past with the present.  The woman paints the child’s experiences in her own fantasy.  A few impressions stand out vividly from the first years of my life; but “the shadows of the prison-house are on the rest.” Besides, many of the joys and sorrows of childhood have lost their poignancy; and many incidents of vital importance in my early education have been forgotten in the excitement of great discoveries.  In order, therefore, not to be tedious I shall try to present in a series of sketches only the episodes that seem to me to be the most interesting and important. (Keller, 1904, p. 3)”</p>
            <textarea id="p1_textarea" class="textarea"></textarea>
            <button onclick="jr_key.randomlyLoadPage()">Next</button>
        </div>`,

    p2: `<div class="jr_content_page">
            <h1>Helen Keller Conclusion</h1>
            <h2> Instructions: </h2>
            <h3>Please type out the following paragraph using your computer keyboard in the window below:</h3>
            <p>“Often when I dream, thoughts pass through my mind like cowled shadows, silent and remote, and disappear.  Perhaps they are the ghosts of thoughts that once inhabited the mind of an ancestor.  At other times, the things I have learned and the things I have been taught, drop away, as the lizard sheds its skin, and I see my soul as God sees it.  There are also rare and beautiful moments when I see and hear in Dreamland.  What if in my waking hours a sound should ring through the silent halls of hearing? What if a ray of light should flash through the darkened chambers of my soul? What would happen, I ask many and many a time.  Would the bow-and-string tension of life snap?  Would the heart, overweighted with sudden joy, stop beating for very  excess of happiness? (Keller, 1904, p. 431)”</p>
            <textarea id="p1_textarea" class="textarea"></textarea>
            <button onclick="jr_key.randomlyLoadPage()">Next</button>
        </div>`,

    p3: `<div class="jr_content_page">
            <h1> Creativity Quiz </h1>
            <h2> Instructions: </h2>
            <h3>There are over 100 alternative ways to use paper clips from their intended useage, how many you can get?  Type your ideas out in the window below as you come up with the ideas.</h3>
            <textarea id="p3_textarea" class="textarea"></textarea>
            <button onclick="jr_key.randomlyLoadPage()">Next</button>
        </div>`,

    p4: `<div class="jr_content_page">
            <h1> Deep Thought Short Essay </h1>
            <h2> Instructions: </h2>
            <h3> In at least 200 words, Type out your own answer to the question including examples, “what is intelligence?”  Type your answer out in the space below. </h3>
            <textarea id="p4_textarea" class="textarea"></textarea>
            <button onclick="jr_key.randomlyLoadPage()">Next</button>
        </div>`,

    p5: `<div class="jr_content_page">
            <h1> Band Aid Paragraph </h1>
            <h2> Instructions: </h2>
            <h3>Take the Band-Aid provided to you wrap the bandaid around the tip of your index finger as seen in the image on your right hand, apply the rest of your Band-Aid to your finger then press the next button at the bottom of the page.</h3>
            <img src="./lib/img/finger.jpg"/>
            <button onclick="jr_key.loadPage('p5b')">Next</button>
        </div>`,

    p5b: `<div class="jr_content_page">
            <h1> Band Aid Paragraph </h1>
            <h2> Instructions: </h2>
            <h3>With the Band Aid on your finger, please type out the following paragraph using your computer keyboard in the window below:</h3>
            <p>“Four score and seven years ago our fathers brought forth, upon this continent, a new nation, conceived in liberty, and dedicated to the proposition that “all men are created equal.” Now we are engaged in a great civil war, testing whether that nation, or any nation so conceived, and so dedicated, can long endure. We are met on a great battle field of that war. We come to dedicate a portion of it, as a final resting place for those who died here, that the nation might live. This we may, in all propriety do (Lincoln, 1863)”</p>
            <textarea id="p5_textarea" class="textarea"></textarea>
            <button onclick="jr_key.loadPage('p6c')">Next</button>
        </div>`,

                p6c: `<div class="jr_content_page">
                <h1> Band Aid Paragraph Paragraph </h1>
                <h3>Remove the bandaid from your finger then press the next button on the bottom of the box.</h3>
        <button onclick="jr_key.randomlyLoadPage()">Next</button>
            </div>`,

        p6: `<div class="jr_content_page">
                <h1> Tape Paragraph </h1>
                <h2> Instructions: </h2>
                <h3>Take the tape provided to you, wrap the middle and ring finger on your left hand together as shown in the image below and then click on the next button at the bottom of the page.</h3>
                <img src="./lib/img/two_fingers.jpg"/>
                <button onclick="jr_key.loadPage('p6b')">Next</button>
            </div>`,

        p6b: `<div class="jr_content_page">
                <h1> Tape Paragraph </h1>
                <h2> Instructions: </h2>
                <h3>With your fingers wrapped, please type out the following paragraph using your computer keyboard in the window below:</h3>
                <p>“But, in a larger sense, we cannot dedicate – we cannot consecrate – we cannot hallow, this ground – The brave men, living and dead, who struggled here, have hallowed it, far above our poor power to add or detract. The world will little note, nor long remember what we say here; while it can never forget what they did here. It is rather for us, the living, we here be dedicated to the great task remaining before us – that, from these honored dead we take increased devotion to that cause for which they here, gave the last full measure of devotion – that we here highly resolve these dead shall not have died in vain; that the nation, shall have a new birth of freedom, and that government of the people, by the people, for the people, shall not perish from the earth (Lincoln, 1863)”</p>
                <textarea id="p6_textarea" class="textarea"></textarea>
                <button onclick="jr_key.loadPage('p6c')">Next</button>
            </div>`,
        
        p6c: `<div class="jr_content_page">
                <h1> Tape Paragraph </h1>
                <h3>Remove the tape from your fingers then press the next button on the bottom of the box.</h3>
        <button onclick="jr_key.randomlyLoadPage()">Next</button>
            </div>`,

        p7: `<div class="jr_content_page"><h1>Thank you for Participating in this survey.</h1></div>`,
}
document.addEventListener('DOMContentLoaded', jr_key.init)