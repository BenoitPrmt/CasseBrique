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

startButton.addEventListener("click", () => {
    requestAnimationFrame(loop);
    startButton.hidden = true;
});