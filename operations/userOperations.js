var conn = require('../database_conn');
var User = conn.model('users');
var wrapper = require('../wrappers/emberWrapper');
var loginOperations = require('../auth/loginOperation');

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
		
		loginOperations.logIn(user);

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