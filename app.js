var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.set('port', (process.env.PORT || 5000));
app.set('TELEGRAM_API_URL', process.env.TELEGRAM_BOT_TOKEN)
app.set('TELEGRAM_BOT_TOKEN', process.env.TELEGRAM_BOT_TOKEN)

// set the view engine to ejs
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/status', function (req, res) {
    res.send('GET - Status');
});

app.post('/reminder', function (req, res) {
    var chatId = req.body.update.message.chat.id;
    var message = req.body.update.message.text;
    
    var options = {
        host: app.get('TELEGRAM_API_URL') + app.get('TELEGRAM_BOT_TOKEN'),
        path: '/sendMessage?chatId=' + chatId + '&text=' + message
    };
    
    var sendMessageRequest = http.get(options, function (res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));

        // Buffer the body entirely for processing as a whole.
        var bodyChunks = [];
        res.on('data', function (chunk) {
            // You can process streamed parts here...
            bodyChunks.push(chunk);
        }).on('end', function () {
            var body = Buffer.concat(bodyChunks);
            console.log('BODY: ' + body);
            // ...and/or process the entire body here.
        })
    });

    sendMessageRequest.on('error', function (e) {
        console.log('ERROR: ' + e.message);
    });

    res.send({ "chatId": chatId, "message": message });
});

app.listen(app.get('port'), function () {
    console.log('Example app listening on port ' + app.get('port') + '!');
});