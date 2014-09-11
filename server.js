var http = require("http");

function start(application){
	console.log("starting...");
	function onRequest(request, response){
		switch(request.method){
			case "GET":
				console.log("serving a GET request");
				application.get(function(value, error){
					if(error){
						response.writeHead("500", {"content-type":"text/plain"});
					}else{
						response.writeHead("200", {"content-type":"text/plain"});
						response.write(value);
					}
					
					response.end();
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
						response.writeHead("400", {"content-type":"text/plain"});
						response.write("Body is missing");
						response.end();
					}
					application.put(body, function(error){
						if(error){
							response.writeHead("500", {"content-type":"text/plain"});
						}else{
							response.writeHead("204", {"content-type":"text/plain"});
						}

						response.end();
					})
				});
				
				break;
			default:
				response.writeHead("405", {"content-type":"text/plain"});
				response.end();
				break;
		}		
	}

	http.createServer(onRequest).listen(8000);
	console.log("listening...");
}

exports.start = start;