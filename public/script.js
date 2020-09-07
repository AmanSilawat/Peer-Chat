let socket = io('/');
let local_video;
let local_video_element = document.createElement('video');
local_video_element.muted = true;
let video_grid = document.getElementById('video_grid');

console.log(io('/'))

navigator.mediaDevices.getUserMedia({
	audio: true,
	video: true
}).then(stream => {
	local_video = stream;
	add_video_stream(local_video_element, local_video);
});

socket.emit('join-room', ROOMID);

function add_video_stream(video, stream) {
	video.srcObject = stream;
	video.addEventListener('loadedmetadata', () => {
		video.play();
	});
	video_grid.append(video);
}