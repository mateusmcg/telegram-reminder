var mongoose = require('mongoose');

var schemas = {};

schemas.pillReminder = mongoose.Schema({
    chatId: String,
    userName: String,
    userNameChangeDate: Date,
    alertMessage: String,
    alertMessageChangeDate: Date,
    pause: Boolean,
    manualPause: Boolean,
    daysInPause: Number,
    days: Number,
    maxDays: Number,
    answeredCallBackQuery: Boolean
});

schemas.alarmReminder = mongoose.Schema({
    chatId: String,
    remind: Boolean
});

module.exports = schemas;