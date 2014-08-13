var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongostore')(session);
var postOperations = require('./operations/postOperations');
var userOperations = require('./operations/userOperations');
var loginOperations = require('./auth/loginOperation');
var logoutOperations = require('./auth/logoutOperation');
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

passport.use(new LocalStrategy(
	function(username, password, done) {
		User.findOne({id:username}, function(err, user){
			if(!user){ return done(null, false); }
			if(user.password != password) { return done(null, false); }
			return done(null, user);
		});
	}
));

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findOne({id:id}, function(err, user){
		done(err,user);
	});
});

app.get('/api/posts', postOperations.getPosts);

app.post('/api/posts', loginOperations.ensureAuthenticated, postOperations.createPost);

app.post('/api/users', userOperations.createUser);

app.get('/api/users', userOperations.getAllUsers);

app.get('/api/users/:user_id', userOperations.getUser);

app.get('/api/logout', logoutOperations.logout);

var server = app.listen(3000, function() {
	console.log('Listening on port %d', server.address().port);
});