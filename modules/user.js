var mongoose = require('mongoose');

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