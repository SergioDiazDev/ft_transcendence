

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

//TODO: Tenemos que hacer que si le damos de nuevo a matchmaking que se cierre si esta abierto
//      y se vuelva a abrir 
window.tournament_socket = undefined;
window.fourPlayerTournament = function()
{
    let $four_players_section = document.querySelector("#eight-players-tournament");
    let $first_column = document.querySelector("#first-col4");
    let $tournament_buttton = document.querySelector("#tournament-button");
    tournament_socket = new WebSocket(`ws://${window.location.host}/ws/tournament/`);

    //Displaying tournament table
    $four_players_section.classList.remove("no-display");

    tournament_socket.onopen = function() {
        tournament_socket.send(JSON.stringify({
            info: "SEARCHING4"
        }));
    }

    tournament_socket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        const data_object = data["message"];
        const keys = Object.keys(data_object);
        if(keys.length > 0)
        {
            let $four_players_section = document.querySelector("#eight-players-tournament");
            let $first_column = document.querySelector("#first-col4");
            let $second_column = document.querySelector("#second-col4");
            let $tournament_buttton = document.querySelector("#tournament-button");

            // Check fields now
            if(keys.includes("info"))
            {
                // Check what type of info does return 
                if(data_object["info"] === "FOUND" || data_object["info"] === "UPDATE")
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
                                            if(data_object["results"][`sala0${room}`] === "first_win" && player === 0)
                                                $most_internal_elem.src = "/static/img/check.png"
                                            else if(data_object["results"][`sala0${room}`] === "first_win" && player === 1)
                                                $most_internal_elem.src = "/static/img/cross.png"
                                            
                                            if(data_object["results"][`sala0${room}`] === "second_win" && player === 0)
                                                $most_internal_elem.src = "/static/img/cross.png"
                                            else if(data_object["results"][`sala0${room}`] === "second_win" && player === 1)
                                                $most_internal_elem.src = "/static/img/check.png"                                
                                    }
                                });
                                player++;
                            }
                        });

                        room++;
                        player = 0;
                    });


                    //Recorrer segunda columna

                    const $second_column_children = $second_column.children;

                    Array.from($second_column_children).forEach(elem =>{
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
                                        console.log("room: ", room);
                                        if(data_object["players"][`sala0${room}`][player] !== undefined)
                                            $most_internal_elem.classList.remove("no-display");
                                            if(data_object["results"][`sala0${room}`] === "first_win" && player === 0)
                                                $most_internal_elem.src = "/static/img/check.png"
                                            else if(data_object["results"][`sala0${room}`] === "first_win" && player === 1)
                                                $most_internal_elem.src = "/static/img/cross.png"
                                            
                                            if(data_object["results"][`sala0${room}`] === "second_win" && player === 0)
                                                $most_internal_elem.src = "/static/img/cross.png"
                                            else if(data_object["results"][`sala0${room}`] === "second_win" && player === 1)
                                                $most_internal_elem.src = "/static/img/check.png"                                
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
                    window.playing_tournament = true;
                    $tournament_buttton.classList.remove("disabled");
                    $tournament_buttton.onclick = null;  
                }

                if(data_object["info"] === "WIN")
                {
                    console.log("WIN");
                    setTimeout(() => {
                        document.querySelector("#button-return-tournament").innerText = "Back";
                        document.querySelector("#button-return-tournament").href = `/tournament/`;
                        document.querySelector("#button-return-tournament").addEventListener("click", removeBackButtonAndUpdate);
                    }, 500);
                }

                if(data_object["info"] === "DEFEAT")
                {
                    console.log("DEFEAT");
                    setTimeout(() => {
                        document.querySelector("#button-return-tournament").innerText = "Home";
                        document.querySelector("#button-return-tournament").href = `/home/`;
                        document.querySelector("#button-return-tournament").addEventListener("click", removeBackButton);                   
                    }, 500);
                }
            }

            //Check if tournament is ready to play
            if(keys.includes("tournament_ready") && (data_object["tournament_ready"] === true))
            {
                tournament_socket.send(JSON.stringify({
                    info: "READY"
                }));                   
            }

        }
    }


}

function removeBackButton(event) {
    document.querySelector("#button-return-tournament").removeEventListener("click", removeBackButton);
    document.querySelector("#button-return-tournament").classList.add("no-display");
}

function removeBackButtonAndUpdate(event)
{
    removeBackButton(event);
    setTimeout(() => {
        window.tournament_socket.send(JSON.stringify(
            {
                "info": "UPDATE",
            }
            ));        
    }, 100);
}