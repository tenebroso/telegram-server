var passport = require('./passport');

exports.logIn = function(user) {
	passport.authenticate('local', function(err, user, info) {
		req.logIn(user, function(err, next) {
			if (err) { return res.send(404); }
			return res.send(200, {users:[user]});
		});
	})(req, res, next);
}

exports.ensureAuthenticated = function(req, res, next) {
	if (req.isAuthenticated()) {
		console.log('authenticated');
		return next();
	} else {
		console.log('not authenticated');
		return res.send(403);
	}
}