import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
  NavbarBrand
} from "reactstrap";

import badge from "./badge.jpg";

const photos = [{ src: badge }];

const initialState = {
  toptext: "",
  bottomtext: "",
  lefttext: "",
  isTopDragging: false,
  isBottomDragging: false,
  topY: "84%",
  topX: "80%",
  leftY: "84%",
  leftX: "25%",
  bottomX: "50%",
  bottomY: "96%"
};

class MainPage extends React.Component {
  constructor() {
    super();
    this.state = {
      currentImage: 0,
      modalIsOpen: false,
      currentImagebase64: null,
      ...initialState
    };
  }

  openImage = index => {
    const image = photos[index];
    const base_image = new Image();
    base_image.src = image.src;
    const base64 = this.getBase64Image(base_image);
    this.setState(prevState => ({
      currentImage: index,
      modalIsOpen: !prevState.modalIsOpen,
      currentImagebase64: base64,
      ...initialState
    }));
  };

  toggle = () => {
    this.setState(prevState => ({
      modalIsOpen: !prevState.modalIsOpen
    }));
  };

  changeText = event => {
    this.setState({
      [event.currentTarget.name]: event.currentTarget.value
    });
  };

  getStateObj = (e, type) => {
    let rect = this.imageRef.getBoundingClientRect();
    const xOffset = e.clientX - rect.left;
    const yOffset = e.clientY - rect.top;
    let stateObj = {};
    if (type === "bottom") {
      stateObj = {
        isBottomDragging: true,
        isTopDragging: false,
        bottomX: `${xOffset}px`,
        bottomY: `${yOffset}px`
      };
    } else if (type === "top") {
      stateObj = {
        isTopDragging: true,
        isBottomDragging: false,
        topX: `${xOffset}px`,
        topY: `${yOffset}px`
      };
    }
    return stateObj;
  };

  handleMouseDown = (e, type) => {
    const stateObj = this.getStateObj(e, type);
    document.addEventListener("mousemove", event =>
      this.handleMouseMove(event, type)
    );
    this.setState({
      ...stateObj
    });
  };

  handleMouseMove = (e, type) => {
    if (this.state.isTopDragging || this.state.isBottomDragging) {
      let stateObj = {};
      if (type === "bottom" && this.state.isBottomDragging) {
        stateObj = this.getStateObj(e, type);
      } else if (type === "top" && this.state.isTopDragging) {
        stateObj = this.getStateObj(e, type);
      }
      this.setState({
        ...stateObj
      });
    }
  };

  handleMouseUp = event => {
    document.removeEventListener("mousemove", this.handleMouseMove);
    this.setState({
      isTopDragging: false,
      isBottomDragging: false
    });
  };

  convertSvgToImage = () => {
    const svg = this.svgRef;
    let svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    canvas.setAttribute("id", "canvas");
    const svgSize = svg.getBoundingClientRect();
    canvas.width = svgSize.width;
    canvas.height = svgSize.height;
    const img = document.createElement("img");
    img.setAttribute(
      "src",
      "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)))
    );
    img.onload = function() {
      canvas.getContext("2d").drawImage(img, 0, 0);
      const canvasdata = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.download = "badge.png";
      a.href = canvasdata;
      document.body.appendChild(a);
      a.click();
    };
  };

  getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL;
  }

  render() {
    const image = photos[this.state.currentImage];
    const base_image = new Image();
    base_image.src = image.src;
    var wrh = base_image.width / base_image.height;
    var newWidth = 600;
    var newHeight = newWidth / wrh;
    const textStyleLeft = {
      fontFamily: "Roboto",
      fontSize: "40px",
      // textTransform: "uppercase",
      fill: "#FFF",
      fontWeight: 600,

      // stroke: "#000",
      userSelect: "none"
    };
    const textStyleTop = {
      fontFamily: "Roboto",
      fontSize: "70px",
      // textTransform: "uppercase",
      fill: "#FFF",
      fontWeight: 600,

      // stroke: "#000",
      userSelect: "none"
    };

    const textStyleBottom = {
      fontFamily: "Roboto",
      fontSize: "50px",
      fontWeight: 700,
      // textTransform: "uppercase",
      fill: "#23608c",
      // stroke: "#000",
      userSelect: "none"
    };

    return (
      <div>
        <div className="main-content">
          <div className="content">
            {photos.map((image, index) => (
              <div className="image-holder" key={image.src}>
                <img
                  style={{
                    width: "100%",
                    cursor: "pointer",
                    height: "100%"
                  }}
                  alt={index}
                  src={image.src}
                  onClick={() => this.openImage(index)}
                  role="presentation"
                />
              </div>
            ))}
          </div>
        </div>
        <Modal className="meme-gen-modal" isOpen={this.state.modalIsOpen}>
          <ModalHeader toggle={this.toggle}>Orcha Badge Maker</ModalHeader>
          <ModalBody>
            <svg
              width={newWidth}
              id="svg_ref"
              height={newHeight}
              ref={el => {
                this.svgRef = el;
              }}
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <image
                ref={el => {
                  this.imageRef = el;
                }}
                xlinkHref={this.state.currentImagebase64}
                height={newHeight}
                width={newWidth}
              />
              <text
                style={{
                  ...textStyleLeft,
                  zIndex: this.state.isTopDragging ? 4 : 1
                }}
                x={this.state.leftX}
                y={this.state.leftY}
                dominantBaseline="middle"
                textAnchor="middle"
              >
                {this.state.lefttext}
              </text>

              <text
                style={{
                  ...textStyleTop,
                  zIndex: this.state.isTopDragging ? 4 : 1
                }}
                x={this.state.topX}
                y={this.state.topY}
                dominantBaseline="middle"
                textAnchor="middle"
              >
                {this.state.toptext}
              </text>
              <text
                style={textStyleBottom}
                dominantBaseline="middle"
                textAnchor="middle"
                x={this.state.bottomX}
                y={this.state.bottomY}
              >
                {this.state.bottomtext}
              </text>
            </svg>
            <div className="meme-form">
              <FormGroup>
                <Label for="toptext">Review Score</Label>
                <input
                  className="form-control"
                  type="text"
                  name="toptext"
                  id="toptext"
                  placeholder="79%"
                  onChange={this.changeText}
                />
              </FormGroup>
              <FormGroup>
                <Label for="lefttext">Review Year</Label>
                <input
                  className="form-control"
                  type="text"
                  name="lefttext"
                  id="lefttext"
                  placeholder="2019 RATING"
                  onChange={this.changeText}
                />
              </FormGroup>
              <FormGroup>
                <Label for="bottomtext">App Version</Label>
                <input
                  className="form-control"
                  type="text"
                  name="bottomtext"
                  id="bottomtext"
                  placeholder="IOS Version 1.0"
                  onChange={this.changeText}
                />
              </FormGroup>
              <button
                onClick={() => this.convertSvgToImage()}
                className="btn btn-primary"
              >
                Download
              </button>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default MainPage;
