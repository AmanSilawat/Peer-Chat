let socket = io('/');
let local_video;
let local_video_element = document.createElement('video');
local_video_element.muted = true;
let video_grid = document.getElementById('video-grid');

var peer = new Peer(undefined, { path: '/peerjs', host: '/', port: "443" });
var peers = {};

navigator.mediaDevices.getUserMedia({
	audio: true,
	video: true
}).then(stream => {
	local_video = stream;

	add_video_stream(local_video_element, local_video);

	peer.on('call', (call) => {
		call.answer(stream);
		let video = document.createElement('video');
		call.on('stream', (remote_video_stream) => {
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

	socket.on('create-message', (message) => {
		document.querySelector('ul.messages').insertAdjacentHTML('beforeend', `<li class='message'><b>user</b><br />${message}</li>`);
		document.querySelector('li.message:last-child').scrollIntoView();
	});
});

peer.on('open', (ID) => {
	socket.emit('join-room', ROOMID, ID);
})

function connect_to_new_user(USERID, stream) {
	let call = peer.call(USERID, stream);
	let video = document.createElement('video');
	call.on('stream', (remote_video_stream) => {
		add_video_stream(video, remote_video_stream);
	});
	call.on('close', () => {
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

function audio_on_off() {
	const enabled = local_video.getAudioTracks()[0].enabled;
	if (enabled) {
		local_video.getAudioTracks()[0].enabled = false;
		mic_unmute();
	}
	else {
		local_video.getAudioTracks()[0].enabled = true;
		mic_mute();
	}
}

function video_on_off() {
	const enabled = local_video.getVideoTracks()[0].enabled;
	if (enabled) {
		local_video.getVideoTracks()[0].enabled = false;
		video_off();
	}
	else {
		local_video.getVideoTracks()[0].enabled = true;
		video_on();
	}
}

const mic_mute = () => {
	document.querySelector('.mute-button').innerHTML = `<i class="fas fa-microphone"></i><span>Mute</span>`;
};

const mic_unmute = () => {
	document.querySelector(
		'.mute-button'
	).innerHTML = `<i class="unmute fas fa-microphone-slash"></i><span>Unmute</span>`;
};

const video_on = () => {
	document.querySelector('.video-button').innerHTML = `<i class="fas fa-video"></i><span>Stop Video</span>`;
};

const video_off = () => {
	document.querySelector('.video-button').innerHTML = `<i class="stop fas fa-video-slash"></i><span>Play Video</span>`;
};

document.getElementById('chat-message').addEventListener('keydown', (event) => {
	if (event.which == 13 && event.target.value.trim() != '') {
		socket.emit('message', event.target.value);
		event.target.value = '';
	}
});