/*eslint-env node*/


// set up ======================================================================
// get all the tools we need
var path        = require('path');
var express     = require('express');
var app         = express();
var passport    = require('passport');
var flash       = require('connect-flash');
var http        = require('http');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var cookieParser = require('cookie-parser');
var session     = require('express-session')
var mongoose    = require('mongoose');

var cfenv       = require('cfenv'); // cfenv provides access to your Cloud Foundry environment
var appEnv      = cfenv.getAppEnv();  // get the app environment from Cloud Foundry
require('dotenv').load();  //Cloudant Initialization code


require('./config/passport')(passport); // pass passport for configuration




// set up our express applicatio
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public'))); // serve the files out of ./public as our main files
app.set('json spaces', 6); //Added for Json Readability

// required for passport
app.use(session({ secret: 'ilovescodingwithoutstop' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session





require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function () {

    // print a message when the server starts listening
    console.log("server starting on " + appEnv.url);
});

