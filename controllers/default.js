exports.install = function() {
	ROUTE('GET /', index);
	ROUTE('SOCKET /{id}/', socket, 1024 * 10);
};

function index($) {
	if ($.query.socket)
		$.view('index');
	else
		$.redirect('https://floweditor.totaljs.com');
}

function socket($) {

	var flow = null;

	$.autodestroy();

	$.on('open', function(client) {
		client.isflowstream = client.headers['user-agent'] === 'Total.js/v4' || client.headers['user-agent'] === 'Total.js/v5';
		if (client.isflowstream) {
			flow = client;
			if ($.online > 1)
				flow.send({ TYPE: 'flow' });
		} else if (!flow)
			client.close(4004);
	});

	$.on('close', function(client) {
		if (client.isflowstream) {
			flow = null;
			$.close();
		}
	});

	$.on('message', function(client, msg) {
		$.send(msg, c => c !== client);
	});

}