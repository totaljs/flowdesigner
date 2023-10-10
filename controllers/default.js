exports.install = function() {
	ROUTE('GET /', index);
	ROUTE('SOCKET /{id}/', socket, 1024 * 10);
};

function index() {
	var $ = this;
	if ($.query.socket)
		$.view('index');
	else
		$.redirect('https://floweditor.totaljs.com');
}

function socket() {

	var $ = this;
	var flow = null;

	$.autodestroy();

	$.on('open', function(client) {
		if (client.query.flow || client.query.flowstream) {
			flow = client;
			if ($.online > 1)
				flow.send({ TYPE: 'flow' });
		} else if (!flow)
			client.close(4004);
	});

	$.on('close', function(client) {
		if (client.query.flow || client.query.flowstream)
			flow = null;
	});

	$.on('message', function(client, msg) {
		$.send(msg, c => c !== client);
	});

}