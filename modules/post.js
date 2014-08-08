var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
	date: {type: Date, default: Date.now},
	content: String,
	user: String
});

var Post = mongoose.model('posts', postSchema);