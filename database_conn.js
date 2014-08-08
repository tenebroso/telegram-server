var mongoose = require('mongoose');
var userSchema = require('./modules/user');
var postSchema = require('./modules/post');

var conn = mongoose.createConnection('mongodb://127.0.0.1/telegram');

conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', function callback () {
  console.log('mongodb success');
});