import Position from "./Position";

export default class Pheromon {

    #position;
    #value;

    constructor(xPos, yPos, value) {
        this.#position = new Position(xPos, yPos);
        this.#value = value;
    }

    get position() {
        return this.#position;
    }

    get value() {
        return this.#value;
    }

    updatePheromonValue(newValue) {
        this.#value = newValue;
    }
}
