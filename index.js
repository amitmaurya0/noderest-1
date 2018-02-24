var express= require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');

var config = require('./config/database');

var options = {
  useMongoClient: true,
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
};

mongoose.connect(config.mongoUrl, options).then(
	() => { console.log("database connected successfully") },
	err => { console.log("Error while connecting to database.") }
); 


var appRoutes = require('./src/route');

var app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false }));
app.use(cookieParser());
app.use(passport.initialize());

appRoutes(app); 

app.listen(8080, function(){
	console.log("Running on port : 8080");
})