/*eslint-env node*/

var path = require('path');
// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// serve the files out of ./public as our main files
app.use(express.static(path.join(__dirname, 'public')));


// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function () {

    // print a message when the server starts listening
    console.log("server starting on " + appEnv.url);





    //Home page
    app.get("/", function (req, res) {
        res.render('index', {
            title: 'Home',
            page: 'homePage'
        });
    });

    //Signup
    app.get("/signup", function (req, res) {
        res.render('signup', {
            title: 'Signup',
            page: 'signup'
        });
    });

    // process the signup form
    app.post('/signup', function(req, res){

        var fullName = req.body.userName;
        var userEmail = req.body.userEmail;
        var userPassword = req.body.userPassword;
        var userConfPassword = req.body.userConfPassword;

        var userData = { 'Full_Name': fullName, 'email_id' : userEmail, 'password' : userPassword, 'confPassword' : userConfPassword, 'time_date_logged': new Date() };
        databaseuse.insert(userData, function(err, body, header) {
            if (!err) {
                console.log('Added new user, Name: ' + fullName + ' Email' + userEmail +  ' Password: ' + userPassword + ' Conf Password: ' + userConfPassword);
                res.redirect('/home');
            }
        });
    });





    //member page  - Not in use
    app.get("/member", function (req, res) {
        Cloudantdatabase.find({
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

                res.render('member', {
                    title: 'Policy Member',
                    page: 'member',
                    memberData: result.docs[i]
                });
            }
        });

    });

    //health page
    app.get("/health", function (req, res) {
        Cloudantdatabase.find({
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


    //home insurance page
    app.get("/home", function (req, res) {
        Cloudantdatabase.find({
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

    //car insurance page
    app.get("/auto", function (req, res) {
        Cloudantdatabase.find({
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







    //----------------------------------------------------------------------------------
    // Cloudant connections
    //----------------------------------------------------------------------------------    

    //Added for Json Readability    
    app.set('json spaces', 6);

    //Cloudant Initialization code
    require('dotenv').load();
    // Load the Cloudant library.
    var Cloudant = require('cloudant');
    var username = process.env.cloudant_username;
    var password = process.env.cloudant_password;

    // Initialize the library with CloudCo account.
    var cloudant = Cloudant({
        account: username,
        password: password
    });

    //use Insurance DB
    var Cloudantdatabase = cloudant.db.use("insurance");



    //Create Index
    app.post('/insurance/createindex', function (req, res) {

        var payer_name = {
            name: 'payer-name',
            type: 'json',
            index: {
                fields: ['payer_name']
            }
        }
        Cloudantdatabase.index(payer_name, function (er, response) {
            if (er) {
                throw er;
            }
            console.log('Index creation result: %s', response.result);
            res.send('Index creation result: %s', response.result);
        });

    });


    //Quering with a query string
    // localhost:6001/insurance/query?payername=John+Appleseed -- pass a payername as query string.
    // localhost:6001/insurance/query -- Will pick default user for now.
    app.get("/insurance/query", function (req, res) {
        Cloudantdatabase.find({
            selector: {
                payer_name: (!req.query.payername) ? 'Tom Murphy' : req.query.payername
            }
        }, function (er, result) {
            if (er) {
                throw er;
            }

            console.log('Found %d documents', result.docs.length);
            for (var i = 0; i < result.docs.length; i++) {
                console.log('  Doc id: %s', result.docs[i]._id);
            }
            var jsonRES = [];
            jsonRES = result.docs;
            res.json(jsonRES);

        });
    });







    // load the Cloudant library
    var dbname = 'useraccount';
    var databaseuse = cloudant.db.use("useraccount");


    // create a database
    var createDatabase = function(callback)
    {
        //console.log("Creating database '" + dbname  + "'");
        cloudant.db.create(dbname, function(err, data)
        {
            if(err) {
                db = cloudant.db.use(dbname);
                console.log('This database is created ' + dbname);
            }
            else{
                //console.log('Database is already there');
            }
        });
    };






     // create a document
    var createDocument = function(callback) {
        console.log("Creating document 'mydoc'");
        // we are specifying the id of the document so we can update and delete it later


        var username = 'Twanawebtech01999';
        var userEmail = 'twanaazi@ie.ibm.com';


        var sendData = { 'username': username, 'email_id' : userEmail, 'time_date_logged': new Date() };
        databaseuse.insert(sendData, function(err, body, header) {
            if (!err) {
                console.log('Successfully added one score to the DB');
            }
        });



        /*
            //databaseuse.insert(doc, {_id: "user02", username:"Twanawebtech", email_id: "test@gmail.com", password: "", time_date_logged:"2019"}, function(err, data) {
            databaseuse.insert(doc, function(err, data) {
                doc.username = 'my';
                doc.email_id = 'name';

                //console.log("Error:", err);
                //console.log("Data:", data);
                //callback(err, data);
                console.log("inserting date");

            });
        */


    };







    // read a document
    var readDocument = function(callback) {
        console.log("Reading document 'user01'");
        databaseuse.get("user02", function(err, data)
        {
            doc = data;
            console.log('user02');

            //callback(err, data);
        });
    };



    // deleting the database document
    var deleteDatabase = function(callback) {
        //console.log("Deleting database '" + dbname  + "'");
        cloudant.db.destroy(dbname, function(err, data) {
            //console.log("Data:", data);
            console.log("Deleting database '" + dbname  + "'");

        });
    };

    //createDatabase();
    //createDocument();
    //readDocument();
    //deleteDatabase();










    /*

    cloudant.db.list(function (err, allDbs) {
        console.log('All my databases: %s', allDbs)
    });

      */
    



    /*


    // Adding store login details

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });


    // route middleware to ensure user is logged in
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();

        res.redirect('/');
    }




    // Route Code
    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    var LocalStrategy    = require('passport-local').Strategy;
    var User       = require('../app/models/user');


    var databaseuse = cloudant.db.use("useraccount");

    var username = databaseuse.username;
    var password = databaseuse.password;
    var email_id = databaseuse.email_id;


    app.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function(req, email, password, done) {
            if (email)
                email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

            // asynchronous
            process.nextTick(function() {
                // if the user is not already logged in:
                if (!req.user) {
                    User.findOne({ 'local.email' :  email }, function(err, user) {
                        // if there are any errors, return the error
                        if (err)
                            return done(err);

                        // check to see if theres already a user with that email
                        if (user) {
                            return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                        } else {

                            // create the user
                            var newUser            = new User();

                            newUser.local.email    = email;
                            newUser.local.password = newUser.generateHash(password);

                            newUser.save(function(err) {
                                if (err)
                                    return done(err);

                                return done(null, newUser);
                            });
                        }

                    });
                    // if the user is logged in but has no local account...
                } else if ( !req.user.local.email ) {
                    // ...presumably they're trying to connect a local account
                    // BUT let's check if the email used to connect a local account is being used by another user
                    User.findOne({ 'local.email' :  email }, function(err, user) {
                        if (err)
                            return done(err);

                        if (user) {
                            return done(null, false, req.flash('loginMessage', 'That email is already taken.'));
                            // Using 'loginMessage instead of signupMessage because it's used by /connect/local'
                        } else {
                            var user = req.user;
                            user.local.email = email;
                            user.local.password = user.generateHash(password);
                            user.save(function (err) {
                                if (err)
                                    return done(err);

                                return done(null,user);
                            });
                        }
                    });
                } else {
                    // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                    return done(null, req.user);
                }

            });

        }));



    */



});