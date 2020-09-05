const express = require("express");
const app = express();
const server = require("http").Server(app);
const {v4: uuid} = require('uuid');
const port = 7373;

app.use(express.static('public'));

app.set('view engine', 'ejs');
app.get('/', (request, response)=>{
	response.redirect(`/${uuid()}`);
} );

app.get('/:room', (request, response)=>{
	response.render('room', {room_id: request.params.room});  //templat, 
} );


server.listen(port);