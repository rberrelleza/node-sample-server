var buffer = require("buffer");
var fs = require("fs");
var sqlite3 = require('sqlite3').verbose();

var db = null;
var dbName = "data.db";
var id=1;

function initializeDB(file){
	var db = new sqlite3.Database(file);
	if(!fs.existsSync(file)){
		console.log("creating database file");
		fs.openSync(file, "w");
		db.run("CREATE TABLE storage (id INTEGER PRIMARY KEY, value TEXT)", function(createResult){
			if(createResult) throw createResult;

			db.run("INSERT INTO storage(id, value) VALUES($id, '')", {$id:id}, function(insertResult){
			if(insertResult) throw insertResult;
		})});
		
		console.log("database initialized");
	}

	return db;
}

function get(callback){
	db.all("SELECT * FROM storage WHERE id=$id", {$id:id}, function(err, rows)
		{
			var value = null;
			var error = null;

			if(err){
				error = err;
				console.log("there was an error when querying for data: " + err);
			}else if(rows.length == 0){
				console.log("didn't receive any rows");
				error = "didn't receive any rows"
			}else
			{
				value = new Buffer(rows[0].value, "hex").toString();
			}

			callback(value, error);
		});
}

function put(value, callback){
	hexValue = new Buffer(value).toString("hex");
	db.run("UPDATE storage SET value=$value WHERE id=$id",
	{ $id: id, $value:hexValue }, 
	function(error){
		if(!error){
			console.log("inserted the data succesfully into the database");
			callback(null);
		}else{
			console.log("error when inserting into the DB: " + result);
			callback(error);
		}
	});
}

db = initializeDB(dbName);
exports.get = get;
exports.put = put;