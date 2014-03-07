var http = require('http')
var seaport = require('seaport')
var ports = seaport.connect(9091)
var port = ports.register('main@0.1.0')
var mh = require('minnahtml').mh
var ecstatic = require('ecstatic')(__dirname + '/static')



http.createServer(function ( req, res ) {
    if ( req.url.indexOf('static') != -1 ){
	ecstatic(req, res)
    } else {
	res.writeHead(200, {'Content-Type': 'text/html'});
	var html = new mh.Html()
	var head = new mh.Head(html)
	new mh.Title(head).data.content = 'Welcome to MikeTheProgrammer.com '
	var body = new mh.Body(html)
	new mh.Heading4(body).data.content = 'Welcome';
	new mh.Paragraph(body).data.content = ''
	    + 'Please Click one of the following links to view live'
	    + 'Demos and applications'
	    + '<br/><a href=\'http://codeshare.miketheprogrammer.com\'>CodeShare</a> ( Live Collaborative Code Editing Tool )'
	    + '<br/><a href=\'http://singlepad.miketheprogrammer.com\'>SinglePad</a> ( Live Collaborative Note Pad )'
	    + '<br/><br/>Other Projects<br/>'
	    + '<a href=\'http://miketheprogrammer.github.io/node-ml\'>Node-ml</a> A Collection of Machine Learning Algorithms for Node'
	    + '</br>'
	    + '<a href=\'http://miketheprogrammer.github.io/strawberrypy/\'>StrawberryPy</a> A Lightweight Restfull API Server, with an integrated Mongo DB Schema Versioned Engine'
	    + '<br/><a href=\'https://github.com/miketheprogrammer/object-stream\'>Object-Stream</a> A Node Library for transforming Objects through a stream'
	    + '<br/>'
	    + '<a href=\'https://github.com/miketheprogrammer/pipeline\'>pipeline</a> A Node Module for creating a pipeline of Streams'
	    + '<br/>'
	    + '<a href=\'https://github.com/miketheprogrammer/NodeCloud\'>NodeCloud</a> An Evented Network Stream Clustering Solution in Node'
	    + '<br/>'
	    + '<a href=\'https://github.com/miketheprogrammer/instantiate\'>Instantiate</a> Instantiate a Javascript Object from an array of arguments'
	    + '<br/>'
	    

	res.end(html.generateHtml());
    }
}).listen(port)