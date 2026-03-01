function handler(event) {
	var request = event.request;
	var uri = request.uri;

	if (!uri.startsWith('/app/')) {
		return request;
	}

	var lastSegment = uri.substring(uri.lastIndexOf('/') + 1);
	var looksLikeFile = lastSegment.indexOf('.') !== -1;

	if (looksLikeFile) {
		return request;
	}

	request.uri = '/app/index.html';
	return request;
}
