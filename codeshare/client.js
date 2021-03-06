var RText     = require('r-edit')
var reconnect = require('reconnect')
var reloader  = require('client-reloader')
var widget    = require('r-edit/widget')
var MuxDemux = require('mux-demux')
var rText = RTEXT = RText()
var shoe = require('./shoe-browser')
var inject = require('reconnect/inject');
var mdm = reconnect(function(stream) {
    mdm = shoe(stream);
    mdm.on('connection', function(){
    })

    var c = mdm.createStream('createStream~main~1')
    c.pipe(rText.createStream()).pipe(c)

    //using the default template...
    document.body.appendChild(rText.widget())

}).connect('/stream')

//createNew()
window.output = '';
function xeval(){
    eval(rText.text());
    document.getElementById('eval').innerHTML = output;
}
window.xeval = xeval;
var i = 2;
function createNew() {
    var node = createTextModel()
    document.body.appendChild(document.createElement("br"));
    document.body.appendChild(node.widget)
    i+=1;
    var s = mdm.createStream('createStream~'+i)
    s.pipe(node.model.createStream()).pipe(s)

    node.model.wrap(node.widget);
}
window.createNew = createNew

function createTextModel (cols, rows, max) {
    cols = cols || 40;
    rows = rows || 1;
    maxlength = max || cols * rows;
    var model = RText()
    var ta = createTextArea(cols, rows, max)
    
    return {model:model, widget:ta}; 
}

function createTextArea(cols,rows,maxlength) {
    var ta2 = document.createElement('textArea')
    ta2.setAttribute('cols',40)
    ta2.setAttribute('rows',1)
    ta2.setAttribute('maxlength', 40)
    return ta2
}