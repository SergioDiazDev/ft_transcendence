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