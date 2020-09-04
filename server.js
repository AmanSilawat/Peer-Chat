const express = require("express");
const app = express();
const server = require("http").Server(app);
const port = 7373;

app.get('/', (request, response)=>{
	response.status(200).send('Hello World');
} );

server.listen(port);