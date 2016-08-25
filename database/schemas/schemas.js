var mongoose = require('mongoose');

var schemas = {};

schemas.pillReminder = mongoose.Schema({
    chatId: String,
    alertMessage: String,
    tookThePill: Boolean,
    loop: Boolean
});

module.exports = schemas;