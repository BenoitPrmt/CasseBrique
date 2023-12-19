class Ball {
    constructor(x, y, width, height, dx, dy) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        
        this.resetting = false;

        this.dx = dx;
        this.dy = dy;

    }

    moveBall() {
        this.x += this.dx;
        this.y += this.dy;
    }
    
}