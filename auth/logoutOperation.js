exports.logout = function(req, res){
	console.log('logging out');
	req.logout();
	return res.send(200);
};