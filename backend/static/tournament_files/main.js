

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
                document.querySelector("#mm-player2").innerText = enemy_name;
                document.querySelector("#mm-avatar-player2").src = `http://${window.location.hostname}:${window.location.port}/${enemy_avatar}`;
                console.log(`http://${window.location.hostname}:${window.location.port}/${enemy_avatar}`);
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


//---------------------------- Tournaments --------------------------------

window.fourPlayerTournament = function()
{
    const $four_players_section = document.querySelector("#eight-players-tournament");
    const $first_column = document.querySelector("#first-col4");
    const $tournament_buttton = document.querySelector("#tournament-button");
    const match_sock = new WebSocket(`ws://${window.location.host}/ws/tournament/`);

    //Displaying tournament table
    $four_players_section.classList.remove("no-display");

    match_sock.onopen = function() {
        match_sock.send(JSON.stringify({
            info: "SEARCHING4"
        }));
    }

    match_sock.onmessage = function(e) {
        const data = JSON.parse(e.data);
        const data_object = data["message"];
        const keys = Object.keys(data_object);
        console.log(data_object);
        if(keys.length > 0)
        {
            // Check fields now
            if(keys.includes("info"))
            {
                // Check what type of info does return 
                if(data_object["info"] === "FOUND")
                {
                    let room = 0, player = 0;

                    const $first_column_children = $first_column.children;

                    //Recorrer primera columna
                    Array.from($first_column_children).forEach(elem =>{
                        const $internal_elems = elem.children;
                        Array.from($internal_elems).forEach(internal_elem => {
                            if(internal_elem.localName === "div")
                            {
                                const $most_internal_elems = internal_elem.children;
                                Array.from($most_internal_elems).forEach($most_internal_elem => {
                                    if($most_internal_elem.tagName === "P")
                                    {
                                        $most_internal_elem.innerText = data_object["players"][`sala0${room}`][player];
                                    }
                                    else if($most_internal_elem.tagName === "DIV")
                                    {
                                        if(data_object["players"][`sala0${room}`][player] !== undefined)
                                            $most_internal_elem.classList.add("no-display");
                                    }
                                    else if($most_internal_elem.tagName === "IMG")
                                    {
                                        if(data_object["players"][`sala0${room}`][player] !== undefined)
                                            $most_internal_elem.classList.remove("no-display");                                        
                                    }
                                });
                                player++;
                            }
                        });

                        room++;
                        player = 0;
                    });
                }

                // Obtain game key to play
                if(data_object["info"] === "MATCH_FOUND")
                {
                    $tournament_buttton.innerText = "Tournament Ready";
                    $tournament_buttton.href = `/game/${data_object["game_key"]}`;
                    $tournament_buttton.classList.remove("disabled");
                    $tournament_buttton.onclick = null;
                    console.log(data_object["game_key"]);    
                }
            }

            //Check if tournament is ready to play
            if(keys.includes("tournament_ready") && (data_object["tournament_ready"] === true))
            {
                console.log("Le llega ready");
                match_sock.send(JSON.stringify({
                    info: "READY"
                }));                   
            }

        }
    }


}