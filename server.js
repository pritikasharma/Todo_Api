// create a new express server
var express = require ('express');

//env variable provided by HEROKU if running there, else setup port
var PORT = process.env.PORT || 3000;

var app = express();

//setup routes
app.use ( '/', function (req, res, next) {
	  // send message back to client
	  res.send (' TO Root API');
	}
	);

// ASYNC: port# and callback function when everything is done
app.listen( PORT, function (req, res) 
		{
			//print to the command prompt
			console.log (' * Express Server listening on port ' + PORT + ' !');
		});
