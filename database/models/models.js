var mongoose = require('mongoose'),
    schemas = require('../schemas/schemas');

var models = {};

models.PillRemidner = mongoose.model('PillRemidner', schemas.pillReminder);

module.exports = models;