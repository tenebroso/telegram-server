var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var app = express();
var mongoose = require('mongoose');
var db = mongoose.connection;

mongoose.connect('mongodb://127.0.0.1/telegram');

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('mongodb success');
});

var userSchema = new mongoose.Schema({
	id: String,
	name: String,
	email: String,
	photo: String,
	password: String,
	followers: [{followers: String}],
	following: [{following: String}],
	posts: [{posts: String}]
});

var User = mongoose.model('users', userSchema);

app.use(bodyParser());
app.use(session({secret: 'keyboard cat'}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
	function(username, password, done) {

		for (var i = 0; i < users.length; i++) {
			if (username == users[i].id && 
				password == users[i].password) {

				var loggedIn = true;
				var foundUser = users[i];

				done(null, foundUser);

			}
		}
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

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		console.log('authenticated');
		return next();
	} else {
		console.log('not authenticated');
		return res.send(403);
	}
}

app.get('/api/posts', function(req, res) {
	res.send(200, {posts: posts});
});

app.post('/api/posts', ensureAuthenticated, function(req, res) {

	var postCount = posts.length+2;
	var newId = postCount++;

	var post = {
		id : newId,
		content : req.body.post.content,
		date: req.body.post.date,
		user: req.body.post.user
	};

	var postAuthor = post.user;

	if (postAuthor == req.user.id) {
		posts.push(post);
		return res.send(200, {post:post});
	}

	return res.send(400);
	

});

// User Routes

app.post('/api/users', function(req, res) {
	//res.send(200, {user:user});

	var userData = {
		name: req.body.user.name,
		id: req.body.user.id,
		email: req.body.user.email,
		password: req.body.user.password
	};

	var newUser = new User(userData);

	newUser.save(function(err, newUser){
		req.login(newUser, function(err) {
			if(err) { return res.send(400); }
			return res.send(200, {user:newUser});
		})
	});
	

});

app.get('/api/users', function(req, res, next) {

	var username = req.query.username;
	var password = req.query.password;
	var operation = req.query.operation;
	var followedBy = req.query.followedBy;
	var following = req.query.following;
	var isAuthenticated = req.query.isAuthenticated;

	var loggedIn = false;

	if(operation == 'login') {

		passport.authenticate('local', function(err, user, info) {
			
			req.logIn(user, function(err, next) {
				if (err) { return next(err); }
				//return res.send(200, {users:[user]});
				mongoose.model('users').find({user:[user]}, function(err, users){
					return res.send(200, {users:[req.user]});
				});
			});

		})(req, res, next);

	} else if(isAuthenticated == 'true') {

		console.log('param is authenticated'); 

		if (req.isAuthenticated()) {

			console.log('logged in, send the logged in user');
			
			mongoose.model('users').find({user:req.user}, function(err, users){
				res.send(200, {users:[req.user]});
			});

		} else {

			console.log('send empty array of users');
			res.send(200, {users:[]});

		}
		

	} else if(req.query.followedBy) {
		
	} else {

		console.log('send all users');

		mongoose.model('users').find(function(err, users){
			res.send(200, {users:[users]});
		});

	}

});

app.get('/api/users/:user_id', function(req, res) {

	// http://expressjs.com/4x/api.html#req.params
	
	var userId = req.params.user_id;

	mongoose.model('users').findOne({id:userId}, function(err, user){
		if(err || !user) return res.send(404);
		return res.send(200, {user:user});
	});


});

app.get('/api/logout', function(req, res){
	console.log('logging out');
	req.logout();
	return res.send(200);
});

var server = app.listen(3000, function() {
	console.log('Listening on port %d', server.address().port);
});

//http://emberjs.com/guides/models/connecting-to-an-http-server/

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
