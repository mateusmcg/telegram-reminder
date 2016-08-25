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

bot.onText(/^\/loop (.+)/, function (msg, match) {
    var chatId = msg.chat.id.toString();
    var active = match[1];

    if (active) {
        Models.PillReminder.update({ chatId: chatId }, { loop: active }, {}, function (err, result) {
            bot.sendMessage(chatId, 'Serviço de mensagens de repetição ativado com sucesso.').then(function () { });
        });
    } else {
        Models.PillReminder.update({ chatId: chatId }, { loop: active }, {}, function (err, result) {
            bot.sendMessage(chatId, 'Serviço de mensagens de repetição desativado com sucesso.').then(function () { });
        });
    }
});

bot.onText(/^\/tookit (.+)/, function (msg, match) {
    var chatId = msg.chat.id.toString();
    var tookit = match[1];

    if (tookit) {
        Models.PillReminder.update({ chatId: chatId }, { tookThePill: tookit }, {}, function (err, result) {
            bot.sendMessage(chatId, 'Ok, vou parar de te lembrar por agora !').then(function () { });
        });
    } else {
        Models.PillReminder.update({ chatId: chatId }, { tookThePill: tookit }, {}, function (err, result) {
            bot.sendMessage(chatId, 'Ok ok, vou te lembrar, relaxa.').then(function () { });
        });
    }
});

console.log('Bot server started.');

module.exports = bot;