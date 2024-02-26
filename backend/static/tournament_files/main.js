

window.searchMatch = function()
{
    console.log("Starting web socket...");
    const matchSock = new WebSocket(`ws://${window.location.host}/ws/matchmaking/`);
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
            let avatar_endpoint = `http://${window.location.hostname}:${window.location.port}/accounts/profile/avatar/${enemy_name}/`;
            console.log(avatar_endpoint);
            fetch(avatar_endpoint)
            .then(raw_data => {
                return raw_data.json();
            })
            .then(({enemy_avatar}) => {
                console.log(enemy_avatar);
                document.querySelector("#mm-player2").innerText = enemy_name;
                document.querySelector("#mm-avatar-player2").src = `http://${window.location.hostname}:${window.location.port}/${enemy_avatar}`;
                console.log(`http://${window.location.hostname}:${window.location.port}/${enemy_avatar}`);
                document.querySelector("#loader-tournament").classList.add("no-display");
                document.querySelector("#mm-enemy-box").classList.toggle("no-display");

                button_tournament.disable = false;
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