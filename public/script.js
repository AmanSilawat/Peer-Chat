let socket = io('/');
let local_video;
let local_video_element = document.createElement('video');
local_video_element.muted = true;
let video_grid = document.getElementById('video_grid');

var peer = new Peer(undefined, { path: '/peerjs', host: '/', port: 7373 });
var peers = {};

navigator.mediaDevices.getUserMedia({
	audio: true,
	video: true
}).then(stream => {
	local_video = stream;

	add_video_stream(local_video_element, local_video);

	peer.on('call', (call)=>{
		call.answer(stream);
		let video = document.createElement('video');
		call.on('stream', (remote_video_stream)=>{
			add_video_stream(video, remote_video_stream);
		});
	});

	socket.on('user-connected', (USERID) => {
		connect_to_new_user(USERID, stream);
	});

	socket.on('user-disconnected', (USERID) => {
		if (peers[USERID]) { // userid in peers
			peers[USERID].close();
		}
	});
});

peer.on('open', (ID)=>{
	socket.emit('join-room', ROOMID, ID);
})

function connect_to_new_user(USERID, stream) {
	console.log(stream)
	let call  = peer.call(USERID, stream);
	let video = document.createElement('video');
	call.on('stream', (remote_video_stream)=>{
		add_video_stream(video, remote_video_stream);
	});
	call.on('close', ()=>{
		video.remove();
	});
	peers[USERID] = call;
}

function add_video_stream(video, stream) {
	video.srcObject = stream;
	video.addEventListener('loadedmetadata', () => {
		video.play();
	});
	video_grid.append(video);
}