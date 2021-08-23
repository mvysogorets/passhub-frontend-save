import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

class DeleteAccountFinalModal extends Component {
  state = {};
  render() {
    return (
      <Modal
        show={this.props.show}
        onShow={this.onShow}
        onHide={this.props.onClose}
        animation={false}
        centered
      >
        <Modal.Header>
          <h2>Close my account</h2>
        </Modal.Header>
        <Modal.Body style={{ marginBottom: "24px" }}></Modal.Body>
        <div style={{ marginBottom: "48px" }}>
          You are about to lose all your data stored in PassHub and you will be
          unable to restore it.
        </div>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={this.props.onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => {}}>
            Close account
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default DeleteAccountFinalModal;
