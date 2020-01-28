import React from "react";
import {Card} from "antd"
import Pictures from "../utils/Pictures";
import AcoCore from "../utils/aco/AcoCore";

const { Meta } = Card;

export default class Demonstration extends React.Component {

    state = {
        selectedImageIds: []
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

        //Display inverted Image
        /*const invertedImageDataRgba = this.invertImgData(imgData);
        console.log("Inverted imgData: ", imgData);
        const invertedImageData = new ImageData(new Uint8ClampedArray(invertedImageDataRgba), originalWidth, originalHeight);
        demoCtx.putImageData(invertedImageData, 0, 0);
        console.log("Drawn Image: ", originalWidth, originalHeight, invertedImageData);
        */

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
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    marginTop: "25px"
                }}>
                {cardList}
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