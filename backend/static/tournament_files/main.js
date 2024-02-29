

//---------------------------- Tournaments --------------------------------

//TODO: Tenemos que hacer que si le damos de nuevo a matchmaking que se cierre si esta abierto
//      y se vuelva a abrir 
window.tournament_socket = undefined;
let data_object = undefined;
let last_winner = false;

window.fourPlayerTournament = function()
{
    let $four_players_section = document.querySelector("#eight-players-tournament");
    let $first_column = document.querySelector("#first-col4");
    let $tournament_button = document.querySelector("#tournament-button");
    tournament_socket = new WebSocket(`wss://${window.location.host}/ws/tournament/`);

    //Displaying tournament table
    $four_players_section.classList.remove("no-display");

    tournament_socket.onopen = function() {
        tournament_socket.send(JSON.stringify({
            info: "SEARCHING4"
        }));
    }

    tournament_socket.close = function()
    {
        window.tournament_socket = undefined;
        let data_object = undefined;
        let last_winner = false;        
    }

    tournament_socket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        data_object = data["message"];
        const keys = Object.keys(data_object);
        document.querySelector("#tournament-button").onclick = null;
        if(keys.length > 0)
        {
            let $four_players_section = document.querySelector("#eight-players-tournament");
            let $first_column = document.querySelector("#first-col4");
            let $second_column = document.querySelector("#second-col4");
            let $third_column = document.querySelector("#third-col4");


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

                    //Recorrer tercera columna

                    const $third_column_children = $third_column.children;

                    Array.from($third_column_children).forEach(elem =>{
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


                }

                // Obtain game key to play
                if(data_object["info"] === "MATCH_FOUND")
                {
                    setTimeout(() => {
                        if(last_winner === false)
                        {
                            // console.log(data_object["game_key"]);
                            document.querySelector("#tournament-button").innerText = "Tournament Ready";
                            document.querySelector("#tournament-button").href = `/game/${data_object["game_key"]}`;
                            window.playing_tournament = true;
                            document.querySelector("#tournament-button").classList.remove("disabled");
                            document.querySelector("#tournament-button").onclick = null;        
                        }
                        
                    }, 2000);
                }

                

                if(data_object["info"] === "WIN")
                {
                    // console.log("WIN");
                    setTimeout(() => {
                        if(last_winner === false)
                        {
                            document.querySelector("#button-return-tournament").innerText = "Back";
                            document.querySelector("#button-return-tournament").href = `/tournament/`;
                            document.querySelector("#button-return-tournament").addEventListener("click", removeBackButtonAndUpdate);    
                        }

                    }, 500);
                }

                if(data_object["info"] === "DEFEAT")
                {
                    // console.log("DEFEAT");
                    setTimeout(() => {
                        document.querySelector("#button-return-tournament").innerText = "Home";
                        document.querySelector("#button-return-tournament").href = `/`;
                        window.tournament_socket = undefined;
                        document.querySelector("#button-return-tournament").addEventListener("click", removeBackButton);                   
                    }, 500);
                }

                if(data_object["info"] === "UPDATE_YOUR_BUTTON")
                {
                    // console.log("WIN");
                    setTimeout(() => {
                        document.querySelector("#button-return-tournament").innerText = "Back";
                        document.querySelector("#button-return-tournament").href = `/tournament/`;
                        document.querySelector("#button-return-tournament").addEventListener("click", round_over);
                        last_winner = true
                    }, 200);
                }
                if(data_object["info"] === "NEW_ROUND_READY")
                {
                    setTimeout(() => {
                        tournament_socket.send(JSON.stringify({
                            info: "NEW_MATCH",
                        }));
                    }, 300);
                }
            }

            if(data_object["info"] === "TOURNAMENT_WINNER")
            {
                document.querySelector("#pannel-win").classList.remove("no-display");
                document.querySelector("#button-return-tournament").innerText = "Home";
                document.querySelector("#button-return-tournament").href = `/`;

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
            const $tournament_button = document.querySelector("#tournament-button"); 
            $tournament_button.href = null;
            $tournament_button.classList.add("disabled");
            $tournament_button.innerText = "Waiting...";       
    }, 1000);
}

function eventLastWinner()
{
    document.querySelector("#tournament-button").removeEventListener(eventLastWinner);
    last_winner = false;
}

function round_over(event)
{
    removeBackButton(event);
    setTimeout(() => {

        window.tournament_socket.send(JSON.stringify(
            {
                "info": "UPDATE",
            }
            ));
            const $tournament_button = document.querySelector("#tournament-button"); 
            $tournament_button.href = `/game/${data_object["game_key"]}`;
            $tournament_button.classList.remove("disabled");
            $tournament_button.innerText = "Tournament Ready";
            $tournament_button.onclick = null;

    }, 200);
    // console.log("Desde round_over: ", data_object);
}