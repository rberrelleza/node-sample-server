var http = require("http");

function finalize(response, status, headers, body){
	response.writeHead(status, headers);
	if(body){
		response.write(body);
	}

	response.end();
}

function start(application){
	console.log("starting...");
	function onRequest(request, response){
		switch(request.method){
			case "GET":
				console.log("serving a GET request");
				application.get(function(value, error){
					if(error){
						finalize(response, "500", {"content-type":"text/plain"});
					}else{
						finalize(response, "200", {"content-type":"text/plain"}, value);
					}
				});
				break;
			case "PUT":
				console.log("serving a PUT request");
				var body = '';
				request.on('data', function(chunk){	
					body += chunk;
				});

				request.on('end', function()
				{
					if(!body) {
						finalize(response, "400", {"content-type":"text/plain"}, "Body is missing");
					}
					application.put(body, function(error){
						if(error){
							finalize(response, "500", {"content-type":"text/plain"});
						}else{
							finalize(response, "204", {"content-type":"text/plain"});
						}

						response.end();
					})
				});
				
				break;
			default:
				finalize(response, "405", {"content-type":"text/plain"});
				break;
		}		
	}

	http.createServer(onRequest).listen(8000);
	console.log("listening...");
}

exports.start = start;