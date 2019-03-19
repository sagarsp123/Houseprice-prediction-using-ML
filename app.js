var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var config = require('./config/database');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var path = require('path');
var zipcodes = require('zipcodes');


//connect to db

mongoose.connect(config.database, {useNewUrlParser: true});

var db= mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function(){

console.log('connected to mongo DB');

});




app = express();

// body parser middleware

//parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



app.set("views", path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname,'public')));




//express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  //cookie: { secure: true }
}));



// express validator middleware

app.use(expressValidator({

errorFormatter: function(param,msg,value){

	var namespace= param.split('.')
	, root = namespace.shift()
	, formParam = root;

	while(namespace.length){
		formParam += '[' + namespace.shift() + ']';
	}
	return{

		param: formParam,
		msg: msg,
		value

	};
}
}));

// body parser middleware

app.use(bodyParser.urlencoded({extended: false}));
//parse application/json
app.use(bodyParser.json());




//express messages middleware

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});




// global errors

app.locals.errors = null;
app.locals.zip = null;




var index = require('./index');

app.use('/', index);

app.locals.test = null;



app.listen(process.env.PORT || 5000, function(err){

if(err) console.log(err);

else console.log("connected to the server");


});

