var passport = require('passport');
var bodyParser = require('body-parser');
var LocalStrategy = require('passport-local').Strategy;
var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongostore')(session);
var app = express();
var conn = require('../database_conn');
var User = conn.model('users');
var wrapper = require('./emberWrapper.js');

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

exports.createUser = function(req, res) {
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

};

exports.getUser = function(req, res) {
	var userId = req.params.user_id;
	User.findOne({id:userId}, function(err, user){
		if(err || !user) return res.send(404);
		return res.send(200, {user:user});
	});


};

exports.getAllUsers = function(req, res, next) {
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
			User.find({user:req.user}, function(err, users){
				res.send(200, {users:[req.user]});
			});
		} else {
			console.log('send empty array of users');
			res.send(200, {users:[]});
		}
	} else if(req.query.followedBy) {
		
	} else {
		console.log('send all users');
		User.find(function(err, users){
			res.send(200, {users:[users]});
		});
	}
};