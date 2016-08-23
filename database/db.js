var mongoose = require('mongoose');

console.log('Starting Database');

mongoose.connect(process.env.MONGOLAB_URI, function (error) {
    if (error) console.error(error);
    else console.log('mongo connected');
});

console.log('Database started');

module.exports = mongoose;