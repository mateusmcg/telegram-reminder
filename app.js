var bot = require('./bot/pill-reminder-bot');
require('./web-api/api')(bot);
require('./database/db');