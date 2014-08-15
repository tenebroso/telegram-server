var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongostore')(session);
var postOperations = require('./operations/postOperations');
var userOperations = require('./operations/userOperations');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var conn = require('./database_conn');
var User = conn.model('users');

var app = express();

app.use(bodyParser());
app.use(session({
	secret: 'keyboard cat',
	store: new MongoStore({'db': 'telegram'})
}));
app.use(passport.initialize());
app.use(passport.session());


function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		console.log('authenticated');
		return next();
	} else {
		console.log('not authenticated');
		return res.send(403);
	}
}

app.get('/api/posts', postOperations.getPosts);

app.post('/api/posts', ensureAuthenticated, postOperations.createPost);

app.post('/api/users', userOperations.createUser);

app.get('/api/users', userOperations.getAllUsers);

app.get('/api/users/:user_id', userOperations.getUser);

app.get('/api/users/:user_id/following', userOperations.userFollowing);

app.get('/api/follow', userOperations.followUser);

app.get('/api/logout', userOperations.logout);

var server = app.listen(3000, function() {
	console.log('Listening on port %d', server.address().port);
});