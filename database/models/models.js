var mongoose = require('mongoose'),
    schemas = require('../schemas/schemas');

mongoose.set('debug', true);

var models = {};

models.PillReminder = mongoose.model('PillReminder', schemas.pillReminder);

module.exports = models;