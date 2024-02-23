window.join_chat = function join_chat() {
	const roomName = JSON.parse(document.getElementById('room-name').textContent);
	const csrfToken = document.getElementById('csrf-token').value;

	const chatSocket = new WebSocket(
		'ws://'
		+ window.location.host
		+ '/ws/chat/'
		+ roomName
		+ '/'
	);

	chatSocket.onmessage = function (e) {
		const data = JSON.parse(e.data);
		if (data.message_history) {
			data.message_history.forEach(elem => {
				document.querySelector('#chat-log').value += (`${elem.sender}: ${elem.message}` + '\n');
				if (elem.sender != data.user)
					markMessageAsRead(elem.id);
			});
		}
		if (data.message) {
			document.querySelector('#chat-log').value += (`${data.sender}: ${data.message}` + '\n');
			if (data.sender != data.user)
				markMessageAsRead(data.message_id);
		}
	};

	function markMessageAsRead(messageId) {
		const url = '/mark-message-as-read/' + messageId + '/';
		fetch(url, {
			method: 'POST',
			headers: {
				'X-CSRFToken': csrfToken
			},
			credentials: 'same-origin'
		})
			.then(response => {
				if (response.ok) {
					console.log('Mensaje marcado como leído en la base de datos');
				} else {
					console.error('Error al marcar el mensaje como leído');
				}
			})
			.catch(error => {
				console.error('Error:', error);
			});
	}

	chatSocket.onclose = function (e) {
		console.error('Chat socket closed unexpectedly');
	};

	document.querySelector('#chat-message-input').focus();
	document.querySelector('#chat-message-input').onkeyup = function (e) {
		if (e.keyCode === 13) {  // enter, return
			document.querySelector('#chat-message-submit').click();
		}
	};

	document.querySelector('#chat-message-submit').onclick = function (e) {
		const messageInputDom = document.querySelector('#chat-message-input');
		const message = messageInputDom.value;
		chatSocket.send(JSON.stringify({
			'message': message
		}));
		messageInputDom.value = '';
	};
	document.querySelector("#chat-button").classList = ["hidden"];
	document.querySelector("#chat-container").classList = [];
}