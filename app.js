require('./database/db');
var bot = require('./bot/pill-reminder-bot');
require('./web-api/api')(bot);