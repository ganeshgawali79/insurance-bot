

// add back here Twana
// Cloudant connections ======================================================================
// Cloudant VCAP setup
var Cloudant    = require('cloudant');
var username    = process.env.cloudant_username;
var password    = process.env.cloudant_password;


// Initialize the library with CloudCo account.
var cloudant = Cloudant({
    account: username,
    password: password
});


//use Insurance DB
var cloudantDatabase = cloudant.db.use("insurance");


module.exports = function(app, passport) {




    // Normal routes before login ===============================================================
    app.get("/", function (req, res) {
        res.render('index', {
            title: 'Home',
            page: 'homePage'
        });
    });


    // LOGOUT ===============================================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });




    //All member policies ===============================================================
    app.get("/member-policies", isLoggedIn, function (req, res) {
        cloudantDatabase.find({
            selector: {
                payer_name:  (!req.query.payername) ? 'Tom Murphy' : req.query.payername
            },
        }, function (er, result) {
            if (er) {
                throw er;
            }

            console.log('Found %d documents', result.docs.length);
            for (var i = 0; i < result.docs.length; i++) {
                //console.log('  Doc id: %s', result.docs[i]._id);

                res.render('member-policies', {
                    title: 'Policy Member',
                    page: 'member',
                    memberData: result.docs[i]
                });
            }
        });

    });


    //Health Insurance page ===============================================================
    app.get("/health", function (req, res) {
        cloudantDatabase.find({
            selector: {
                payer_name: (!req.query.payername) ? 'Tom Murphy' : req.query.payername
            }
        }, function (er, result) {
            if (er) {
                throw er;
            }

            console.log('Found %d documents', result.docs.length);
            for (var i = 0; i < result.docs.length; i++) {
                //console.log('  Doc id: %s', result.docs[i]._id);

                res.render('health', {
                    title: 'Health Member',
                    page: 'health',
                    memberData: result.docs[i]
                });
            }
        });

    });


    //Home insurance page ===============================================================
    app.get("/home", function (req, res) {
        cloudantDatabase.find({
            selector: {
                payer_name: (!req.query.payername) ? 'Tom Murphy' : req.query.payername
            }
        }, function (er, result) {
            if (er) {
                throw er;
            }

            console.log('Found %d documents', result.docs.length);
            for (var i = 0; i < result.docs.length; i++) {
                //console.log('  Doc id: %s', result.docs[i]._id);

                res.render('home', {
                    title: 'Home Policy',
                    page: 'home',
                    memberData: result.docs[i]
                });
            }
        });

    });

    //Car insurance page ===============================================================
    app.get("/auto", function (req, res) {
        cloudantDatabase.find({
            selector: {
                payer_name: (!req.query.payername) ? 'Tom Murphy' : req.query.payername
            }
        }, function (er, result) {
            if (er) {
                throw er;
            }

            console.log('Found %d documents', result.docs.length);
            for (var i = 0; i < result.docs.length; i++) {
                //console.log('  Doc id: %s', result.docs[i]._id);

                res.render('auto', {
                    title: 'Auto Policy',
                    page: 'auto',
                    memberData: result.docs[i]
                });
            }
        });

    });










    /*



     // signup (Working copy) ===============================================================
    app.get("/signup", function (req, res) {
        res.render('signup', {
            title: 'Signup',
            page: 'signup',
            message: ''
        });
    });


    // process the signup form (Working copy)  ===============================================================
    app.post('/signup', function(req, res){

        var fullName = req.body.userName;
        var userEmail = req.body.userEmail;
        var userPassword = req.body.userPassword;
        var userConfPassword = req.body.userConfPassword;

        var userData = { 'Full_Name': fullName, 'email_id' : userEmail, 'password' : userPassword, 'confPassword' : userConfPassword, 'time_date_logged': new Date() };
        cloudantDatabase.insert(userData, function(err, body, header) {
            if (!err) {
                console.log('Added new user, Name: ' + fullName + ' Email' + userEmail +  ' Password: ' + userPassword + ' Conf Password: ' + userConfPassword);
                res.redirect('/member-policies');
            }
        });
    });



         app.get('/signup', function(req, res) {
         res.render('signup.ejs', { message: req.flash('signupMessage') });
         });


         // SIGNUP =================================

         // process the signup form
         app.post('/signup', passport.authenticate('local-signup', {
         successRedirect: '/test-member-policies', // redirect to the secure profile section
         failureRedirect: '/signup', // redirect back to the signup page if there is an error
         failureFlash: true // allow flash messages
         }));
     */






    // $$$$$$$$ TEST member page $$$$$$$$$$
    app.get("/test-member-policies", function (req, res) {
        cloudantDatabase.find({
            selector: {
                payer_name:  (!req.query.payername) ? 'Twana Daniel' : req.query.payername
            },

        }, function (er, result) {
            if (er) {
                throw er;
            }

            console.log('Found %d documents', result.docs.length);
            for (var i = 0; i < result.docs.length; i++) {

                res.render('test-member-policies', {
                    title: 'test-member-policies',
                    page: 'test-member-policies',
                    memberData: result.docs[i]
                });
            }
        });

    });
    // $$$$$$$$ TEST member page $$$$$$$$$$







// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login',{
                title: 'Login',
                page: 'login',
                message: req.flash('loginMessage')
            });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/test-member-policies', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup',{
                title: 'Signup',
                page: 'signup',
                message: req.flash('loginMessage')
            });

        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/test-member-policies', // redirect to the secure profile section
            failureRedirect : '/signup' // redirect back to the signup page if there is an error
            //failureFlash : true // allow flash messages
        }));


// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
        app.get('/connect/local', function(req, res) {
            res.render('connect-local.ejs', {
                title: 'Login',
                page: 'login',
                message: req.flash('loginMessage')
            });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/test-member-policies', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));



// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/test-member-policies');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
