function friend_html(username, id) {
	console.log(username, id);
	return (`<section class="row">
	<div>
		<button onclick="make_friend('${username}')"> ${username} </button>
	</div>
	</section>`);
}

function make_friend(username) {
	const csrfToken = document.getElementById('csrf-token').value;
	const url = '/accounts/make-friend/' + username;
	fetch(url, {
		method: 'POST',
		headers: {
			'X-CSRFToken': csrfToken
		},
		credentials: 'same-origin'
	})
		.then(response => response.json())
		.then( json => {
			alert("Invitation Sent.");
			console.log(json);
		});
}

function accept_friend(invitation_id) {
	const csrfToken = document.getElementById('csrf-token').value;
	const url = '/accounts/accept-friend/' + invitation_id;
	fetch(url, {
		method: 'POST',
		headers: {
			'X-CSRFToken': csrfToken
		},
		credentials: 'same-origin'
	})
		.then(response => response.json())
		.then(json => {
			if (json.status === "ok")
				loadPanel("/accounts/friends_panel");
		});
}

function block_friend(invitation_id) {
	const csrfToken = document.getElementById('csrf-token').value;
	const url = '/accounts/block-friend/' + invitation_id;
	fetch(url, {
		method: 'POST',
		headers: {
			'X-CSRFToken': csrfToken
		},
		credentials: 'same-origin'
	})
		.then(response => response.json())
		.then(json => {
			if (json.status === "ok")
				loadPanel("/accounts/friends_panel");
		});
}

function block_friend_name(username) {
	const csrfToken = document.getElementById('csrf-token').value;
	const url = '/accounts/block-friend-name/' + username;

	if (window.confirm("Are you sure you want to block " + username + "?" + " This action is irreversible!")) {
		fetch(url, {
			method: 'POST',
			headers: {
				'X-CSRFToken': csrfToken
			},
			credentials: 'same-origin'
		})
			.then(response => response.json())
			.then(json => {
				if (json.status === "ok")
					loadPanel("/accounts/friends_panel");
			});
		console.log("La acción se realizará.");
	  } else {
		console.log("La acción ha sido cancelada.");
	  }
	
}

window.find_user = function find_user(find) {
	var url = "/accounts/user/" + find;
	fetch(url)
		.then(response => response.json())
		.then(json => {
			if (json.username && json.id)
				make_friend(json.username);
		})
		.catch(error => {
			alert("User not found.");
		});;
}