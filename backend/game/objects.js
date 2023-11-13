/* game logic */

const GAME_WIDTH = 1000;
const GAME_HEIGHT = GAME_WIDTH / 16 * 9;

const BALL_SPEED = 2;

const PAD_H = GAME_HEIGHT / 5;
const PAD_W = GAME_WIDTH / 100;
const PAD_INITIAL_Y = GAME_HEIGHT / 2;
const PAD_SPEED = PAD_H / 10;

const MAX_SCORE = 5;

class Paddle
{
	constructor(x, color) {
		this.initial_pos = {"x": x, "y": PAD_INITIAL_Y};
		this.pos = {"x": x, "y": PAD_INITIAL_Y};
		this.color = color;
		this.width = PAD_W;
		this.height = PAD_H;
	}
	moveUp() {
		if (this.pos.y < GAME_HEIGHT - PAD_H / 2)
			this.pos.y += PAD_SPEED;
	}
	moveDown() {
		if (this.pos.y > 0 + PAD_H / 2)
			this.pos.y -= PAD_SPEED;
	}
}

class Ball
{
	constructor() {
		this.pos = {"x": GAME_WIDTH / 2, "y": GAME_HEIGHT / 2};
		this.dir = {"x": BALL_SPEED, "y": 0};
		this.size = GAME_WIDTH / 200;
	}
	move()
	{
		this.pos.x += this.dir.x;
		this.pos.y += this.dir.y;
	}
}

class Game
{
	constructor() {
		this.score = {"p1": 0, "p2": 0}
		this.width = GAME_WIDTH;
		this.height = GAME_HEIGHT;
		this.paddle1 = new Paddle(0 + PAD_W * 4, 0xff0000);
		this.paddle2 = new Paddle(GAME_WIDTH - PAD_W * 4, 0x0000ff);
		this.ball = new Ball();
	}
	update() {
		if (!this.check_game_end())
		{
			var goal = this.check_goal();
			if (goal != 0)
				this.reset_board(goal);
			var pad_hit = this.check_pad_collision();
			if (pad_hit != 0)
				this.calculate_ball_dir(pad_hit);
			if (this.check_board_collision())
				this.ball.dir.y = -this.ball.dir.y;
			this.ball.move();
		}
	}
	reset_board(direction) {
		this.ball.pos = {"x": GAME_WIDTH / 2, "y": GAME_HEIGHT / 2};
		this.ball.dir = {"x": direction * BALL_SPEED, "y": 0};
		this.paddle1.pos.x = this.paddle1.initial_pos.x;
		this.paddle1.pos.y = this.paddle1.initial_pos.y;
		this.paddle2.pos.x = this.paddle2.initial_pos.x;
		this.paddle2.pos.y = this.paddle2.initial_pos.y;
	}
	get ball_pos() {
		return this.ball.pos;
	}
	get pad1_pos() {
		return this.paddle1.pos
	}
	get pad2_pos() {
		return this.paddle2.pos;
	}
	check_goal() {
		if (this.ball.pos.x > GAME_WIDTH)
		{
			this.score.p1 += 1;
			console.log("Player 1:", this.score.p1, "Player 2:", this.score.p2);
			return (1);
		}
		else if (this.ball.pos.x < 0)
		{
			this.score.p2 += 1;
			console.log("Player 1:", this.score.p1, "Player 2:", this.score.p2);
			return (-1);
		}
		return (0);
	}
	check_pad_collision() {
		var ball_x = this.ball_pos.x;
		var ball_y = this.ball_pos.y;

		if (ball_x >= this.pad1_pos.x - PAD_W / 2 && ball_x <= this.pad1_pos.x + PAD_W / 2 && 
			ball_y >= this.pad1_pos.y - PAD_H / 2 && ball_y <= this.pad1_pos.y + PAD_H / 2)
			return (-1);
		if (ball_x >= this.pad2_pos.x - PAD_W / 2 && ball_x <= this.pad2_pos.x + PAD_W / 2 && 
			ball_y >= this.pad2_pos.y - PAD_H / 2 && ball_y <= this.pad2_pos.y + PAD_H / 2)
			return (1);
		return (0);
	}
	check_board_collision() {
		var ball_y = Math.round(this.ball_pos.y);

		if (ball_y <= 0 || ball_y >= GAME_HEIGHT)
			return (true);
		return (false);
	}
	calculate_ball_dir(pad_hit) {
		if (pad_hit == -1)
			this.ball.dir = {"x": -this.ball.dir.x,
							 "y": (this.ball_pos.y - this.pad1_pos.y) / 20};
		if (pad_hit == 1)
			this.ball.dir = {"x": -this.ball.dir.x,
							 "y": (this.ball_pos.y - this.pad2_pos.y) / 20};
	}
	check_game_end() {
		if (this.score.p1 >= MAX_SCORE || this.score.p2 >= MAX_SCORE)
		{
			console.log("Game ended");
			return (true);
		}
		return (false);
	}
}

export default Game;
