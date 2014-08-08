var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
	date: {type: Date, default: Date.now},
	content: String,
	user: String
});

module.exports = postSchema;