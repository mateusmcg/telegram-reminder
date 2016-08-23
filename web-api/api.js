var express = require('express'),
    bodyParser = require('body-parser'),
    app = express();

console.log('Starting API');

app.set('port', (process.env.PORT || 5000));
app.set('TELEGRAM_BOT_TOKEN', process.env.TELEGRAM_BOT_TOKEN);

app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.send('Hello World!');
});

var server = app.listen(app.get('port'), function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Web server started at http://%s:%s', host, port);
});

console.log('API started');

module.exports = function (bot) {
    app.post('/' + app.get('TELEGRAM_BOT_TOKEN'), function (req, res) {
        bot.processUpdate(req.body);
        res.sendStatus(200);
    });
};