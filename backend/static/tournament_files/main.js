

window.searchMatch = function()
{
    console.log("Starting web socket...");
    const matchSock = new WebSocket(`ws://${window.location.host}/ws/matchmaking/`);

    matchSock.onopen = function(){
        matchSock.send(JSON.stringify({
            search: true
        }));
    }

    matchSock.onmessage = function(e){
        const data = JSON.parse(e.data);
        console.log(Object.keys(data));
        if (Object.keys(data).includes("info") && data["info"])
        {
            console.log("Tiene info...");
        }

        if(Object.keys(data).includes("close") && data["close"])
        {
            matchSock.close();
        }
    }
}