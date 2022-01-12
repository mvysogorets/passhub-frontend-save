import Toast from "react-bootstrap/Toast";

import React, { Component } from "react";
import { capitalizeFirstLetter } from "../lib/utils";

class CopyMoveToast extends Component {
  render() {
    return (
      <Toast
        onClose={this.props.onClose}
        show={this.props.show}
        className="go-premium-toast toast-ph"
      >
        <div className="toast-header">
          <div>
            {capitalizeFirstLetter(this.props.operation)} item to another safe
          </div>
          <div>
            <svg
              style={{ width: 24, height: 24, cursor: "pointer" }}
              onClick={this.props.onClose}
            >
              <use href="#f-cross24"></use>
            </svg>
          </div>
        </div>
        <Toast.Body>
          <div>
            Select target safe/folder to copy the item to.<br></br> Choose
            "Paste" in its menu.
          </div>
        </Toast.Body>
      </Toast>
    );
  }
}

export default CopyMoveToast;

/*

        <Toast.Header>{this.props.operation} item to another safe</Toast.Header>

<div className="toast-header-ph">
            {this.props.operation} item to another safe
          </div>

*/
