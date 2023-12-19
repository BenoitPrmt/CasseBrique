const myCanvas = document.getElementById("myCanvas");
let ctx = myCanvas.getContext("2d");

function createGrid() {
    const CANVA_WIDTH = myCanvas.getAttribute("width");
    const CANVA_HEIGHT = myCanvas.getAttribute("height");

    for (let i = 0; i < CANVA_WIDTH; i += 10) {
        ctx.beginPath();
        ctx.moveTo(i, 0);

        if (i % 100 === 0) {
            ctx.strokeStyle = "green";
        } else {
            ctx.strokeStyle = "red";
        }

        ctx.lineTo(i, CANVA_HEIGHT);
        ctx.stroke();
    }

    for (let i = 0; i < CANVA_HEIGHT; i += 10) {
        ctx.beginPath();
        ctx.moveTo(0, i);

        if (i % 100 === 0) {
            ctx.strokeStyle = "green";
        } else {
            ctx.strokeStyle = "red";
        }

        ctx.lineTo(CANVA_WIDTH, i);
        ctx.stroke();
    }
}
createGrid();

// ---------------------------------------

const grid = 15;
const paddleWidth = grid * 10; // 150
const maxPaddleX = myCanvas.width - grid - paddleWidth;

const BRICK_WIDTH = 100;
const BRICK_HEIGHT = 25;

var paddleSpeed = 11;
var ballSpeed = 10;

const paddle = {
    // start in the middle of the game on the left side
    x: myCanvas.width / 2 - paddleWidth / 2,
    y: myCanvas.height - grid * 2,
    width: paddleWidth,
    height: grid,

    // paddle velocity
    dx: 0,
};

const ball = {
    // start in the middle of the game
    x: myCanvas.width / 2,
    y: myCanvas.height / 2,
    width: grid,
    height: grid,

    // keep track of when need to reset the ball position
    resetting: false,

    // ball velocity (start going to the top-right corner)
    dx: ballSpeed,
    dy: -ballSpeed,
};

const bricks = [
    { x: 100, y: 100, width: BRICK_WIDTH, height: BRICK_HEIGHT },
    { x: 210, y: 100, width: BRICK_WIDTH, height: BRICK_HEIGHT },
    { x: 320, y: 100, width: BRICK_WIDTH, height: BRICK_HEIGHT },
    { x: 430, y: 100, width: BRICK_WIDTH, height: BRICK_HEIGHT },
    { x: 540, y: 100, width: BRICK_WIDTH, height: BRICK_HEIGHT },
    { x: 100, y: 140, width: BRICK_WIDTH, height: BRICK_HEIGHT },
    { x: 210, y: 140, width: BRICK_WIDTH, height: BRICK_HEIGHT },
    { x: 320, y: 140, width: BRICK_WIDTH, height: BRICK_HEIGHT },
    { x: 430, y: 140, width: BRICK_WIDTH, height: BRICK_HEIGHT },
    { x: 540, y: 140, width: BRICK_WIDTH, height: BRICK_HEIGHT },
];

function collides(obj1, obj2) {
    return (
        obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y
    );
}

function drawBricks() {
    ctx.fillStyle = "blue";
    bricks.forEach((b) => {
        ctx.fillRect(b.x, b.y, BRICK_WIDTH, BRICK_HEIGHT);
    });
}

function loop() {
    requestAnimationFrame(loop);
    // RESET DRAW
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    createGrid();

    paddle.x += paddle.dx;

    // prevent paddles from going through walls
    if (paddle.x < grid) {
        paddle.x = grid;
    } else if (paddle.x > maxPaddleX) {
        paddle.x = maxPaddleX;
    }

    // draw paddle
    ctx.fillStyle = "white";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    ball.x += ball.dx;
    ball.y += ball.dy;

    // prevent ball from going through walls by changing its velocity
    // top wall
    if (ball.y < grid) {
        ball.y = grid;
        ball.dy *= -1;
    }

    // left wall
    if (ball.x < grid) {
        ball.x = grid;
        ball.dx *= -1;
    } else if (ball.x + grid > myCanvas.width - grid) {
        // right wall
        ball.x = myCanvas.width - grid * 2;
        ball.dx *= -1;
    }

    // reset ball if it goes past paddle (but only if we haven't already done so)
    if (ball.y > myCanvas.width && !ball.resetting) {
        console.log("out");
        resetGame(true);
    }

    // check to see if ball collides with paddle. if they do change x velocity
    if (collides(ball, paddle)) {
        ball.dy *= -1;

        // move ball next to the paddle otherwise the collision will happen again
        // in the next frame
        ball.y = paddle.y - paddle.height;
    }

    let i = 0
    bricks.forEach(b => {
        if (collides(ball, b)) {
            ball.dy *= -1;
            bricks.splice(i, 1);
        }
        i++
    });

    // draw ball
    ctx.beginPath();
    ctx.fillStyle = `black`;
    ctx.arc(
        ball.x,
        ball.y,
        ball.width / 2,
        (0 * Math.PI) / 180,
        (360 * Math.PI) / 180
    );
    ctx.closePath();
    ctx.fill();

    // draw walls
    ctx.fillStyle = "lightgrey";
    ctx.fillRect(0, 0, myCanvas.width, grid);
    ctx.fillRect(0, 0, grid, myCanvas.height);
    ctx.fillRect(myCanvas.width - grid, 0, myCanvas.width, myCanvas.height);

    drawBricks();
}

function resetGame(wait) {
    ball.resetting = true;

    if (wait) {
        // give some time for the player to recover before launching the ball again
        setTimeout(() => {
            ball.resetting = false;
            ball.x = myCanvas.width / 2;
            ball.y = myCanvas.height / 2;
        }, 500);
    } else {
        ball.resetting = false;
        ball.x = myCanvas.width / 2;
        ball.y = myCanvas.height / 2;
    }
}

// listen to keyboard events to move the paddles
document.addEventListener("keydown", function (e) {
    // up arrow key
    if (e.key === "ArrowLeft") {
        paddle.dx = -paddleSpeed;
    }
    // down arrow key
    else if (e.key === "ArrowRight") {
        paddle.dx = paddleSpeed;
    }
});

// listen to keyboard events to stop the paddle if key is released
document.addEventListener("keyup", function (e) {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        paddle.dx = 0;
    }
});

console.log("script");

requestAnimationFrame(loop);