const express = require("express");
const app = express();
const server = require("http").Server(app);
const {v4: uuid} = require('uuid');
// const { Socket } = require("dgram");
const port = 7373;
const io = require("socket.io")(server);

app.use(express.static('public'));

app.set('view engine', 'ejs');
app.get('/', (request, response)=>{
	response.redirect(`/${uuid()}`);
} );

app.get('/:room', (request, response)=>{
	response.render('room', {room_id: request.params.room});  //templat, 
} );

io.on('connect', (socket)=> {
	socket.on('join-room', (ROOMID)=>{
		console.log(ROOMID);
	})
});


server.listen(port);