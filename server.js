// create a new express server
var express = require ('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

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
	  res.send (' To Root API');
	}
	);

//** get all the todos
app.get ('/todos', function (req, res){
	//need to convert the array to JSON since can only pass text back and forth
	//res.send (' TODO list ' + JSON.stringify (todos));

	//returns string, object with key value pair
	var queryParam = req.query;
	//set to the entire list
	var matchedTodos = todos;

	if (queryParam.completed === 'true' && queryParam.hasOwnProperty('completed')) {
		matchedTodos = _.where (matchedTodos, {completed: true});
	} else if (queryParam.completed == 'false' && queryParam.hasOwnProperty('completed')) {
	 	matchedTodos = _.where (matchedTodos, {completed: false});
	}

	if (matchedTodos){ 
		res.json(matchedTodos);
	}
	else {
		//there was no match
		res.status(404).send('ERROR: ID not found');
	}
});

//get todo with :id param, express knows to parse the ID as request
app.get ('/todos/:id', function (req, res){

		//type of params is string
		var todoId = parseInt(req.params.id, 10);
		var i;

		//* OPTION 3: underscore
		var matchedTodo = _.findWhere (todos, { id: todoId} );

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
		
		// todos.forEach ( function (todo, index) {

		// 	if( todo.id === todoId)
		// 		{
		// 			//match found 
		// 			matchedTodo = todo;
		// 		}
		// });
			
	if (matchedTodo)
		res.json(matchedTodo);
	else
		res.status(404).send('ERROR: ID not found');

});


//http POST from user, add it to the todos array
app.post ('/todos', function (req, res) { 

	//pick only the description and completed fields, disregard all other
	var body = _.pick ( req.body, 'description', 'completed');
	
	//add validation for the JSON object
	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.length === 0)
	{
		//request can not be completed
		return res.status(400).send();
	}
	
	body.description = body.description.trim();

	body.id = todoNextId++;

	/*var todoItem = {
		"id": todoNextId,
		"description": body
	}; */

	todos.push (body);
	
	//shouldnt the todos be returned?
	res.json(body);
})

// http DELETE route /todos/:id
app.delete ('/todos/:id', function (req,res) {
	var body = req.body;

	//find the item with the id and then remove from array
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere (todos, { id: todoId} );

	if (matchedTodo)
	{
		//have found a match, delete and return the item
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	}
	else
	{
		res.status(404).send('ID not found');
	}

})


// http PUT allows updates to selected id
app.put ('/todos/:id', function (req, res) {

	//body will have the new value to update
	var body = _.pick (req.body, 'description', 'completed');
	var validAttributes = {};

	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere (todos, { id: todoId} );

	//validate the attributes - completed, if given
	if (_.isBoolean(body.completed) && body.hasOwnProperty('completed'))
	{
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {	
		// bad request 
		res.status(404).send('ID not found');
	} 

	//valid desciption
	if (_.isString(body.description) && body.hasOwnProperty('description')) {
		validAttributes.description = body.description.trim();
	} else if (body.hasOwnProperty('description')){
			res.status(400).send(' No description given');
	}	
	
	//shallow copy from source to destination - object by reference
	_.extend (matchedTodo, validAttributes);

	res.json(matchedTodo);

})


// ASYNC: port# and callback function when everything is done
app.listen( PORT, function (req, res) {
	//print to the command prompt
	console.log (' * Express Server listening on port ' + PORT + ' !');
});