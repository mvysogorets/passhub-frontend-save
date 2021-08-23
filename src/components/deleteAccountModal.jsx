import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

class DeleteAccountModal extends Component {
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
          <h2>Before shutting down your account</h2>
        </Modal.Header>
        <Modal.Body style={{ marginBottom: "24px" }}></Modal.Body>
        <div style={{ marginBottom: "8px" }}>
          <b>Be sure</b> to transfer ownership of your shared safes to your
          peers.
        </div>
        <div style={{ marginBottom: "48px" }}>
          <b>Please note</b> it is the last chance to backup (export) all your
          data.
        </div>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={this.props.onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => this.props.onClose("dummy", "delete account final")}
          >
            Next
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default DeleteAccountModal;
