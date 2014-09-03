function checkLoggedInUserFollowsUser(loggedInUser, mongoUser) {
	if(loggedInUser.following.indexOf(mongoUser.id)!== -1) {
		console.log('true');
		return true;
	} else {
		console.log('false');
		return false;
	}
}

exports.emberUser = function(mongoUser, loggedInUser) {
	var userData = {
		name: mongoUser.name,
		id: mongoUser.id,
		email: mongoUser.email,
		photo: '/assets/avatars/avatar-orange.png',
		followedByLoggedInUser:false
	};
	if(loggedInUser) {
		userData.followedByLoggedInUser = checkLoggedInUserFollowsUser(loggedInUser, mongoUser);
	}
	console.log(userData);
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