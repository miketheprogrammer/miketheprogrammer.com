var level = require('levelup')
var http = require('http')
var ecstatic = require('ecstatic')(__dirname + '/static')
var REdit = require('r-edit')
var shoe = require('./shoe')
var models = {};
var SubLevel = require('level-sublevel');
var udid = require('udid');
var db = SubLevel(level('./persist5'))
var sbDb = db.sublevel('scuttlebutt5')
var level_scuttlebutt = require("level-scuttlebutt")
var seaport = require('seaport');
var ports = seaport.connect(9091);
var port = ports.register('codeshare@0.1.0');

level_scuttlebutt(sbDb, udid('codeshare'), function ( name ){
    console.log("Scuttle: "+name)
    var rText = REdit()
    return rText;
})
shoe(function( stream ) {
    stream.on('error', function ( e ) {
	console.log(e)
    })
    if ( stream.meta.indexOf('createStream') != -1 ) {
        var meta = stream.meta.split('~')
        if ( meta[1] == 'NaN' && meta[1] != '' && meta[1] != undefined)
            return;
	if ( meta[1] == '1' ) return;
        if ( ! ( meta[1] in models ) ) {
            sbDb.open('model~'+meta[1], function (err, model) {
                models[meta[1]] = model;
                setTimeout(function(){
                    var text = model.text();
		    console.log('ORIGINAL', text);
		    console.log('hi');
		    model.on('sync',function() {
			stream.pipe(model.createStream()).pipe(stream)
		    });
                }, 1);

            })
        } else {

            
            stream.pipe(models[meta[1]].createStream()).pipe(stream)
            stream.pipe(process.stderr, {end: false})
        }
        
    }

}).install(http.createServer(ecstatic).listen(port, function () {
    console.log("Server is listening on "+port)
}), '/stream')
