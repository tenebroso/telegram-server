var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var app = express();

app.use(bodyParser());

app.get('/api/posts', function(req, res) {
	res.send(200, {posts: posts});
});

app.post('/api/posts', function(req, res) {

	var postCount = posts.length+2;
	var newId = postCount++;

	var post = {
		id : newId,
		content : req.body.post.content,
		date: req.body.post.date,
		user: req.body.post.user
	};

	posts.push(post);

	res.send(200, {post:post});

	//console.log(post);
});

// User Routes

app.post('/api/users', function(req, res) {
	//res.send(200, {user:user});

	var userData = {
		id: req.body.user.username,
		password: req.body.user.password
	};

	user.push(userData);
	res.send(200, {user:userData});

});

app.get('/api/users', function(req, res) {

	var username = req.query.username;
	var password = req.query.password;
	var operation = req.query.operation;

	var loggedIn = false;

	if(operation == 'login') {

		for (var i =0; i < users.length; i++) {
			if ( username == users[i].id && password == users[i].password) {
				var loggedIn = true;
				var foundUser = users[i];
				return res.send(200, {users:[foundUser]});
			}
		}

		return res.send(400);
	}

	

});

app.get('/api/users/:user_id', function(req, res) {

	// http://expressjs.com/4x/api.html#req.params
	
	var userId = req.params.user_id;

	for (var i = 0; i < users.length; i++) {
		if (userId == users[i].id) {
			return res.send(200, {user:users[i]});
		}
	}

	return res.send(404);


});

var server = app.listen(3000, function() {
	console.log('Listening on port %d', server.address().port);
});

//http://emberjs.com/guides/models/connecting-to-an-http-server/

var users = [
	{
		id: 'jonbukiewicz',
		name: 'Jon Bukiewicz',
		email: 'jonathan@tenebroso.net',
		photo:'assets/avatars/JonB.jpg',
		password: '1',
		following: ['johndoe','sally'],
		followers: ['johndoe','sally'],
		posts:['1','4']
	},
	{
		id: 'johndoe',
		name: 'John Doe',
		email: 'johndoetelegramtest@gmail.com',
		photo:'assets/avatars/LouisCK.jpg',
		password: '2',
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

var posts = [
	{
		id: 1,
		date: 'Tue, 10 Jun 2014 12:00:00 GMT',
		content: 'Test! Great teams constantly learn how to lorem ipsum lorem ipsum.',
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
