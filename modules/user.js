var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	id: String,
	name: String,
	email: String,
	photo: String,
	password: String,
	followers: [],
	following: []
});

module.exports = userSchema;