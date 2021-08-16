import React, { Component } from "react";
import axios from "axios";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import InputField from "./inputField";

import { urlBase } from "../lib/utils";

class EmailModal extends Component {
  state = { email: "", errorMsg: "" };
  isShown = false;

  onSubmit = () => {
    console.log("Submit");
    const email = this.state.email.trim();
    if (email.length == 0) {
      this.setState({ errorMsg: "Please fill the email field" });
      return;
    }

    const self = this;
    axios
      .post("r-change_mail.php", {
        email,
        base_url: urlBase(),
      })
      .then((reply) => {
        const result = reply.data;
        if (result.status === "Ok") {
          this.props.onClose("dummy", "verifyEmail", email);
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

  onEmailChange = (e) => {
    this.setState({ email: e.target.value, errorMsg: "" });
  };

  render() {
    if (this.props.show) {
      if (!this.isShown) {
        this.isShown = true;
        this.state.email = this.props.accountData.email;
      }
    } else {
      this.isShown = false;
      return null;
    }

    let title = "Add your email address";
    if (
      this.props.accountData.email &&
      this.props.accountData.email.length > 0
    ) {
      title = "Change email address";
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
          <h2>{title}</h2>
        </Modal.Header>
        <Modal.Body className="edit mb32">
          <InputField
            id="mailModalInput"
            label="Email"
            value={this.state.email}
            edit={true}
            onChange={this.onEmailChange}
          ></InputField>
          {this.state.errorMsg.length > 0 && (
            <div className="error">{this.state.errorMsg}</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={this.props.onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={this.onSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default EmailModal;
