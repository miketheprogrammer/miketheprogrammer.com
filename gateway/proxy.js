var seaport = require('seaport');
var server = seaport.createServer()
server.listen(9091);

var bouncy = require('bouncy');

var http = require('http')
var httpProxy = require('http-proxy')

var main_site = {
    www:true,
    miketheprogrammer:true,
    index:true
}
var branches = {
    stable: '0.1.x',
    unstable: '0.1.x'
}
httpProxy.createServer(function ( req, res, proxy ) {
    var domains = (req.headers.host || '').split('.')
    var service = {
	protocol: undefined,
	version: undefined,
	toString: function ( ) { return this.protocol + '@' + this.version }
    }
    if ( domains[0] in main_site ) {
	service.protocol = 'main'
	service.version = branches['stable']
    } else {
	service.protocol = domains[0]
	if ( domains.length === 4 ) {
	    service.version = branches[domains[1]]
	} else if ( domains.length === 3 ) {
	    service.version = branches['stable']
	} else {
	    service.protocol = 'main'
	    service.version = branches['stable']
	}
    }
    var ps = server.query(service.toString())

    if (ps.length === 0) {
        res.end('service not available\n' + JSON.stringify(ps))
    }
    else {

	var target = ps[Math.floor(Math.random() * ps.length)]
	proxy.proxyRequest(req, res, {
	    port: target.port,
	    host: target.host
	})
    }
}).listen(9090);