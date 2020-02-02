import React from "react";
import {Card} from "antd"
import Pictures from "../utils/Pictures";
import AcoCore from "../utils/aco/AcoCore";

const { Meta } = Card;

export default class Demonstration extends React.Component {

    state = {
        subtitle: 'ACO systems',
        selectedImageIds: []
    };

    constructor(props) {
        super(props);
        this.props.subtitle(this.state.subtitle);
    }

    handleClick(data) {
        const id = data.charAt(data.length-1);
        const imgElement = document.getElementById("picture-"+id);
        const canvasElement = document.getElementById("canvas-"+id);

        if(imgElement !== null) {
            this.runAcoOnPicture(id);
        }
        if(canvasElement !== null) {
            this.replaceCanvasWithImage(id);
        }
    }

    runAcoOnPicture(id) {
        const selectedPicture = Pictures.getPictureData().filter(elem => (elem.id===("picture-"+id)))[0];
        const selectedDomImage = document.getElementById(selectedPicture.id);
        const ghostCanvas = document.createElement("canvas");
        const demoCanvas = document.createElement('canvas');

        //Convert selected image to invisible canvas and extract
        let ghostCtx = ghostCanvas.getContext("2d");
        ghostCtx.drawImage(selectedDomImage, 0, 0, selectedDomImage.naturalWidth, selectedDomImage.naturalHeight, 0, 0, ghostCanvas.width, ghostCanvas.height);
        const imgData = ghostCtx.getImageData(0, 0, ghostCanvas.width, ghostCanvas.height).data;

        //Create empty Canvas to draw aco output on it and replace with image
        let demoCtx = demoCanvas.getContext("2d");
        demoCanvas.setAttribute("id", "canvas-"+id);
        selectedDomImage.parentNode.replaceChild(demoCanvas, selectedDomImage);

        let aco = new AcoCore(imgData, ghostCanvas.width, ghostCanvas.height, demoCtx);
        aco.run();
    }

    replaceCanvasWithImage(id) {
        const picture = Pictures.getPictureData().filter(elem => (elem.id===("picture-"+id)))[0];
        const selectedCanvas = document.getElementById("canvas-"+id);
        const htmlImage = document.createElement("img");

        htmlImage.setAttribute("id", picture.id);
        htmlImage.setAttribute("src", picture.image);
        htmlImage.setAttribute("alt", picture.descr)

        selectedCanvas.parentNode.replaceChild(htmlImage, selectedCanvas);
    }

    render() {
        let cardList = [];
        Pictures.getPictureData().forEach(elem => {
            let card = this.renderCard(elem.id, elem.image, elem.descr);
            cardList.push(card);
        });
        return(
            <div>
                <h2>Demonstration,</h2>
                <br/>
                <p>Here we want to use the algorithm to detect edges on images.</p>
                <p>Below is a set of images to run the algorithm on.</p>
                <p>Please beware that the algorithm will take some seconds and the result will only be shown when computations is done finally.</p>
                <p>You can reset the result to the original picture by clicking on it again.</p>
                <p>Be careful, if you click twice on an image too quickly, you wont see any result, because the result is replaced by the original picture immediately.</p>
                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    marginTop: "25px"
                }}>
                    {cardList}
                </div>
            </div>
        );
    }

    renderCard(id, image, descr) {
        return (
            <div
                key={"container-"+id}
                onClick={this.handleClick.bind(this, id)}>
                <Card
                    hoverable
                    id={"card-"+id}
                    style={{ width: 240, marginRight: "25px", marginBottom: "25px"}}
                    cover={<img id={id} src={image} alt={descr}/>}
                >
                    <Meta title={descr}/>
                </Card>
            </div>);
    }
}
