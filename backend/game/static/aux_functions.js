import * as THREE from "three";

export const OBJECTS_Z = 0;

export function getPositionVector(x, y) {
	return new THREE.Vector3(x, y, OBJECTS_Z);
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