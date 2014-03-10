var express         = require('express');
var app             = express();
var fs              = require('fs');
var trumpet         = require('trumpet');
var format          = require('util').format;
app.use('/assets', express.static('public'));


app.get('/', function (req, res) {
    res.setHeader('Content-Type', 'text/html');
    var files = fs.readdirSync('./public/music');
    console.log(files);
    //distortedsoul+distortedsoul
    var tr = trumpet();
    tr.pipe(res);
    var writable = tr.select('div#auto-music').createWriteStream();
    files.forEach(function(v) {
        var name = v.split('distortedsoul+distortedsoul')[1].split('.mp3')[0];
        console.log(name);
        writable.write(format(fs.readFileSync('./public/music.tmpl').toString('utf8'),'Distorted Soul - ' + name, v));
    });
    writable.end(null);
    var readable = fs.createReadStream(__dirname+'/public/index.html');
    readable.pipe(tr);
    readable.on('end', function () {
        console.log('reading done');
        tr.end();
        res.end();
    })
})

app.get('/music', function (req, res) {
    res.setHeader('Content-Type', 'text/html');
    fs.createReadStream(__dirname+'/public/smtest.html').pipe(res);
})

app.get('/soundmanager2.swf', function (req,res) {
    fs.createReadStream(__dirname+'/public/soundmanager2/swf/soundmanager2.swf').pipe(res);
});

app.get('/dirty.mp3', function(req,res) {
    res.setHeader('Content-Type', 'audio/mpeg');
    fs.createReadStream(__dirname+'/public/dirty.mp3').pipe(res);
})
app.listen(3000);
