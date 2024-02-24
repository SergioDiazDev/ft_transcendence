function friend_html(username, id) {
	console.log(username, id);
	return (`<section class="row">
	<div>
		<button onclick="make_friend('${id}')"> ${username} </button>
	</div>
	</section>`);
}

function make_friend(id) {
	//const csrfToken = document.getElementById('csrf-token').value;
	const url = '/accounts/make-friend/' + id + '/';
	console.error('URLLL:', url);
	fetch(url, {
		method: 'POST',
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

window.find_user = function find_user(find) {
	var url = "/accounts/user/" + find;
	fetch(url)
		.then(response => response.json())
		.then(json => {
			console.log(json);
			document.querySelector("#find_container").innerHTML = friend_html(json.username, json.id);
		});
}