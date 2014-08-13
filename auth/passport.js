var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {
	passport.use(new LocalStrategy(
		function(username, password, done) {
			User.findOne({id:username}, function(err, user){
				if(!user){ return done(null, false); }
				if(user.password != password) { return done(null, false); }
				return done(null, user);
			});
		}
	));

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findOne({id:id}, function(err, user){
			done(err,user);
		});
	});
}