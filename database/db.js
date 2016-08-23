var mongoose = require('mongoose');

console.log('Starting Database');

//process.env.MONGOLAB_URI

mongoose.connect(process.env.MONGOLAB_URI, function (error) {
    if (error) console.error(error);
    else console.log('mongo connected');
});

console.log('Database started');

module.exports = mongoose;