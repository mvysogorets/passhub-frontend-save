import React, { Component, createRef } from "react";

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
            self.imgRef.current.src = reader.result;
            console.log(self.imgRef.current.naturalHeight);
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
          console.log(this.imgRef.current.naturalHeight);
          // set_size();
          this.forceUpdate();
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
      <img ref={this.imgRef} style={{ width: "100%", height: "100%" }}></img>
    );
  }
}

export default ViewFile;
