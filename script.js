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

// ---------------------------------------

const grid = 15;
const paddleWidth = grid * 10; // 150
const maxPaddleX = myCanvas.width - grid - paddleWidth;

const BRICK_WIDTH = 100;
const BRICK_HEIGHT = 25;

let finishElement = document.getElementById("finishText");
let livesElement = document.getElementById("lives")
let lives = 3;

let bossSeen = false;

var paddleSpeed = 12;
var ballSpeed = 6;

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

const BRICKS_COLORS = {
    1: "#fff1a1",
    2: "#ffdf00",
    3: "#ffae00",
    4: "#ff7d00",
    5: "#ff0000",
    // 5: "#630000", // dark red
    6: "#5c0000",
    7: "#5c0000",
    8: "#3d0000",
    9: "#270000",
    10: "black"
}

const bricks = [
    { x: 100, y: 60, width: BRICK_WIDTH, height: BRICK_HEIGHT, hp: 3 },
    { x: 210, y: 60, width: BRICK_WIDTH, height: BRICK_HEIGHT, hp: 3 },
    { x: 320, y: 60, width: BRICK_WIDTH, height: BRICK_HEIGHT, hp: 5 },
    { x: 430, y: 60, width: BRICK_WIDTH, height: BRICK_HEIGHT, hp: 3 },
    { x: 540, y: 60, width: BRICK_WIDTH, height: BRICK_HEIGHT, hp: 3 },

    { x: 100, y: 100, width: BRICK_WIDTH, height: BRICK_HEIGHT, hp: 2 },
    { x: 210, y: 100, width: BRICK_WIDTH, height: BRICK_HEIGHT, hp: 2 },
    { x: 320, y: 100, width: BRICK_WIDTH, height: BRICK_HEIGHT, hp: 2 },
    { x: 430, y: 100, width: BRICK_WIDTH, height: BRICK_HEIGHT, hp: 2 },
    { x: 540, y: 100, width: BRICK_WIDTH, height: BRICK_HEIGHT, hp: 2 },

    { x: 100, y: 140, width: BRICK_WIDTH, height: BRICK_HEIGHT, hp: 1 },
    { x: 210, y: 140, width: BRICK_WIDTH, height: BRICK_HEIGHT, hp: 1 },
    { x: 320, y: 140, width: BRICK_WIDTH, height: BRICK_HEIGHT, hp: 1 },
    { x: 430, y: 140, width: BRICK_WIDTH, height: BRICK_HEIGHT, hp: 1 },
    { x: 540, y: 140, width: BRICK_WIDTH, height: BRICK_HEIGHT, hp: 1 },
];

let bricks_list = [];
for (let i = grid * 2; i < myCanvas.width - grid * 2; i += BRICK_WIDTH + grid) {
    let rowQty = 0;
    for (let j = grid * 3; j < (myCanvas.height / 2) - 50; j += BRICK_HEIGHT + grid * 2) {
        if (rowQty === 3) break;
        bricks_list.push({
            x: i,
            y: j,
            width: BRICK_WIDTH,
            height: BRICK_HEIGHT,
            hp: Math.floor(Math.random() * 5) + 1
        });
        rowQty++
    }
}

let brick_boss = {
    x: myCanvas.width / 2 - grid * 3,
    y: myCanvas.height / 2,
    width: BRICK_WIDTH / 1.5,
    height: BRICK_HEIGHT,
    hp: 10
}

function collides(obj1, obj2) {
    return (
        obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y
    );
}

function drawBricks() {
    bricks_list.forEach((b) => {
        ctx.fillStyle = BRICKS_COLORS[b.hp];
        ctx.fillRect(b.x, b.y, b.width, b.height);
    });
}

function loop() {
    requestAnimationFrame(loop);
    // RESET DRAW
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    // createGrid();

    if (bricks_list.length === 0) {
        if (!bossSeen) {
            bricks_list.push(brick_boss);
            bossSeen = true
        } else {
            finishElement.innerHTML = "Gagné !";
            livesElement.style.display = "none";
            lives = 0
        }
    }

    // move paddle
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

    // move ball
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
        lives--
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
    bricks_list.forEach(b => {
        if (collides(ball, b)) {
            ball.dy *= -1;
            if (b.hp === 1) {
                bricks_list.splice(i, 1);
            } else {
                b.hp--;
            }
        }
        i++
    });

    // draw ball
    ctx.beginPath();
    ctx.fillStyle = `white`;
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
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, myCanvas.width, grid);
    ctx.fillRect(0, 0, grid, myCanvas.height);
    ctx.fillRect(myCanvas.width - grid, 0, myCanvas.width, myCanvas.height);

    drawBricks();
}

function resetGame(wait) {
    ball.resetting = true;
    livesElement.innerHTML = lives + ' vies restantes'

    if (lives === 0) {
        finishElement.innerHTML = "Perdu !"

    } else {
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

// start the game
let startButton = document.getElementById("startButton");
let resetButton = document.getElementById("resetButton");

startButton.addEventListener("click", () => {
    requestAnimationFrame(loop);
    resetButton.hidden = false;
    startButton.hidden = true;
});

// reset the game
resetButton.addEventListener("click", () => {
    resetGame(false)
});