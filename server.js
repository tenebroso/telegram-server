var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var app = express();
var mongoose = require('mongoose');

require('./database_conn');

app.use(bodyParser());
app.use(session({secret: 'keyboard cat'}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
	function(username, password, done) {

		User.findOne({id:username}, function(err, user){
			if(!user){ return done(null, false); }
			if(user.password != password) { return done(null, false); }
			return done(null, user);
		});

		/*for (var i = 0; i < users.length; i++) {
			if (username == users[i].id && 
				password == users[i].password) {

				var loggedIn = true;
				var foundUser = users[i];

				done(null, foundUser);

			}
		}*/
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
	mongoose.model('posts').find(function(err, posts){
		if(err || !user) return res.send(404);
		return res.send(200, {posts: posts});
	});
	
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

	var newPost = newPost(post);
	var postAuthor = post.user;

	newPost.save(function(err, newPost){
		if (postAuthor == req.user.id) {
			posts.push(post);
			return res.send(200, {post:post});
		}
		return res.send(400);
	});

});

// User Routes

app.post('/api/users', function(req, res) {
	//res.send(200, {user:user});

	var userData = {
		name: req.body.user.name,
		id: req.body.user.id,
		email: req.body.user.email,
		password: req.body.user.password,
		photo: '/assets/avatars/avatar-orange.png'
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
				if (err) { return res.send(404); }
				return res.send(200, {users:[user]});
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