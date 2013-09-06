var level = require('levelup')
var multilevel = require('multilevel')
var net = require('net')
var http = require('http')
var https = require('https')
var es = require('event-stream')

var LiveDB = require('level-live-stream')
var ecstatic = require('ecstatic')(__dirname + '/static')
var REdit = require('r-edit')
var scuttlebucket = require('scuttlebucket')
var shoe = require('./shoe')
var reloader = require('client-reloader')
var MuxDemux = require('mux-demux')
var models = {};
var SubLevel = require('level-sublevel');
var udid = require('udid');

var db = SubLevel(level('./persist5'))
var sbDb = db.sublevel('scuttlebutt5')
var level_scuttlebutt = require("level-scuttlebutt")

level_scuttlebutt(sbDb, udid('persist5-app'), function ( name ){
    console.log("Scuttle: "+name)
    var rText = REdit()
    return rText;
})
shoe(function( stream ) {

    if ( stream.meta.indexOf('createStream') != -1 ) {
        var meta = stream.meta.split('~')
        if ( meta[1] == 'NaN' && meta[1] != '' && meta[1] != undefined)
            return;
	if ( meta[1] == '1' ) return;
        if ( ! ( meta[1] in models ) ) {
            sbDb.open('model~~'+meta[1], function (err, model) {
                models[meta[1]] = model;
                setTimeout(function(){
                    var text = model.text();
		    console.log('ORIGINAL', text);
		    console.log('hi');
		    model.on('sync',function() {
			stream.pipe(model.createStream()).pipe(stream)
		    });

                    //stream.pipe(process.stderr, {end: false})
                    //model.text('')
                    //model.push(text);

                }, 1);

            })
        } else {

            
            stream.pipe(models[meta[1]].createStream()).pipe(stream)
            stream.pipe(process.stderr, {end: false})
        }
        
    }

}).install(http.createServer(ecstatic).listen(parseInt(process.argv[2]), function () {
    console.log("Server is listening on "+parseInt(process.argv[2]))
}), '/stream')


function requestModel ( request ) {
    
}



