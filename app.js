var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/status', function (req, res) {
  res.send('GET - Status');
});

app.listen(app.get('port'), function () {
  console.log('Example app listening on port ' + app.get('port') + '!');
});