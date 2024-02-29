

window.searchMatch = function searchMatch()
{
    // console.log("Starting web socket...");
    const matchSock = new WebSocket(`wss://${window.location.host}/ws/matchmaking/`);
    const button_tournament = document.querySelector("#button-tournament")

    matchSock.onopen = function(){
        matchSock.send(JSON.stringify({
            search: true
        }));
    }

    matchSock.onmessage = function(e){
        const data = JSON.parse(e.data);
        if (Object.keys(data["message"]).includes("info") && data["message"]["info"])
        {
            let my_user = document.querySelector("#mm-player1").innerText;
            let enemy_name = null;
            let uuid_match = data["message"]["uuid_game"];

            if(data["message"]["player1"] == my_user)
                enemy_name = data["message"]["player2"];
            else
                enemy_name = data["message"]["player1"];
            let avatar_endpoint = `${window.location.protocol}//${window.location.hostname}/accounts/profile/avatar/${enemy_name}/`;
            // console.log(avatar_endpoint);
            fetch(avatar_endpoint)
            .then(raw_data => {
                return raw_data.json();
            })
            .then(({enemy_avatar}) => {
                document.querySelector("#mm-player2").innerText = enemy_name;
                document.querySelector("#mm-avatar-player2").src = `${window.location.protocol}//${window.location.hostname}/${enemy_avatar}`;
                document.querySelector("#loader-tournament").classList.add("no-display");
                document.querySelector("#mm-enemy-box").classList.toggle("no-display");

                window.blockNavigation = false;
                button_tournament.setAttribute("href", `/game/${uuid_match}/`)
            })
            .catch((error) => console.log(error));
        }

        if(Object.keys(data["message"]).includes("close") && data["message"]["close"])
        {
            matchSock.close();
            button_tournament.innerText = "Press to continue...";
        }
    }
}


window.join_tournament = function() {
		document.querySelector("#tournament-button").remove();
		document.querySelector("#tournament-display").classList.remove("hidden");
        var tournamentSocket = new WebSocket("wss://" + window.location.host + "/ws/tournament/");
        tournamentSocket.onmessage = messageHandler;

        window.playing_tournament = true;

        function messageHandler(event) {
            const messageData = JSON.parse(event.data);
            if (messageData.type === "status") {
				document.querySelector("#transcendence-app").innerHTML = html_tournament;
                renderMatches(messageData);
            } else if (messageData.type === "new_game") {
                var game_button = document.createElement("a");
                game_button.href = "/game/" + messageData.game_id + "/";
                game_button.setAttribute("link", "");
                game_button.text = "Go to the game";
				game_button.id = "goto-game-button";
				game_button.className = "nav-link nav-button";
                document.querySelector("#eight-players-tournament").appendChild(game_button);
            } else if (messageData.type === "winner") {
				document.querySelector("#transcendence-app").innerHTML = `<h1 id="game-winner">And the winner is ${messageData.winner}!</h1>`;
                window.playing_tournament = false;
                tournamentSocket.close();
            }
        }

        function renderMatches(json) {
            if (json.match1) {
                document.querySelector("#match1_player1").textContent = json.match1[0];
                document.querySelector("#match1_player2").textContent = json.match1[1];
            }
            if (json.match2) {
                document.querySelector("#match2_player1").textContent = json.match2[0];
                document.querySelector("#match2_player2").textContent = json.match2[1];
            }
            if (json.match3) {
                document.querySelector("#match3_player1").textContent = json.match3[0];
                document.querySelector("#match3_player2").textContent = json.match3[1];
            }
        }
    };

var html_tournament = `
<main class="container" id="main-container"  style="display: flex; align-items: center; justify-content: center;">
    <section class="tournament-display" id="tournament-display">

        <section id="eight-players-tournament" class="tournament-table">
            <h2>Tournament Mode</h2>
            <hr class="tournament-separator">

            <div  class="col-matches-disposition">
                <div class="first-bracket"> <!-- First bracket --> 
                    <hr class="upper-bracket-horizontal4">
                    <hr class="upper-bracket-horizontal4">
                    <hr class="upper-bracket-horizontal4">
                </div>
                <div class="second-bracket"> <!-- Second bracket --> 
                    <hr class="upper-bracket-horizontal4">
                    <hr class="upper-bracket-horizontal4">
                    <hr class="upper-bracket-horizontal4">
                </div>
                <div class="third-bracket"> <!-- Second bracket --> 
                    <hr class="upper-bracket-horizontal4">
                    <hr class="upper-bracket-horizontal4">
                    <hr class="upper-bracket-horizontal4">
                </div>
                <div id="second-col4" class="col4"> <!-- Segunda columna -->
                    <div class="match-col4 second-col-4">
                        <div>
                            <img class="no-display status-img" src="/static/img/undefined.png" alt="Imagen resultado">
                            <div class="loader2 status-img"></div>
                            <p id="match1_player1">Pending</p>
                        </div>
                        <hr>
                        <div>
                            <img class="no-display status-img" src="/static/img/undefined.png" alt="Imagen resultado">
                            <div class="loader2 status-img"></div>
                            <p id="match1_player2">Pending</p>
                            </div>   
                    </div>
                
                    <div class="match-col4 second-col-4">
                        <div>
                            <img class="no-display status-img" src="/static/img/undefined.png" alt="Imagen resultado">
                            <div class="loader2 status-img"></div>
                            <p id="match2_player1">Pending</p>
                        </div>
                        <hr>
                        <div>
                            <img class="no-display status-img" src="/static/img/undefined.png" alt="Imagen resultado">
                            <div class="loader2 status-img"></div>
                            <p id="match2_player2">Pending</p>
                        </div>   
                    </div>
                </div> <!-- Acaba segunda columna -->

                <div id="third-col4" class="col4">
                        <div class="match-col4 third-col-4"> <!-- Tercera columna -->
                        <div>
                            <img class="no-display status-img" src="/static/img/undefined.png" alt="Imagen resultado">
                            <div class="loader2 status-img"></div>
                            <p id="match3_player1">Pending</p>
                        </div>
                        <hr>
                        <div>
                            <img class="no-display status-img" src="/static/img/undefined.png" alt="Imagen resultado">
                            <div class="loader2 status-img"></div>
                            <p id="match3_player2">Pending</p>
                        </div>
                    </div>
                </div> <!-- Acaba tercera columna -->
            </div>

        </section>
    </section>
</main>`;