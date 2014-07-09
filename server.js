var express = require('express');
var app = express();

// Route implementation
app.get('/hello.txt', function(req, res) {
	res.send('Hello World');
});

// Public Routes

app.get('/', function(req, res) {
	res.send(200);
});

app.get('/login', function(req, res) {
	res.send(200);
});

app.get('/password', function(req, res) {
	res.send(200);
});

app.get('/password/confirm', function(req, res) {
	res.send(200);
});

// Post Route

app.get('/posts', function(req, res) {
	res.send(200);
});

// User Routes

app.get('/user/:user_id', function(req, res) {
	res.send(200);
});

app.get('/following', function(req, res) {
	res.send(200);
});

app.get('/following', function(req, res) {
	res.send(200);
});

var server = app.listen(3000, function() {
	console.log('Listening on port %d', server.address().port);
});
