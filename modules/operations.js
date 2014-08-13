var conn = require('../database_conn');
var Post = conn.model('posts');
var wrapper = require('./emberWrapper.js');

exports.getPosts = function(req, res) {
	Post.find(function(err, emberPosts){
		var emberPostsArray = [];
		emberPosts.forEach(function(post) {
			/*var entry = {
				id : post._id,
				content : post.content,
				date : post.date,
				user : post.user,
			}*/
			emberPostsArray.push(wrapper.emberPost(post));
		});
		if(err || !emberPosts) return res.send(404);
		return res.send(200, {posts:emberPostsArray});
	});
}

exports.createPost = function(req, res) {

	var post = {
		content : req.body.post.content,
		date: req.body.post.date,
		user: req.body.post.user
	};

	var newPost = new Post(post);
	var postAuthor = post.user;

	newPost.save(function(err, newPost){
		if (postAuthor == req.user.id) {
			/*var emberPost = {
				id : newPost._id,
				content : newPost.content,
				date : newPost.date,
				user : newPost.user
			}*/
			return res.send(200, {post:wrapper.emberPost(newPost)});
		}
		return res.send(400);
	});

}