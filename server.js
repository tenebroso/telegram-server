var express = require('express');
var bodyParser = require('body-parser')
var app = express();

app.use(bodyParser.json(user));

// Public Routes

app.get('/', function(req, res) {
	res.send(200);
});

app.get('/api/login', function(req, res) {
	res.send(200);

	// http://expressjs.com/4x/api.html#req.params
	//var username = user[index];

	/*function contains(arr, v) {
	  return str.indexOf(v) > -1;
	}

	//http://stackoverflow.com/a/6384527
	var hasMatch = false;
	for (var index = 0; index < user.length; ++index) {
		
		var users = user[index];

		if(users.id === userId) {
			hasMatch = true;
			console.log('found');
		} else {
			console.log('not found');
		}
	}

	res.send(200, {user: user});*/

});

app.get('/api/signup', function(req, res) {
	res.send(200);
});

app.get('/api/getpassword', function(req, res) {
	res.send(200);
});

// Post Route

app.get('/api/posts', function(req, res) {
	res.send(200, {posts: post});
});

app.post('/api/posts', function(req, res) {

});

app.get('/api/posts/:post_id', function(req, res) {
	res.send(200);
});

// User Routes

app.get('/api/users', function(req, res) {
	res.send(200, {user:user});
});

app.get('/api/users/:user_id', function(req, res) {

	// http://expressjs.com/4x/api.html#req.params
	//var userId = req.params.user_id;
	//var data = JSON.parse(data);
	res.send(200, {user:user});

	/*function contains(arr, v) {
	  return str.indexOf(v) > -1;
	}

	//http://stackoverflow.com/a/6384527
	var hasMatch = false;
	for (var index = 0; index < user.length; ++index) {
		
		var users = user[index];
		var username = users.id;

		console.log(username);

		if(users.id === userId) {
			hasMatch = true;
			console.log('found');
		} else {
			console.log('not found');
		}
	}
*/
	//console.log('Received request to retrieve user having id', userName);

});

var server = app.listen(3000, function() {
	console.log('Listening on port %d', server.address().port);
});

//http://emberjs.com/guides/models/connecting-to-an-http-server/

var user = [
	{
		id: 'jonbukiewicz',
		name: 'Jon Bukiewicz',
		email: 'jonathan@tenebroso.net',
		photo:'assets/avatars/JonB.jpg',
		password: '1234',
		following: ['johndoe','sally'],
		followers: ['johndoe','sally'],
		posts:['1','4']
	},
	{
		id: 'johndoe',
		name: 'John Doe',
		email: 'johndoetelegramtest@gmail.com',
		photo:'assets/avatars/LouisCK.jpg',
		password: '1234',
		following: ['jonbukiewicz','sally'],
		followers: ['jonbukiewicz','sally'],
		posts:['2']
	},
	{
		id: 'sally',
		name: 'Sally Jessy Raphael',
		email: 'sallytelegramtest@gmail.com',
		photo:'assets/avatars/Sally.jpg',
		password: '1234',
		following: ['johndoe','jonbukiewicz'],
		followers: ['johndoe','jonbukiewicz'],
		post:['3']
	}
];

var post = [
	{
		id: 1,
		date: 'Tue, 10 Jun 2014 12:00:00 GMT',
		content: 'Great teams constantly learn how to lorem ipsum lorem ipsum.',
		user: 'jonbukiewicz',
	},
	{
		id: 2,
		date: 'Mon, 09 June 2014 12:00:00 GMT',
		content: 'Hello world!',
		user: 'johndoe'
	},
	{
		id: 3,
		date: 'Mon, 05 June 2014 12:00:00 GMT',
		content: 'Hello world! This is an example of a post that has a <a href="http://google.com">Link Inside</a>',
		user: 'sally'
	},
	{
		id: 4,
		date: 'Mon, 17 June 2014 12:00:00 GMT',
		content: 'Hello world! http://google.com',
		user: 'jonbukiewicz'
	}
];
