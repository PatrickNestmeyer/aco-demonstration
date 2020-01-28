import Path from "./Path";
import Pheromon from "./Pheromon";

export default class AcoCore {

    #imgData;
    #targetCanvas;

    //Height;
    #X;
    //Width;
    #Y;

    //Amount of Iterations
    #N = 3;
    //Number of Ants per Iteration
    #K;
    //Pathlength of an ant
    #L = 40;

    //Pheromon Array
    #pheromones = [];
    #pheromonInitValue = 0.0001;

    //Evoporation rate
    #p = 0.1;
    //Pheromon decay coefficient
    #v = 0.05;
    //Tolerance value
    #es = 0.1;

    //Weight Factors
    //Alpha for the pheromone information
    #alpha = 1.0;
    //Beta for the heuristic information
    #beta = 0.1;
    //Connectivity neighbourhood
    #omega = 8;

    //Intensity array
    #intensities = [];
    //Intensity clique array
    //Computed intensity of a pixel based on the intensity value of its neighbors
    #intensityCliques = [];
    //Sum of all IntensityClique Values needed to determine heuristic information
    #cumulatedIntensityCliques;
    //Heuristic information
    //Computed by the intensity clique value divided by the sum of all other intensity clique values
    #heuristicInformations = [];
    //All Paths over all iterations will be saved here
    #paths = [];

    /**
     * @param imgData: the imageData as Uint8ClampedArray
     * @param width: the original width of the image
     * @param height: the original height of the image
     * @param demoCanvas: the canvas to operate on for visualization
     */
    constructor(imgData, width, height, targetCanvas) {
        this.#X = height;
        this.#Y = width;
        this.#imgData = imgData;
        this.#targetCanvas = targetCanvas;
        this.initialize(imgData);
    }

    initialize(imgData) {
        this.#intensities = this.convertImgDataToGrayscaleMatrix(imgData);
        this.#K = this.computeNumberOfAnts();
        this.#pheromones = this.initializePheromones();
        this.#paths = this.initializePathsLength();
        this.#intensityCliques = this.computeIntensityCliques();
        this.#cumulatedIntensityCliques = this.cumulateIntensityCliques();
        this.#heuristicInformations = this.computeHeuristicInformation();
    }

