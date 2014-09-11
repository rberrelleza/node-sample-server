node-sample-server
==================

Sample webserver using nodejs and sqlite3, responds to GET and PUT calls on the root path:

- GET / : Returns the string representation of a hex value stored in the DB.
- PUT / : Receives a string value, and updates the DB with the hex representation of it.


Instructions:
- Run `npm install` on the root folder of the code to install all the dependencies.
- Run `node index.js` to start the webserver.
