var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var MongoStore = require('connect-mongostore')(session);
var app = express();
var conn = require('./database_conn');
var User = conn.model('users');
var Post = conn.model('posts');
var wrapper = require('./modules/emberWrapper.js');
var postOperations = require('./modules/postOperations');
var userOperations = require('./modules/userOperations');

function getUser() {
	var user = 'jane';
	return user;
};

var myUser = wrapper.emberUser(getUser);
//console.log('testing this', myUser());

app.get('/api/posts', postOperations.getPosts);

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		console.log('authenticated');
		return next();
	} else {
		console.log('not authenticated');
		return res.send(403);
	}
}

app.post('/api/posts', ensureAuthenticated, postOperations.createPost);

// User Routes

app.post('/api/users', userOperations.createUser);

app.get('/api/users', userOperations.getAllUsers);

app.get('/api/users/:user_id', userOperations.getUser);

app.get('/api/logout', function(req, res){
	console.log('logging out');
	req.logout();
	return res.send(200);
});

var server = app.listen(3000, function() {
	console.log('Listening on port %d', server.address().port);
});