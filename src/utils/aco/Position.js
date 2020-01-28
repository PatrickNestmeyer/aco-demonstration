export default class Position {
    #xPos;
    #yPos;

    constructor(x, y) {
        this.#xPos = x;
        this.#yPos = y;
    }

    get xPos() {
        return this.#xPos;
    }

    get yPos() {
        return this.#yPos;
    }
}
