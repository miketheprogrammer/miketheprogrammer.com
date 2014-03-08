var express         = require('express');
var app             = express();
var fs              = require('fs');

app.use('/assets', express.static('public'));


app.get('/', function (req, res) {
    res.setHeader('Content-Type', 'text/html');
    fs.createReadStream(__dirname+'/public/index.html').pipe(res);
})

app.get('/music', function (req, res) {
    res.setHeader('Content-Type', 'text/html');
    fs.createReadStream(__dirname+'/public/music.html').pipe(res);
})

app.get('/soundmanager2.swf', function (req,res) {
    fs.createReadStream(__dirname+'/public/soundmanager2/swf/soundmanager2.swf').pipe(res);
});

app.get('/dirty.mp3', function(req,res) {
    res.setHeader('Content-Type', 'audio/mpeg');
    fs.createReadStream(__dirname+'/public/dirty.mp3').pipe(res);
})
app.listen(3000);
