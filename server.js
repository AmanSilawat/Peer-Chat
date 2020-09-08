const express = require("express");
const app = express();
const server = require("http").Server(app);
const {v4: uuid} = require('uuid');
const {ExpressPeerServer} = require("peer");
const peer_server = ExpressPeerServer(server, {debug: true});

const port = 7373;
const io = require("socket.io")(server);

app.use(express.static('public'));
app.use('/peerjs', peer_server);

app.set('view engine', 'ejs');
app.get('/', (request, response)=>{
	response.redirect(`/${uuid()}`);
} );

app.get('/:room', (request, response)=>{
	response.render('room', {room_id: request.params.room});
} );


io.on('connect', (socket)=> {
	socket.on('join-room', (ROOMID, USERID)=>{
		socket.join(ROOMID);
		socket.to(ROOMID).broadcast.emit('user-connected', USERID);
		socket.on('disconnect', ()=>{
			socket.to(ROOMID).broadcast.emit('user-disconnected', USERID);
		})
	});
});


server.listen(port);