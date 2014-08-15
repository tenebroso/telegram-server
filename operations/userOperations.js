var conn = require('../database_conn');
var User = conn.model('users');
var wrapper = require('../wrappers/emberWrapper');
var passport = require('passport');
require('../auth/auth')(passport);

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
	var followedBy = req.query.showFollowers;
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
	} else if(followedBy) {

		var userId = req.params.showFollowers;
		User.find({'followers': ['jonbukiewicz']}, function(err, users){
			if(err || !users) return res.send(404);
			return res.send(200, {users:[users]});
		});
		
	} else {
		console.log('send all users');
		User.find(function(err, users){
			res.send(200, {users:[users]});
		});
	}
};

exports.logout = function(req, res){
	console.log('logging out');
	req.logout();
	return res.send(200);
};

exports.userFollowing = function(req, res){
	if(isAuthenticated == 'true') {
		return res.send(200);
	} else {
		return res.send(404);
	}
}