
window.join_chat = function join_chat() {
	window.isChatting = true;
	const roomName = JSON.parse(document.getElementById('room-name').textContent);
	const csrfToken = document.getElementById('csrf-token').value;

	const chatSocket = new WebSocket(
		'wss://'
		+ window.location.host
		+ '/ws/chat/'
		+ roomName
		+ '/'
	);
	window.chatSocket = chatSocket;

	chatSocket.onmessage = function (e) {
		const data = JSON.parse(e.data);
		if (data.message_history) {
			data.message_history.forEach(elem => {
				addMessage(elem, data.user);
			});
			markChatAsRead(data.chat_id, data.user)
		}
		if (data.message) {
			addMessage(data, data.user);
			markChatAsRead(data.chat_id, data.user)
		}
	};

	function addMessage(data, user) {
		var chat_message = document.createElement("p");

		if (data.message.startsWith('<a link href="/game/') && data.message.endsWith('">Hi! I would like to invite you to play a game. Do you accept?</a>')) {
			chat_message.innerHTML = data.message;
		} else {
			chat_message.innerText = data.message;
		}
		chat_message.className = data.sender == user ?  "me" : "you";
		document.querySelector("#chat-content").prepend(chat_message);
	}

	function markChatAsRead(chat_id, user_name) {
		const url = '/chat/mark-chat-as-read/' + chat_id + '/' + user_name + '/';
		fetch(url, {
			method: 'POST',
			headers: {
				'X-CSRFToken': csrfToken
			},
			credentials: 'same-origin'
		})
			.then(response => {
				if (response.ok) {
					//console.log('Mensaje marcado como leído en la base de datos');
				} else {
					console.error('Error al marcar el mensaje como leído');//Borrar?
				}
			})
			.catch(error => {
				console.error('Error:', error);
			});
	}

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
	document.querySelector("#chat-button").classList.add("hidden");
	document.querySelector("#chat-container").classList.remove("hidden");
}

window.close_chat = function close_chat() {
	if (chatSocket)
	{
		chatSocket.close();
		window.chatSocket = undefined;

	}
	window.isChatting = false;
}

window.invite_game = function invite_game(id_chat){
	var message = '<a link href="/game/' + id_chat + '">Hi! I would like to invite you to play a game. Do you accept?</a>';
	document.getElementById('chat-message-input').value = message;
	document.getElementById('chat-message-submit').click();
}