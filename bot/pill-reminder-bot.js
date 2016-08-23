var TelegramBot = require('node-telegram-bot-api');

console.log('Starting bot server.');

var bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

bot.setWebHook(process.env.HEROKU_URL + bot.token);

bot.onText(/^\/start/, function (msg, match) {
    var chatId = msg.chat.id;
    bot.sendMessage(msg.chat.id, 'Agora você receberá notificações às 00:30. \nCaso queira cancelar o serviço, utilize o comando /cancel !').then(function () {
        // reply sent!
    });
});

bot.onText(/^\/cancel/, function (msg, match) {
    var chatId = msg.chat.id;
    bot.sendMessage(msg.chat.id, 'Serviço cancelado com sucesso!!').then(function () {
        // reply sent!
    });
});

console.log('Bot server started.');

module.exports = bot;