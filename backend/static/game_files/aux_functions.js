import { Vector3 } from "./three/build/three.module.min.js";

export const OBJECTS_Z = 0;

export function getPositionVector(x, y) {
	return new Vector3(x, y, OBJECTS_Z);
}

export function announceGoal(player, end) {
	if (!end)
	{
		if (player != "")
			document.getElementById("goal").innerText = player + " scored a goal!";
		else
			document.getElementById("goal").innerText = "";
	}
	else if (player != "")
		document.getElementById("goal").innerText = player + " won the match.";
}

export function countdown(containerId, count) {
	const container = document.getElementById(containerId);

	function updateCountdown() {
		if (count == 0)
				container.textContent = "";
		if (count > 0) {
			container.textContent = count;
			count--;
		}
		else
			clearInterval(interval);
	}
	updateCountdown();
	const interval = setInterval(updateCountdown, 1000);
}

function create_avatar(src) {
	let img = document.createElement("img");
	img.src = "/" + src;
	return img
}

export function announcePlayers(player1, player2, avatar1, avatar2) {
	let vs = document.createElement("span");
	vs.innerText = "vs";
	document.getElementById("player1").innerText = player1;
	document.getElementById("player2").innerText = player2;
	document.getElementById("avatars").appendChild(create_avatar(avatar1));
	document.getElementById("avatars").appendChild(vs);
	document.getElementById("avatars").appendChild(create_avatar(avatar2));
}