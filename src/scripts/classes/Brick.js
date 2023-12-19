class Brick {
    constructor(x, y, width, height, hp) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.hp = hp;
    }

    decrementHp() {
        this.hp--;
        return this.hp;
    }
}