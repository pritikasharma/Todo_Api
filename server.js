// create a new express server
var express = require ('express');
var bodyParser = require('body-parser');

//env variable provided by HEROKU if running there, else setup port
var PORT = process.env.PORT || 3000;
var app = express();
// MOdel is one todo item. Collection is the entire list
var todos = [];
var todoNextId = 1; 

//parse any JSON requests
app.use (bodyParser.json());

//setup routes
app.get ( '/', function (req, res) {
	  // send message back to client
	  res.send (' TO Root API');
	}
	);

//get all the todos
app.get ('/todos', function (req, res){
		//need to convert the array to JSON since can only pass text back and forth
		//res.send (' TODO list ' + JSON.stringify (todos));
		res.json(todos);
		
	});

//get todo with :id param, express knows to parse the ID as request
app.get ('/todos/:id', function (req, res){

		//type of params is string
		var todoId = parseInt(req.params.id, 10);
		var i;
		var matchedTodo;

		//* OPTION 1: 
		//todos array is 0 based index 
		/* for (i= 0; i < todos.length; i++)
		{
			
			if (todos[i].id == todoId)
			{
				matchedTodo = todos[i];
				res.json(todos[i]);
			}
		} 
		if (typeof matchedTodo === 'undefined')
				res.status(404).send ('Error ID not found'); 
		*/

		//* OPTION 2: 
		// can't short curcuit forEach, bound to arrays
		
		todos.forEach ( function (todo, index) {

			if( todo.id === todoId)
				{
					//match found 
					matchedTodo = todo;
				}
		});
			
			if (matchedTodo)
			{ 
				res.json(matchedTodo);
			}
			else
			{
			//there was no match
				res.status(404).send('ERROR: ID not found');
			}

});


//POST from user, add it to the todos array
app.post ('/todos', function (req, res) { 

		//body = JSON object
		var body = req.body;
		body.id = todoNextId++;

		/*var todoItem = {
			"id": todoNextId,
			"description": body
		}; */

		todos.push (body);
		
		//shouldnt the todos be returned?
		res.json(body);

})


// ASYNC: port# and callback function when everything is done
app.listen( PORT, function (req, res) 
		{
			//print to the command prompt
			console.log (' * Express Server listening on port ' + PORT + ' !');
		});