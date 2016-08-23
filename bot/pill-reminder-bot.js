var TelegramBot = require('node-telegram-bot-api'),
    Models = require('../database/models/models');

console.log('Starting bot server.');

var bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

bot.setWebHook(process.env.HEROKU_URL + bot.token);

bot.onText(/^\/start/, function (msg, match) {
    var chatId = msg.chat.id.toString();
    Models.PillReminder.findOne({ chatId: chatId }, function (doc) {
        if (doc) {
            bot.sendMessage(msg.chat.id, 'Você já está com o serviço de lembrete ligado. Caso queira desativar utilize o comando /cancel').then(function () { });
        } else {
            var newChat = new Models.PillReminder({ chatId: chatId });
            newChat.save(function (err, newChat) {
                bot.sendMessage(msg.chat.id, 'Agora você receberá notificações às 00:30. \nCaso queira cancelar o serviço, utilize o comando /cancel').then(function () { });
            });
        }
    });
});

bot.onText(/^\/cancel/, function (msg, match) {
    var chatId = msg.chat.id.toString();
    Models.PillReminder.findOneAndRemove({ chatId: chatId }, function (doc) {
        if (doc) {
            bot.sendMessage(msg.chat.id, 'Serviço cancelado com sucesso!').then(function () { });
        }
    })
});

console.log('Bot server started.');

module.exports = bot;