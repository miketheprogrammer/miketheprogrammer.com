var express         = require('express');
var app             = express();
var fs              = require('fs');
var trumpet         = require('trumpet');
var format          = require('util').format;
var lame            = require('lame');
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
var throttle = require('throttle'),
    fs = require('fs'),
    probe = require('node-ffprobe');

var current = undefined
function start(file) {
    if (current) {
        current.active = false;
        current.destroy();
    }
    probe(file, function(err, probeData) {
      var bit_rate = probeData.format.bit_rate;
      console.log(bit_rate)
      var currentStream = fs.createReadStream(file);
      var throt = throttle((bit_rate/10) * 1.4); // this multiplier may vary depending on your machine
      currentStream.pipe(throt);
      currentStream.active = true;
      throt.on('data', function(data){
        if (currentStream.active)
            decoder.write(data); // consider the decoder instance from the previous example
      });
      current = currentStream;
    });

}
var encoder = lame.Encoder({channels: 2, bitDepth: 16, sampleRate: 44100});

var decoder = lame.Decoder();
    decoder.on('format', function () {
        decoder.pipe(encoder);
    })

start(__dirname+'/public/music/distortedsoul+distortedsouldirty.mp3');
app.get('/stream.mp3', function (req, res) {

    encoder.on('data', function(b) {
        res.write(b);
    });
});
app.get('/stream.ogg', function (req, res) {

    encoder.on('data', function(b) {
        res.write(b);
    });
});
app.get('/restart', function(req, res) {
    start(__dirname+'/public/music/distortedsoul+distortedsoulonchetlaminim.mp3');
    res.end();
});
app.get('/play', function(req, res) {
    var song = req.param('song');
    console.log(song);
    start(__dirname+'/public/music/distortedsoul+distortedsoul'+song+'.mp3');
    res.end();
});
app.listen(3000);
