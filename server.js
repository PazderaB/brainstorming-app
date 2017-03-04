// set up ======================================================================
var express = require('express');
var app = express(); 						// create our app w/ express
var mongoose = require('mongoose'); 				// mongoose for mongodb
var port = process.env.PORT || 8080; 				// set the port
var database = require('./config/database'); 			// load the database config
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var winston = require('winston');
var util = require('util');
var compression = require('compression');

// configuration ===============================================================
//mongoose.connect(database.localUrl); 	// Connect to local MongoDB instance.

mongoose.connect(database.remoteUrl); 	// Connect to Remote MongoDB instance.

app.use(express.static('./public')); 		// set the static files location /public/img will be /img for users

// logging =====================================================================
//app.use(morgan('dev')); // log every request to the console
//app.use(morgan(':method[pretty] :url :status :response-time ms - :res[content-length] - :date[clf]'))

var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: './logs/main.log',
            handleExceptions: true,
            json: true,
            maxsize: 242880, //5MB
            maxFiles: 5,
            colorize: false
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        }),
        new winston.transports.File({
        	name: 'file#deleted',
            level: 'warn',
            filename: './logs/deleted.log',
            handleExceptions: true,
            json: true,
            maxsize: 242880, //5MB
            maxFiles: 5,
            colorize: false
        })
    ],
    exitOnError: false
})

logger.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};

function formatArgs(args){
    return [util.format.apply(util.format, Array.prototype.slice.call(args))];
}

console.warn = function(){
    logger.warn.apply(logger, formatArgs(arguments));
};

app.use(require("morgan")("combined", { "stream": logger.stream }));

app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request
app.use(compression()) //use compression

// routes ======================================================================
require('./app/routes.js')(app);

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
