window.join_tournament = function join_tournament() {
	var tournamentSocket = new WebSocket("ws://" + window.location.host + "/ws/tournament/");
	tournamentSocket.onmessage = messageHandler;

	window.playing_tournament = true;

	function messageHandler(event) {
		const messageData = JSON.parse(event.data);
		if (messageData.type === "status") {
			document.querySelector("#transcendence-app").innerHTML = "";
			console.log("matches:", messageData);
			renderMatches(messageData);
		} else if (messageData.type === "new_game") {
			var game_button = document.createElement("a");
			game_button.href = "/game/" + messageData.game_id + "/";
			game_button.setAttribute("link", "");
			game_button.text = "Go to the game";
			document.querySelector("#transcendence-app").prepend(game_button);
			console.log("new game for you: ", messageData.game_id);
		} else if (messageData.type === "winner") {
			var winner_text = document.createElement("h1");
			winner_text = "And the winner is: " + messageData.winner + " !";
			document.querySelector("#transcendence-app").prepend(winner_text);
			window.playing_tournament = false;
			tournamentSocket.close();
		}
	}
	function renderMatches(json) {
		if (json.match1) {
			var p = document.createElement("p");
			p.innerText = json.match1[0] + " vs " + json.match1[1];
			document.querySelector("#transcendence-app").appendChild(p);
		}
		if (json.match2) {
			var p = document.createElement("p");
			p.innerText = json.match2[0] + " vs " + json.match2[1];
			document.querySelector("#transcendence-app").appendChild(p);
		}
		if (json.match3) {
			var p = document.createElement("p");
			p.innerText = json.match3[0] + " vs " + json.match3[1];
			document.querySelector("#transcendence-app").appendChild(p);
		}
	}
}