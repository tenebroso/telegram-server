function checkCurrentUserIsFollowing(loggedInUser, mongoUser) {
	var currentUser = mongoUser;
/*	console.log('current user', currentUser.id);
	console.log('following',currentUser.following);
	console.log('logged in user', loggedInUser.id);
*/
	/*var followersArray = [];
	followersArray.forEach(function(user) {
		console.log('following', user);
	});*/

	var emberUsersFollowedByArray = [];
	emberUsersFollowedBy.forEach(function(follower) {
		//emberUsersFollowedByArray.push(wrapper.emberUser(user));
		console.log(currentUser.following);
	});

	if (currentUser.following.indexOf(loggedInUser.id) !== -1) {
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
		followingCurrentuser:false
		//following: mongoUser.following,
		//followers: mongoUser.followers
	};
	if(loggedInUser) {
		userData.followingCurrentUser = checkCurrentUserIsFollowing(loggedInUser, mongoUser);
	}
	//checkCurrentUserIsFollowing(userData, req.user);
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