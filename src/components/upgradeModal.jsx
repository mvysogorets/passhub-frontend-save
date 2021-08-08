import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import axios from "axios";

import InputField from "./inputField";
import TextAreaField from "./textAreaField";

class UpgradeModal extends Component {
  state = { discount: "", errorMsg: "" };

  isShown = false;

  onDiscountChange = (e) => {
    this.setState({ discount: e.target.value, errorMsg: "" });
  };

  onEmailChange = (e) => {
    this.setState({ email: e.target.value, errorMsg: "" });
  };

  onMessageChange = (e) => {
    this.setState({ message: e.target.value, errorMsg: "" });
  };

  onSubmit = () => {
    if (this.state.message.trim().length == 0) {
      this.setState({ errorMsg: "please fill in the message field" });
      return;
    }

    axios
      .post("contact_us.php", {
        verifier: document.getElementById("csrf").getAttribute("data-csrf"),
        name: this.state.name,
        email: this.state.email,
        message: this.state.message,
      })
      .then((reply) => {
        const result = reply.data;
        if (result.status === "Ok") {
          this.props.onClose("success");
          return;
        }
        if (result.status === "login") {
          window.location.href = "expired.php";
          return;
        }
        this.setState({ errorMsg: result.status });
      })
      .catch((err) => {
        this.setState({ errorMsg: err });
      });
  };

  render() {
    if (this.props.show) {
      if (!this.isShown) {
        this.isShown = true;
        this.setState({ name: "", email: "", message: "", errorMsg: "" });
      }
    } else {
      this.isShown = false;
    }

    return (
      <Modal
        show={this.props.show}
        onShow={this.onShow}
        onHide={this.props.onClose}
        animation={false}
        centered
      >
        <Modal.Header closeButton>
          <h2>Upgrade to Premium</h2>
        </Modal.Header>
        <Modal.Body className="edit" style={{ marginBottom: "24px" }}>
          <div style={{ marginBottom: "32px" }}>
            Get unlimited records and 1GB of free space
          </div>
          {this.state.errorMsg.length > 0 && (
            <p style={{ color: "red" }}>{this.state.errorMsg}</p>
          )}

          <InputField
            value={this.state.discount}
            id="upgrade-discount"
            label="Discount"
            onChange={this.onDiscountChange}
            edit
          >
            <Button variant="primary" type="button" onClick={this.onApply}>
              Apply
            </Button>
          </InputField>

          <div class="payment_request" id="payment"></div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={this.props.onClose}
            style={{ marginRight: "12px" }}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default UpgradeModal;
