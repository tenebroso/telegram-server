var conn = require('../database_conn');
var User = conn.model('users');
var wrapper = require('../wrappers/emberWrapper');
var passport = require('passport');
var async = require('async');
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
		return res.send(200, {user:wrapper.emberUser(user,req.user)});
	});


};

exports.getAllUsers = function(req, res, next) {
	var username = req.query.username;
	var password = req.query.password;
	var operation = req.query.operation;
	var followedBy = req.query.showFollowers;
	var isFollowing = req.query.showFollowing;
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

		var userId = req.query.showFollowers;
		User.find({following:userId}, function(err, emberUsersFollowedBy){
			var emberUsersFollowedByArray = [];
			emberUsersFollowedBy.forEach(function(user) {
				emberUsersFollowedByArray.push(wrapper.emberUser(user));
			});
			if(err || !emberUsersFollowedBy) return res.send(404);
			return res.send(200, {users:emberUsersFollowedByArray});
		});

	} else if(isFollowing) {

		var userId = req.query.showFollowing;
		User.find({followers:userId}, function(err, emberUsers){
			var emberUsersArray = [];
			emberUsers.forEach(function(user) {
				emberUsersArray.push(wrapper.emberUser(user));
			});
			if(err || !emberUsers) return res.send(404);
			return res.send(200, {users:emberUsersArray});
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

exports.followUser = function(req, res) {
	var newFollowee = req.query.followUsername;
	var currentUser = req.user.id;
	

	async.parallel([
		function(callback){
			var query = { id: newFollowee };
			var update = { $addToSet: { followers: currentUser }};
			User.findOneAndUpdate(query, update, function(err, result){
				callback();
			});
		},
		function(callback){
			var query = { id: currentUser };
			var update = { $addToSet: { following: newFollowee }};
			User.findOneAndUpdate(query, update, function(err, result){
				callback();
			});	
		}
	],
	function(err, results){
		if (err) return res.send(404, err);
		return res.send(200);
	});
}

exports.unfollowUser = function(req, res) {
	var unfollowedUser = req.query.unFollowUsername;
	var currentUser = req.user.id;
	async.parallel([
		function(callback){
			var query = { id: currentUser };
			var update = { $pull: { following: unfollowedUser }};
			User.findOneAndUpdate(query, update, function(err, result){
				callback();
			});
		},
		function(callback){
			var query = { id: unfollowedUser };
			var update = { $pull: { followers: currentUser }};
			User.findOneAndUpdate(query, update, function(err, result){
				callback();
			});	
		}
	],
	function(err, results){
		if (err) return res.send(404, err);
		return res.send(200);
	});
}