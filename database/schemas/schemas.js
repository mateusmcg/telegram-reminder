var mongoose = require('mongoose');

var schemas = {};

schemas.pillReminder = mongoose.Schema({
    chatId: String,
    userName: String,
    userNameChangeDate: Date,
    alertMessage: String,
    alertMessageChangeDate: Date,
    pause: Boolean,
    daysInPause: Number,
    days: Number,
    maxDays: Number
});

module.exports = schemas;