var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var TelegramBot = require('node-telegram-bot-api');
var mongoose = require('mongoose');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.set('port', (process.env.PORT || 5000));
app.set('TELEGRAM_API_URL', process.env.TELEGRAM_BOT_TOKEN);
app.set('TELEGRAM_BOT_TOKEN', process.env.TELEGRAM_BOT_TOKEN || '263464526:AAGLXjdte-AwkImK0s4n_zqQwiaSCVDePeI');

mongoose.connect(process.env.MONGOLAB_URI, function (error) {
    if (error) console.error(error);
    else console.log('mongo connected');
});

var ReminderTelegram = mongoose.model('ReminderTelegram', { id: String, chatId: String });

var bot = new TelegramBot(app.get('TELEGRAM_BOT_TOKEN'), {polling: true});

// Any kind of message
bot.onText('/\/start/', function (msg) {
    var chatId = msg.from.id;
    bot.sendMessage(chatId, 'Método foi acionado');
    var remidnerTelegram = new ReminderTelegram({
        id: remidnerTelegram._id,
        chatId: chatId
    });
    remidnerTelegram.save(function (err) {
        bot.sendMessage(chatId, 'Agora você receberá notificações às 00:30.');
    });
    bot.sendMessage(chatId, 'Método foi acionado e chegou ao fim');
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

app.listen(app.get('port'), function () {
    console.log('Example app listening on port ' + app.get('port') + '!');
});