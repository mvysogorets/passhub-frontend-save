import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

class SuccessModal extends Component {
  render() {
    return (
      <Modal
        show={this.props.show}
        onShow={this.onShow}
        onHide={this.props.onClose}
        animation={false}
        centered
      >
        <Modal.Body>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <svg width="112" height="112" fill="none">
              <use href="#f-success"></use>
            </svg>
            <div style={{ marginBottom: "1em" }}>
              <h2>Success</h2>
            </div>
            <div style={{ marginBottom: "108px" }}>
              Your message has been sent
            </div>
            <Button
              variant="primary"
              type="submit"
              style={{ minWidth: "168px", marginLeft: "12px" }}
              onClick={this.props.onClose}
            >
              Got it
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

export default SuccessModal;
