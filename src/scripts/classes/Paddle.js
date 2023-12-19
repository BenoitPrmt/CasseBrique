class Paddle {
    constructor(x, y, width, height, dx) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        
        this.dx = dx;

    }

    movePaddle() {
        this.x += this.dx;
    }
    
}