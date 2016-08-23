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
app.set('TELEGRAM_BOT_TOKEN', process.env.TELEGRAM_BOT_TOKEN);

mongoose.connect(process.env.MONGOLAB_URI, function (error) {
    if (error) console.error(error);
    else console.log('mongo connected');
});

var bot = new TelegramBot(app.get('TELEGRAM_BOT_TOKEN'), { polling: true });

// Any kind of message
bot.on('message', function (msg) {
    var chatId = msg.chat.id.toString();
    bot.sendMessage(chatId, 'Acionou o serviço');

    var message = msg.text;
    var Model = mongoose.model('ReminderTelegram', { chatId: String });
    var modelObj = new Model({ chatId: chatId });

    switch (message) {
        case '/start': {
            try {
                modelObj.find(function (err, doc) {
                    if (doc) {
                        bot.sendMessage(chatId, 'Você já está com o serviço de lembrete ligado. Caso queira desativar utilize o comando /cancel');
                    } else {
                        modelObj.save(function (err) {
                            bot.sendMessage(chatId, 'Agora você receberá notificações às 00:30. \nCaso queira cancelar o serviço, utilize o comando /cancel');
                        });
                    }
                })
            } catch (e) {
                bot.sendMessage(chatId, e.name + '/' + e.message);
            }
        } break;
        case '/cancel': {
            try {
                modelObj.find().remove({ chatId: chatId }, function (err) {
                    bot.sendMessage(chatId, 'Serviço cancelado com sucesso!');
                })
            } catch (e) {
                bot.sendMessage(chatId, e.name + '/' + e.message);
            }
        } break;
    }
});

// set the view engine to ejs
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.listen(app.get('port'), function () {
    console.log('Example app listening on port ' + app.get('port') + '!');
});