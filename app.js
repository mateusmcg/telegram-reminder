var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var TelegramBot = require('node-telegram-bot-api');
var mongoose = require('mongoose');
var app = express();

// Mongoose Schema definition
var Schema = new mongoose.Schema({
    id       : String, 
    chatId    : String
});

var ReminderTelegram = mongoose.model('ReminderTelegram', Schema);

mongoose.connect(process.env.MONGOLAB_URI, function (error) {
    if (error) console.error(error);
    else console.log('mongo connected');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.set('port', (process.env.PORT || 5000));
app.set('TELEGRAM_API_URL', process.env.TELEGRAM_BOT_TOKEN);
app.set('TELEGRAM_BOT_TOKEN', process.env.TELEGRAM_BOT_TOKEN || '263464526:AAGLXjdte-AwkImK0s4n_zqQwiaSCVDePeI');

var bot = new TelegramBot(app.get('TELEGRAM_BOT_TOKEN'), {polling: true});

// Any kind of message
bot.onText('/\/start', function (msg) {
    var chatId = msg.from.id;
    var remidnerTelegram = new ReminderTelegram();
    remidnerTelegram.id = remidnerTelegram._id;
    remidnerTelegram.chatId = chatId;
    remidnerTelegram.save(function (err) {
        bot.sendMessage(chatId, 'Agora você receberá notificações às 00:30.');
    });
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