exports.install = function() {
	ROUTE('GET /', index);
};

function index() {
	var $ = this;
	if ($.query.socket)
		$.view('index');
	else
		$.redirect('https://floweditor.totaljs.com');
}