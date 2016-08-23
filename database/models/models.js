var mongoose = require('mongoose'),
    schemas = require('../schemas/schemas');

var models = {};

models.PillReminder = mongoose.model('PillReminder', schemas.pillReminder);

module.exports = models;