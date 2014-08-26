function checkCurrentUserIsFollowing(mongoUser, authenticatedUser) {
	var loggedInUser = authenticatedUser;
	var currentUser = mongoUser;
	console.log(currentUser.id);
	if (currentUser.following.indexOf(loggedInUser.id) !== -1) {
		console.log('true');
		return true;
	} else {
		console.log('false');
		return false;
	}
}

exports.emberUser = function(mongoUser) {
	var userData = {
		name: mongoUser.name,
		id: mongoUser.id,
		email: mongoUser.email,
		photo: '/assets/avatars/avatar-orange.png',
		followingCurrentuser:true
		//following: mongoUser.following,
		//followers: mongoUser.followers
	};
	checkCurrentUserIsFollowing(userData, user);
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