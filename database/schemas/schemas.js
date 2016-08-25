var mongoose = require('mongoose');

var schemas = {};

schemas.pillReminder = mongoose.Schema({
    chatId: String,
    alertMessage: String
});

module.exports = schemas;