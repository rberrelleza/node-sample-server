var buffer = require("buffer");
var fs = require("fs");
var sqlite3 = require('sqlite3').verbose();
var sjcl = require('sjcl');

var dbName = "data.db";
var db = _initializeDB(dbName);
var id=1;

function _initializeDB(file){
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

function _hexDecode(hexValue){
    var bits = sjcl.codec.hex.toBits(hexValue);
    var strValue = sjcl.codec.utf8String.fromBits(bits);
    return strValue;
}

function _hexEncode(strValue){
    var bits = sjcl.codec.utf8String.toBits(strValue);
    var hexValue = sjcl.codec.hex.fromBits(bits);
    return hexValue;
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
                value = _hexDecode(rows[0].value);
            }

            callback(value, error);
        });
}

function put(value, callback){
    hexValue = _hexEncode(value);
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

exports.get = get;
exports.put = put;