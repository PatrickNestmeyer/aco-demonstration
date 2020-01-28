import Position from "./Position";

export default class Path {

    constructor(pathLength, startX, startY) {
        this.positions = new Array(pathLength);
        this.positionCount = 0;
        this.addPosition(startX, startY);
    }

    addPosition(x, y) {
        this.positions[this.positionCount] = new Position(x, y);
        this.positionCount++;
    }

    getPositionAtIndex(index) {
        return this.positions[index];
    }
}
