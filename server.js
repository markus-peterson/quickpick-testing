var express = require('express');
const path = require('path');
var app = express();
//app.use(express.static(__dirname + '/'));
app.listen(process.env.PORT || 9090);

const local  = 'http://localhost:9090';
const markus = 'https://quickpick-back.herokuapp.com';
const team   = 'https://quick-pick1.herokuapp.com';
const daniel = 'https://backend-test-quickpick.herokuapp.com';

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('build'));
	app.get('*', function (req, res) {
		res.sendFile(path.join(__dirname, 'build', 'index.html'));
		res.header('Access-Control-Allow-Origin', '*');
	});
}
