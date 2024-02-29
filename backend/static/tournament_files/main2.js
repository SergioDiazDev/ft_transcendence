document.addEventListener("DOMContentLoaded", function() {
    window.join_tournament = function() {
        var tournamentSocket = new WebSocket("ws://" + window.location.host + "/ws/tournament/");
        tournamentSocket.onmessage = messageHandler;

        window.playing_tournament = true;

        function messageHandler(event) {
            const messageData = JSON.parse(event.data);
            if (messageData.type === "status") {
                // Modificado para que coincida con la estructura HTML
                document.querySelector(".team1").innerHTML = "";
                document.querySelector(".team2").innerHTML = "";
                document.querySelector(".team3").innerHTML = "";
                console.log("matches:", messageData);
                renderMatches(messageData);
            } else if (messageData.type === "new_game") {
                var game_button = document.createElement("a");
                game_button.href = "/game/" + messageData.game_id + "/";
                game_button.setAttribute("link", "");
                game_button.text = "Go to the game";

				var currentButton = document.querySelector(".button_tournament");
                currentButton.replaceWith(game_button);
				
                //document.querySelector("#transcendence-app").prepend(game_button);
                console.log("new game for you: ", messageData.game_id);
            } else if (messageData.type === "winner") {
                var winner_text = document.createElement("h1");
                // Corregido para establecer el texto correctamente
                winner_text.textContent = "And the winner is: " + messageData.winner + " !";
				
				winner_text.style.position = "fixed"; // Cambiamos la posición a fija
				winner_text.style.top = "50%";
				winner_text.style.left = "50%";
				winner_text.style.transform = "translate(-50%, -50%)";
				winner_text.style.color = "yellow";
				winner_text.style.fontSize = "24px";
				winner_text.style.fontWeight = "bold";
				winner_text.style.margin = "auto"; // Centra horizontalmente
				winner_text.style.padding = "0"; // Sin relleno
				winner_text.style.border = "none"; // Sin borde

				var currentButton = document.querySelector(".eres_un_champions");
                currentButton.replaceWith(winner_text);
                //document.querySelector("#transcendence-app").prepend(winner_text);
                window.playing_tournament = false;
                tournamentSocket.close();
            }
        }

        function renderMatches(json) {
            if (json.match1) {
                var p = document.createElement("p");
                p.textContent = json.match1[0] + " vs " + json.match1[1];
                // Modificado para que coincida con la estructura HTML
                document.querySelector(".team1").appendChild(p);
            }
            if (json.match2) {
                var p = document.createElement("p");
                p.textContent = json.match2[0] + " vs " + json.match2[1];
                // Modificado para que coincida con la estructura HTML
                document.querySelector(".team2").appendChild(p);
            }
            if (json.match3) {
                var p = document.createElement("p");
                p.textContent = json.match3[0] + " vs " + json.match3[1];
                // Modificado para que coincida con la estructura HTML
                document.querySelector(".team3").appendChild(p);
            }
        }
    }
});
