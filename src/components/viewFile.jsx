import React, { Component, createRef } from "react";
import { openWithTicket } from "wwpass-frontend";

class ViewFile extends Component {
  ext = "";
  constructor(props) {
    super(props);
    this.imgRef = React.createRef();
    this.iframeRef = React.createRef();
  }

  componentWillUnmount = () => {
    console.log("viewFile will unmount", this.ext);
  };

  componentWillUpdate = () => {
    console.log("viewFile will update", this.props, this.ext);
  };

  componentWillMount = () => {
    console.log("viewFile will mount", this.ext);
  };

  componentDidUpdate = () => {
    console.log("viewFile did update", this.props, this.ext);
    if (this.props.show) {
      if (this.ext == "pdf") {
        const obj_url = URL.createObjectURL(this.props.blob);
        this.iframeRef.current.setAttribute("src", obj_url);
        URL.revokeObjectURL(obj_url);
        //    this.forceUpdate();
      } else if (this.ext != "") {
        const self = this;
        const reader = new FileReader();
        reader.addEventListener(
          "load",
          function () {
            const imgElement = self.imgRef.current;
            imgElement.src = reader.result;
            imgElement.onload = function () {
              const { naturalHeight, naturalWidth } = imgElement;
              const { width, height } = imgElement.parentElement;
              console.log(naturalHeight, naturalWidth);
              console.log(width, height);
            };
            // set_size();
            //     this.forceUpdate();
          },
          false
        );
        reader.readAsDataURL(this.props.blob);
      }
    }
  };

  componentDidMount = () => {
    console.log("viewFile did mount", this.ext);
    if (this.ext == "pdf") {
      const obj_url = URL.createObjectURL(this.props.blob);
      this.iframeRef.current.setAttribute("src", obj_url);
      URL.revokeObjectURL(obj_url);
      this.forceUpdate();
    } else if (this.ext != "") {
      const reader = new FileReader();
      reader.addEventListener(
        "load",
        function () {
          this.imgRef.current.src = reader.result;
          console.log(this.imgRef.current);
          // set_size();
          //this.forceUpdate();
        },
        false
      );
      reader.readAsDataURL(this.props.blob);
    }
    return;
  };

  render() {
    console.log("viewFile render", this.props, this.ext);
    if (!this.props.show) {
      return null;
    }
    const { filename } = this.props;

    const dot = filename.lastIndexOf(".");
    this.ext = filename.substring(dot + 1).toLowerCase();

    if (this.ext == "pdf") {
      return (
        <iframe
          ref={this.iframeRef}
          style={{ width: "100%", height: "100%" }}
        ></iframe>
      );
    }

    return (
      <React.Fragment>
        <div className="col img-view">
          <div
            className="green70"
            style={{ cursor: "pointer", margin: "32px 0 18px 0" }}
            onClick={this.props.gotoMain}
          >
            <svg
              width="24"
              height="24"
              style={{
                fill: "#009a50",
                transform: "rotate(90deg)",
              }}
            >
              <use href="#angle"></use>
            </svg>
            Back
          </div>

          <div className="h2">{filename}</div>
          <div className="img-frame">
            <img
              ref={this.imgRef}
              style={{
                maxHeight: "100%",
                maxWidth: "100%",
                margin: "0 auto",
                boxShadow: "0px 10px 35px rgba(0, 0, 0, 0.2)",
              }}
            ></img>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ViewFile;