    run() {
        //Main iterations
        for(let n=0; n<this.#N; n++) {
            this.#paths = this.initializePaths();
            //Send all ants
            for(let k=0; k<this.#K; k++) {
                //Each ant k walks L steps
                for(let l=1; l<this.#L; l++) {
                    //Get Position of Ant k
                    let xPos = this.#paths[n][k].getPositionAtIndex(l-1).xPos;
                    let yPos = this.#paths[n][k].getPositionAtIndex(l-1).yPos;
                    //If ant k travels over picture border reset position inside picture
                    if(xPos < 0) {
                        xPos = 0;
                    }
                    if(xPos >= this.#X) {
                        xPos = this.#X - 1;
                    }
                    if(yPos < 0) {
                        yPos = 0;
                    }
                    if(yPos >= this.#Y) {
                        yPos = this.#Y - 1;
                    }
                    //Compute decision values for Pixel x,y of all Neighbors
                    let neighboursDecisionValues = this.computeNeighboursDecisionValue(xPos, yPos);
                    //Compute sum of all neighbors and Initialize accumulated probabilities
                    const sumOfAllNeighbours = this.computeSumOfAllNeighbors(neighboursDecisionValues);
                    //Compute probabilities for each neighbour
                    let probabilities = this.computeProbabilities(neighboursDecisionValues, sumOfAllNeighbours);
                    let accumulatedProbs = this.accumulateProbabilites(probabilities);
                    //Calculate decisionIndex
                    const decisionIndex = this.calculateDecisionIndex(accumulatedProbs);
                    this.updatePaths(n, k, decisionIndex, xPos, yPos);
                    const newValue = ((1-this.#p)*this.#pheromones[xPos][yPos].value) + (this.#p*this.#heuristicInformations[xPos][yPos]);
                    this.#pheromones[xPos][yPos].updatePheromonValue(newValue);
                }
            }
            //Update pheromones used by all ants
            this.updatePheromones();
        }
        const edges = this.buildSolution();
        this.printEdges(edges);
    }

    buildSolution() {
        /*
         * TODO: Calculation of mean threshold not implemented yet
         *  The following value seems to work fine with
         */
        const meanThreshold = 6.0E-5;
        let edges = [];
        for(let x=0; x<this.#X; x++) {
            edges[x] = [];
            for(let y=0; y<this.#Y; y++) {
                edges[x][y] = (this.#pheromones[x][y].value >= meanThreshold) ? true : false;
            }
        }
        return edges;
    }

    computeNeighboursDecisionValue(xPos, yPos) {
        let neighboursDecisionValue = new Array(this.#omega);
        let tryXPos = xPos;
        let tryYPos = yPos;
        for(let i=0; i<this.#omega; i++) {
            switch (i) {
                case 0:
                    tryYPos++;
                    break;
                case 1:
                    tryXPos--;
                    break;
                case 2:
                    tryXPos++;
                    break;
                case 3:
                    tryYPos--;
                    break;
                case 4:
                    tryXPos--;
                    tryYPos++;
                    break;
                case 5:
                    tryXPos++;
                    tryYPos++;
                    break;
                case 6:
                    tryXPos--;
                    tryYPos--;
                    break;
                case 7:
                    tryXPos++;
                    tryYPos--;
                    break;
            }
            if(tryXPos > this.#X-1 || tryYPos > this.#Y-1 || tryXPos < 0 || tryYPos < 0) {
                neighboursDecisionValue[i] = 0;
            } else {
                const a = Math.pow(this.#pheromones[tryXPos][tryYPos].value, this.#alpha);
                const b = Math.pow(this.#heuristicInformations[tryXPos][tryYPos], this.#beta);
                neighboursDecisionValue[i] = a * b;
            }
        }
        return neighboursDecisionValue;
    }

    computeSumOfAllNeighbors(neighboursDeciscionValues) {
        let sum = 0;
        for(let i=0; i<neighboursDeciscionValues.length; i++) {
            sum += neighboursDeciscionValues[i];
        }
        return sum;
    }

    computeProbabilities(neighboursDecisionValues, sumOfAllNeighbours) {
        let probabilities = new Array(this.#omega);
        for(let i=0; i<probabilities.length; i++) {
            probabilities[i] = neighboursDecisionValues[i] / sumOfAllNeighbours;
        }
        return probabilities;
    }

    accumulateProbabilites(probabilities) {
        let accumulatedProbabilities = [];
        accumulatedProbabilities[0] = 0;
        for(let i=1; i<probabilities.length; i++) {
            accumulatedProbabilities[i] = accumulatedProbabilities[i-1] + probabilities[i];
        }
        return accumulatedProbabilities;
    }

    calculateDecisionIndex(accumulatedProbabilities) {
        //Create random value for decision
        const decision = Math.floor(Math.random() * (101)) / 100;
        let decisionIndex = 0;
        for(let i=1; i<accumulatedProbabilities.length; i++) {
            if(decision <= accumulatedProbabilities[i] && decision >= accumulatedProbabilities[i-1]) {
                decisionIndex = i-1;
            } else {
                if(i==accumulatedProbabilities.length-1 && decision > accumulatedProbabilities[i]) {
                    decisionIndex = 7;
                }
            }
        }
        return decisionIndex;
    }

    updatePaths(n, k, decisionIndex, xPos, yPos) {
        switch (decisionIndex) {
            case 0:
                this.#paths[n][k].addPosition(xPos, yPos+1);
                break;
            case 1:
                this.#paths[n][k].addPosition(xPos-1, yPos);
                break;
            case 2:
                this.#paths[n][k].addPosition(xPos+1, yPos);
                break;
            case 3:
                this.#paths[n][k].addPosition(xPos, yPos-1);
                break;
            case 4:
                this.#paths[n][k].addPosition(xPos-1, yPos+1);
                break;
            case 5:
                this.#paths[n][k].addPosition(xPos+1, yPos+1);
                break;
            case 6:
                this.#paths[n][k].addPosition(xPos-1, yPos-1);
                break;
            case 7:
                this.#paths[n][k].addPosition(xPos+1, yPos-1);
                break;
        }
    }

    updatePheromones() {
        for(let x=0;x<this.#X; x++) {
            for(let y=0; y<this.#Y; y++) {
                const newValue = ((1-this.#v) * this.#pheromones[x][y].value) + (this.#v * this.#pheromonInitValue);
                this.#pheromones[x][y].updatePheromonValue(newValue);
            }
        }
    }

    convertImgDataToGrayscaleMatrix(imgData, width, height) {

        let grayScaleMatrix = [];
        let pixelMarker = 0;
        for(let x=0; x<this.#X; x++) {
            grayScaleMatrix[x] = [];
            for(let y=0; y<this.#Y; y++) {
                //Red
                grayScaleMatrix[x][y] = 0.2126*imgData[pixelMarker];
                //Green
                grayScaleMatrix[x][y] += 0.7152*imgData[pixelMarker+1];
                //Blue
                grayScaleMatrix[x][y] += 0.0722*imgData[pixelMarker+2];
                pixelMarker+=4;
            }
        }
        return grayScaleMatrix;
    }

    computeNumberOfAnts() {
        /*
        TODO: The original amount of ants will work well when calculation of mean-Threshold is implemented.
        TODO: In the meantime a fix number of ants will solve the problem as well
         */
        //return Math.floor(Math.sqrt((this.#X*this.#Y)));
        return 5000;
    }

    initializePheromones() {
        let pheromones = [];
        for(let x=0; x<this.#X; x++) {
            pheromones[x] = [];
            for(let y=0; y<this.#Y; y++) {
                pheromones[x][y] = new Pheromon(x,y, this.#pheromonInitValue);
            }
        }
        return pheromones;
    }

    initializePathsLength() {
        let paths = [];
        for(let n=0; n<this.#N; n++) {
            paths[n] = new Array(this.#K);
        }
        return paths;
    }

    computeIntensityCliques() {
        let intensityCliques = [];
        let cliqueParts = new Array(16);
        let absoluteValueOfSubstractedCP = new Array(8);
        const valueOfMissingPixel = 125;
        for(let x=0; x<this.#X; x++) {
            intensityCliques[x] = [];
            for(let y=0; y<this.#Y; y++) {

                if(x-2 > -1 && y-1 > -1) {
                    cliqueParts[0] = this.#intensities[x-2][y-1];
                } else {
                    cliqueParts[0] = valueOfMissingPixel;
                }
                if(x-2 > -1 && y+1 < this.#Y) {
                    cliqueParts[1] = this.#intensities[x-2][y+1];
                } else {
                    cliqueParts[1] = valueOfMissingPixel;
                }
                if(x-1 > -1 && y-2 > -1) {
                    cliqueParts[2] = this.#intensities[x-1][y-2];
                } else {
                    cliqueParts[2] = valueOfMissingPixel;
                }
                if(x-1 > -1 && y-1 > -1) {
                    cliqueParts[3] = this.#intensities[x-1][y-1];
                } else {
                    cliqueParts[3] = valueOfMissingPixel;
                }
                if(x-1 > -1 && y > -1) {
                    cliqueParts[4] = this.#intensities[x-1][y];
                } else {
                    cliqueParts[4] = valueOfMissingPixel;
                }
                if(x-1 > -1 && y+1 < this.#Y) {
                    cliqueParts[5] = this.#intensities[x-1][y+1];
                } else {
                    cliqueParts[5] = valueOfMissingPixel;
                }
                if(x-1 > -1 && y+2 < this.#Y) {
                    cliqueParts[6] = this.#intensities[x-1][y+2];
                } else {
                    cliqueParts[6] = valueOfMissingPixel;
                }
                if(x > -1 && y-1 > -1) {
                    cliqueParts[7] = this.#intensities[x][y-1];
                } else {
                    cliqueParts[7] = valueOfMissingPixel;
                }
                if(x > -1 && y+1 < this.#Y) {
                    cliqueParts[8] = this.#intensities[x][y+1];
                } else {
                    cliqueParts[8] = valueOfMissingPixel;
                }
                if(x+1 < this.#X && y-2 <= -1) {
                    cliqueParts[9] = this.#intensities[x+1][y-2];
                } else {
                    cliqueParts[9] = valueOfMissingPixel;
                }
                if(x+1 < this.#X && y-1 > -1) {
                    cliqueParts[10] = this.#intensities[x+1][y-1];
                } else {
                    cliqueParts[10] = valueOfMissingPixel;
                }
                if(x+1 < this.#X && y > -1) {
                    cliqueParts[11] = this.#intensities[x+1][y];
                } else {
                    cliqueParts[11] = valueOfMissingPixel;
                }
                if(x+1 < this.#X && y+1 < this.#Y) {
                    cliqueParts[12] = this.#intensities[x+1][y+1];
                } else {
                    cliqueParts[12] = valueOfMissingPixel;
                }
                if(x+1 < this.#X && y+2 < this.#Y) {
                    cliqueParts[13] = this.#intensities[x+1][y+2];
                } else {
                    cliqueParts[13] = valueOfMissingPixel;
                }
                if(x+2 < this.#X && y-1 > -1) {
                    cliqueParts[14] = this.#intensities[x+2][y-1];
                } else {
                    cliqueParts[14] = valueOfMissingPixel;
                }
                if(x+2 < this.#X && y+1 < this.#Y) {
                    cliqueParts[15] = this.#intensities[x+1][y+1];
                } else {
                    cliqueParts[15] = valueOfMissingPixel;
                }

                for (let i = 0; i < absoluteValueOfSubstractedCP.length; i++) {
                    absoluteValueOfSubstractedCP[i] = cliqueParts[i] - cliqueParts[absoluteValueOfSubstractedCP.length - 1];
                    if (absoluteValueOfSubstractedCP[i] < 0) {
                        absoluteValueOfSubstractedCP[i] *= -1;
                    }
                }

                intensityCliques[x][y] = 0;
                for(let i=0; i<absoluteValueOfSubstractedCP.length; i++) {
                    intensityCliques[x][y] += absoluteValueOfSubstractedCP[i];
                }
            }
        }
        return intensityCliques;
    }

    cumulateIntensityCliques() {
        let sum = 0;
        for(let x=0; x<this.#intensityCliques.length; x++) {
            for(let y=0; y<this.#intensityCliques[x].length; y++) {
                sum+=this.#intensityCliques[x][y];
            }
        }
        return sum;
    }

    computeHeuristicInformation() {
        let heuristicInformations = [];
        for(let x=0; x<this.#intensityCliques.length; x++) {
            heuristicInformations[x] = [];
            for(let y=0; y<this.#intensityCliques[x].length; y++) {
                heuristicInformations[x][y] = this.#intensityCliques[x][y] / this.#cumulatedIntensityCliques;
            }
        }
        return heuristicInformations;
    }

    initializePaths() {
        let paths = [];
        let randomNumX, randomNumY;
        for(let n=0; n<this.#paths.length; n++) {
            paths[n] = [];
            for(let k=0; k<this.#paths[n].length; k++) {
                randomNumX = Math.floor(Math.random() * (this.#X+1));
                randomNumY = Math.floor(Math.random() * (this.#Y+1));
                paths[n][k] = new Path(this.#L, randomNumX, randomNumY);
            }
        }
        return paths;
    }
    
    printEdges(edges) {
        let pixelMarker = 0;
        for(let x=0; x<edges.length; x++) {
            for(let y=0; y<edges[x].length; y++) {
                let value = (edges[x][y] === true) ? 0 : 255;
                //Red
                this.#imgData[pixelMarker] = value;
                //Green
                this.#imgData[pixelMarker+1] = value;
                //Blue
                this.#imgData[pixelMarker+2] = value;
                pixelMarker+=4;
            }
        }
        const newImageData = new ImageData(new Uint8ClampedArray(this.#imgData), edges[0].length, edges.length);
        this.#targetCanvas.putImageData(newImageData, 0, 0);
    }
}
