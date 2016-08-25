var TelegramBot = require('node-telegram-bot-api'),
    Models = require('../database/models/models');

console.log('Starting bot server.');

var bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

bot.setWebHook(process.env.HEROKU_URL + bot.token);

bot.onText(/^\/start/, function (msg, match) {
    var chatId = msg.chat.id.toString();
    Models.PillReminder.where({ chatId: chatId }).findOne(function (err, doc) {
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
    Models.PillReminder.where({ chatId: chatId }).findOneAndRemove(function (err, doc) {
        if (doc) {
            bot.sendMessage(msg.chat.id, 'Serviço cancelado com sucesso!').then(function () { });
        }
    })
});

bot.onText(/^\/setmessage (.+)/, function (msg, match) {
    console.log('Msg obj: ', msg);
    console.log('Match obj: ', match);

    var chatId = msg.chat.id.toString();
    var newMessage = match[1];

    Models.PillReminder.update({ chatId: chatId }, { alertMessage: newMessage }, {}, function (err, result) {
        bot.sendMessage(chatId, 'Mensagem de alerta alterada com sucesso para ' + newMessage).then(function () { });
    });
});

bot.onText(/^\/getmessage/, function (msg, match) {
    var chatId = msg.chat.id.toString();

    Models.PillReminder.where({ chatId: chatId }).findOne(function (err, doc) {
        if (doc) {
            bot.sendMessage(chatId, 'Sua mensagem de alerta é "' + doc.alertMessage + '"').then(function () { });
        } else {
            bot.sendMessage(chatId, 'Chat não encontrado, tente novamente mais tarde, ou contate o administrador.').then(function () { });
        }
    });
});

bot.onText(/^\/loop/, function (msg, match) {
    var chatId = msg.chat.id.toString();
    var options = {
        reply_markup: {
            keyboard: [[{text: 'Ativar'}, {text: 'Desativar'}]],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    }
    bot.sendMessage(chatId, 'Você será notificado a cada 10 minutos até que responda "done". Deseja ativar?', options).then(function (err, log, doc, teste) {
        console.log('err obj: ', err);
        console.log('log obj: ', log);
        console.log('doc obj: ', doc);
        console.log('teste obj: ', teste);
     });
});

console.log('Bot server started.');

module.exports = bot;