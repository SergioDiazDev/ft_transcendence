/* game logic */

const GAME_WIDTH = 200;
const GAME_HEIGHT = 100;

const BALL_SPEED = 1;

const PAD_INITIAL_Y = GAME_HEIGHT / 2;
const PAD_H = 20;
const PAD_W = 1;
const PAD_SPEED = 10;

class Paddle
{
	constructor(x, color) {
		this.pos = {"x": x, "y": PAD_INITIAL_Y};
		this.color = color;
		this.width = PAD_W;
		this.height = PAD_H;
	}
	moveUp() {
		if (this.pos.y < GAME_HEIGHT - PAD_H)
			this.pos.y += PAD_SPEED;
	}
	moveDown() {
		if (this.pos.y > 0)
			this.pos.y -= PAD_SPEED;
	}
}

class Ball
{
	constructor() {
		this.pos = {"x": GAME_WIDTH / 2, "y": GAME_HEIGHT / 2};
		this.dir = {"x": 1, "y": 0};
		this.speed = BALL_SPEED;
	}
	move()
	{
		this.pos.x += this.dir.x * this.speed;
		this.pos.y += this.dir.y * this.speed;
	}
}

class Game
{
	constructor() {
		this.goals = {"p1": 0, "p2": 0}
		this.width = GAME_WIDTH;
		this.height = GAME_HEIGHT;
		this.paddle1 = new Paddle(0 + PAD_W, 0xff0000);
		this.paddle2 = new Paddle(GAME_WIDTH - PAD_W, 0x0000ff);
		this.ball = new Ball();
	}
	update() {
		if (this.ball.pos.x > GAME_WIDTH)
		{
			this.goals.p1 += 1;
			this.ball.dir.x = -1;
		}
		else if (this.ball.pos.x < 0)
		{
			this.goals.p2 += 1;
			this.ball.dir.x = 1;
		}
		this.ball.move();
	}
	get ball_position() {
		return this.ball.pos;
	}
	get paddle1_position() {
		return this.paddle1.pos
	}
	get paddle2_position() {
		return this.paddle2.pos;
	}
}

export default Game;
