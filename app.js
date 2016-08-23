var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var TelegramBot = require('node-telegram-bot-api');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.set('port', (process.env.PORT || 5000));
app.set('TELEGRAM_API_URL', process.env.TELEGRAM_BOT_TOKEN);
app.set('TELEGRAM_BOT_TOKEN', process.env.TELEGRAM_BOT_TOKEN || '263464526:AAGLXjdte-AwkImK0s4n_zqQwiaSCVDePeI');

var bot = new TelegramBot(app.get('TELEGRAM_BOT_TOKEN'), {polling: true});

// Any kind of message
bot.on('message', function (msg) {
  var chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Funcionou !');
});

// set the view engine to ejs
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/getMe', function (req, res) {
   bot.getMe().then(function (botInfo) {
      res.send(botInfo); 
   });
});

app.post('/reminder', function (req, res) {
    var chatId = req.body.message.chat.id;
    var message = req.body.message.text;
    
    bot.sendMessage(chatId, message);

    res.send('Success !');
});

app.listen(app.get('port'), function () {
    console.log('Example app listening on port ' + app.get('port') + '!');
});