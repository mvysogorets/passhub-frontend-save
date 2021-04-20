import React, { Component } from "react";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

class NoteItemModal extends Component {
  state = { showPassword: false };
  handleClose = (e) => {
    this.props.onClose();
  };

  showPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  render() {
    let { title, username, password, url, notes, code6, path } = [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ];
    if (this.props.item) {
      title = this.props.item.cleartext[0];
      username = this.props.item.cleartext[1];
      password = this.props.item.cleartext[2];
      url = this.props.item.cleartext[3];
      notes = this.props.item.cleartext[4];
      if (this.props.item.cleartext.length >= 6) {
        code6 = this.props.item.cleartext[5];
      }
      path = this.props.item.path.join(" > ");
    }

    return (
      <Modal show={this.props.show} onHide={this.handleClose} animation={false}>
        <Modal.Header closeButton style={{ border: "none" }}>
          <div className="itemModalPath">{path}</div>
        </Modal.Header>
        <div className="itemModalTitle">{title}</div>
        <Modal.Body>
          <div className="itemModalField">
            {/*<div className="label">Notes</div> */}
            <div>{notes}</div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

export default NoteItemModal;
