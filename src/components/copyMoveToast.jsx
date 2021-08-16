import Toast from "react-bootstrap/Toast";

import React, { Component } from "react";

class CopyMoveToast extends Component {
  render() {
    return (
      <Toast onClose={this.props.onClose} show={this.props.show}>
        <Toast.Header>
          <strong>{this.props.operation} item to another safe</strong>
          {this.props.header}
        </Toast.Header>
        <Toast.Body>
          Select target safe/folder to copy the item to. Choose "Paste" in its
          menu.
        </Toast.Body>
      </Toast>
    );
  }
}

export default CopyMoveToast;
