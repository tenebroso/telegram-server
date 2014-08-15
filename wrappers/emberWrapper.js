exports.emberUser = function(mongoUser) {
	var userData = {
		name: mongoUser.name,
		id: mongoUser.id,
		email: mongoUser.email,
		photo: '/assets/avatars/avatar-orange.png',
		following: mongoUser.following,
		followers: mongoUser.followers
	};
	return userData;
}

exports.emberPost = function(mongoPost) {
	var entry = {
		id : mongoPost._id,
		content : mongoPost.content,
		date : mongoPost.date,
		user : mongoPost.user,
	};
	return entry;
}