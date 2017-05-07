var TelegramBot = require('node-telegram-bot-api'),
    Models = require('../database/models/models');

console.log('Starting bot server.');

var bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

bot.setWebHook(process.env.HEROKU_URL + bot.token);

bot.onText(/^\/start/, function (msg, match) {
    var chatId = msg.chat.id.toString();
    Models.PillReminder.where({ chatId: chatId }).findOne(function (err, doc) {
        if (doc) {
            bot.sendMessage(msg.chat.id, 'Você já está com o serviço de lembrete ligado. Caso queira desativar utilize o comando /cancel ou /pause para pausar as notificações.').then(function () { });
        } else {
            var userName = msg.from.first_name;
            var newChat = new Models.PillReminder({
                chatId: chatId,
                userName: msg.from.first_name,
                alertMessageChangeDate: new Date(),
                pause: false,
                manualPause: false,
                days: 0,
                maxDays: 21,
                daysInPause: 0,
                answeredCallBackQuery: false
            });
            newChat.save(function (err, newChat) {
                bot.sendMessage(msg.chat.id, userName + ', agora você receberá notificações às 00:30. \nCaso queira cancelar o serviço, utilize o comando /cancel ou /pause para pausar as notificações.').then(function () { });
            });
        }
    });
});

bot.onText(/^\/alarmon/, function (msg, match) {
    var chatId = msg.chat.id.toString();
    Models.AlarmReminder.where({ chatId: chatId }).findOne(function (err, doc) {
        if (doc) {
            bot.sendMessage(msg.chat.id, 'Você já está com o serviço de lembrete do despertador ligado. Caso queira desativar utilize o comando /cancelalarm.').then(function () { });
        } else {
            var userName = msg.from.first_name;
            var newChat = new Models.AlarmReminder({
                chatId: chatId,
                remind: true
            });
            newChat.save(function (err, newChat) {
                bot.sendMessage(msg.chat.id, userName + ', agora você receberá notificações toda sexta-feira às 06:00. \nCaso queira cancelar o serviço, utilize o comando /cancelalarm.').then(function () { });
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

bot.onText(/^\/alarmoff/, function (msg, match) {
    var chatId = msg.chat.id.toString();
    Models.AlarmReminder.where({ chatId: chatId }).findOneAndRemove(function (err, doc) {
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

    Models.PillReminder.update({ chatId: chatId }, { alertMessage: newMessage, alertMessageChangeDate: new Date() }, {}, function (err, result) {
        bot.sendMessage(chatId, 'Mensagem de alerta alterada com sucesso para ' + newMessage).then(function () { });
    });
});

bot.onText(/^\/getmessage/, function (msg, match) {
    var chatId = msg.chat.id.toString();

    Models.PillReminder.where({ chatId: chatId }).findOne(function (err, doc) {
        if (doc) {
            if (doc.alertMessage) {
                bot.sendMessage(chatId, 'Sua mensagem de alerta é "' + doc.alertMessage + '"').then(function () { });
            } else {
                bot.sendMessage(chatId, 'Você ainda não definiu uma mensagem, portanto irei te enviar isso: "' + process.env.TELEGRAM_BOT_MESSAGE + '"').then(function () { });
            }
        } else {
            bot.sendMessage(chatId, 'Cadastro não encontrado, tente reiniciar o bot, ou contate o administrador.').then(function () { });
        }
    });
});

bot.onText(/^\/setname (.+)/, function (msg, match) {
    var chatId = msg.chat.id.toString();
    var newName = match[1];

    Models.PillReminder.update({ chatId: chatId }, { userName: newName, userNameChangeDate: new Date() }, {}, function (err, result) {
        bot.sendMessage(chatId, 'Irei te chamar de ' + newName + ' de agora em diante! :D').then(function () { });
    });
});

bot.onText(/^\/setdays (.+)/, function (msg, match) {
    var chatId = msg.chat.id.toString();
    var newDay = match[1];

    Models.PillReminder.update({ chatId: chatId }, { days: newDay }, {}, function (err, result) {
        bot.sendMessage(chatId, 'Ok, agora vc está no ' + newDay + 'º dia.').then(function () { });
    });
});

bot.onText(/^\/getdays/, function (msg, match) {
    var chatId = msg.chat.id.toString();

    Models.PillReminder.where({ chatId: chatId }).findOne(function (err, doc) {
        if (doc) {
            var daysToGo = doc.maxDays - doc.days;
            if (doc.days == 0) {
                bot.sendMessage(chatId, doc.userName, ', vc ainda não tomou nenhum comprimido esse mês!\nFaltam: ' + daysToGo + ' dias.').then(function () { });
            } else if (doc.days > 0 && doc.days < 21) {
                bot.sendMessage(chatId, doc.userName, ', vc já tomou ' + doc.days + ' comprimidos esse mês!\nFaltam: ' + daysToGo + ' dias.').then(function () { });
            } else {
                bot.sendMessage(chatId, doc.userName, ', vc já tomou todos os comprimidos esse mês! Aguarde mais ' + (8 - doc.daysInPause) + ' para começar a nova cartela!').then(function () { });
            }

            if (doc.pause) {
                bot.sendMessage(chatId, doc.userName + ', seu serviço está em pausa por ' + daysInPause + ' dias, portanto os dias informados acima podem estar desatualizados.').then(function () { });
            }
        } else {
            bot.sendMessage(chatId, 'Cadastro não encontrado, tente reiniciar o bot, ou contate o administrador.').then(function () { });
        }
    });
});

bot.onText(/^\/pause/, function (msg, match) {
    var chatId = msg.chat.id.toString();

    Models.PillReminder.where({ chatId: chatId }).findOne(function (err, doc) {
        if (doc) {
            if (doc.pause) {
                bot.sendMessage(chatId, doc.userName + ', você já está no intervalo de 8 dias. Faltam ' + (8 - doc.daysInPause) + ' dias para começar a nova cartela').then(function () { });
            } else if(doc.manualPause){
                bot.sendMessage(chatId, doc.userName + ', seu serviço já está pausado! :)').then(function () { });
            } else {
                Models.PillReminder.update({ chatId: chatId }, { manualPause: true }, {}, function (err, result) {
                    bot.sendMessage(chatId, 'Ok, vou dar uma pausa nos meus serviços e descansar um pouco! Obrigado! :D').then(function () { });
                });
            }
        } else {
            bot.sendMessage(chatId, 'Cadastro não encontrado, tente reiniciar o bot, ou contate o administrador.').then(function () { });
        }
    });
});

bot.onText(/^\/unpause/, function (msg, match) {
    var chatId = msg.chat.id.toString();

    Models.PillReminder.where({ chatId: chatId }).findOne(function (err, doc) {
        if (doc) {
            if (!doc.pause && !doc.manualPause) {
                bot.sendMessage(chatId, doc.userName + ', seu serviço já está operando normalmente! :)').then(function () { });
            } else if(doc.pause){
                bot.sendMessage(chatId, doc.userName + ', você já está no intervalo de 8 dias. Faltam ' + (8 - doc.daysInPause) + ' dias para começar a nova cartela. Não é possível interromper essa pausa.').then(function () { });
            } else {
                Models.PillReminder.update({ chatId: chatId }, { manualPause: false }, {}, function (err, result) {
                    bot.sendMessage(chatId, 'Ok, o descanso foi bom mas está na hora de voltar a trabalhar né!\nHoje eu já te lembro ' + doc.userName + ', não se preocupe! :D').then(function () { });
                });
            }
        } else {
            bot.sendMessage(chatId, 'Cadastro não encontrado, tente reiniciar o bot, ou contate o administrador.').then(function () { });
        }
    });
});

bot.onText(/^\/teste/, function (msg, match) {
    var chatId = msg.chat.id.toString();
    bot.sendMessage(chatId, 'Você chegou ao último dia! Deseja fazer a pausa ou emendar a otra cartela?', {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Emendar', callback_data: '01-Emendar' }],
                [{ text: 'Pausar', callback_data: '02-Pausar' }]
            ]
        })
    }).then(function (messageSent) { })

});

// Inline button callback queries
bot.on('callback_query', function (callBackTelegram) {
    console.log(callBackTelegram); // msg.data refers to the callback_data

    var chatId = callBackTelegram.message.chat.id;

    Models.PillReminder.where({ chatId: chatId }).findOne(function (err, doc) {
        if (doc.answeredCallBackQuery) {
            bot.answerCallbackQuery(callBackTelegram.id, doc.userName + ', vc já respondeu a pergunta.', true);
            return;
        }

        switch (callBackTelegram.data) {
            case '01-Emendar': {
                doc.update({ days: 0, answeredCallBackQuery: true }).exec();
                bot.answerCallbackQuery(callBackTelegram.id, 'Ok, vamos emendar! :D', true);
            }
            case '02-Pausar': {
                doc.update({ pause: true, answeredCallBackQuery: true }).exec();
                bot.answerCallbackQuery(callBackTelegram.id, 'Ok, vamos pausar! :D', true);
            }
        }
    });
});

console.log('Bot server started.');

module.exports = bot;