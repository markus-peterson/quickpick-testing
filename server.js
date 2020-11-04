var express = require('express');
const path = require('path');
var app = express();
//app.use(express.static(__dirname + '/'));
app.listen(process.env.PORT || 9090);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('build'));
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}