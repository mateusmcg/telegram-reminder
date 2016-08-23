var mongoose = require('mongoose');

var schemas = {};

schemas.pillReminder = mongoose.Schema({
    chatId: String
});

module.exports = schemas;