import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ModalCross from "./modalCross";

import axios from "axios";

import InputField from "./inputField";

import Slider, { Range } from "rc-slider";
import "rc-slider/assets/index.css";

class AccountModal extends Component {
  state = { inactiveTimeout: 15 };

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

  onUpgrade = (e) => {
    this.props.onClose(e, "upgrade");
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

  onMailClick = () => {
    console.log("on mail click");
    this.props.onClose("dummy", "email");
  };

  onSliderChange = (value) => {
    console.log("Slider ", value);
    // restartIdleTimers(value);
    this.props.getAccountData({
      verifier: document.getElementById("csrf").getAttribute("data-csrf"),
      operation: "setInactivityTimeout",
      value: value * 60,
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
      return null;
    }
    const marks = { 15: "15 min", 60: "1 hour", 240: "4 hours" };

    let slider_position = 240;
    const { desktop_inactivity } = this.props.accountData;
    if (desktop_inactivity) {
      if (desktop_inactivity < 50 * 60) {
        slider_position = 15;
      } else if (desktop_inactivity < 110 * 60) {
        slider_position = 60;
      }
    }

    return (
      <Modal
        show={this.props.show}
        onShow={this.onShow}
        onHide={this.props.onClose}
        animation={false}
        centered
      >
        <ModalCross onClose={this.props.onClose}></ModalCross>
        <div className="modalTitle">
          <div className="h2">Account Setting</div>
        </div>

        <Modal.Body style={{ marginBottom: "24px" }}>
          {this.props.accountData.plan && (
            <div style={{ marginBottom: "32px" }}>
              Account type: <b>{this.props.accountData.plan}</b>
            </div>
          )}
          <div style={{ margin: "0 0 12px 0" }}>Inactvity timeout</div>
          <div style={{ marginBottom: "64px", padding: "0 32px" }}>
            <Slider
              value={slider_position}
              min={15}
              max={240}
              marks={marks}
              step={null}
              onChange={this.onSliderChange}
              trackStyle={{ background: "#00BC62" }}
              handleStyle={{ borderColor: "#00BC62" }}
            ></Slider>
          </div>

          {this.props.accountData.email.length ? (
            <InputField
              label="Email"
              readonly
              value={this.props.accountData.email}
              onClick={this.onMailClick}
            >
              <div>
                <span className="iconTitle">Edit</span>
                <svg
                  className="gotowebsite"
                  width="24"
                  height="24"
                  title="Edt"
                  style={{ opacity: "0.5", stroke: "black", fill: "none" }}
                >
                  <use href="#f-edit"></use>
                </svg>
              </div>
            </InputField>
          ) : (
            <div
              className="itemModalField"
              style={{
                marginBottom: 62,
                position: "relative",
                background: "#E6F8EF",
              }}
              onClick={this.onMailClick}
            >
              <div
                style={{
                  margin: "12px auto",
                  color: "#009A50",
                  display: "table",
                }}
              >
                <div style={{ marginBottom: "10px" }}>
                  <svg width="24" height="24" style={{ marginRight: "10px" }}>
                    <use href="#f-add"></use>
                  </svg>
                  Add email
                </div>
                <div style={{ fontSize: "14px" }}>
                  an email is needed so that other users can share safes with
                  you, as well as to subscribe to news and updates
                </div>
              </div>
            </div>
          )}
          <div
            onClick={() => {
              console.log("delete account 1");
              this.props.onClose("dummy", "delete account");
            }}
          >
            <div
              style={{
                color: "#B40020",
                marginTop: "32px",
                cursor: "pointer",
              }}
            >
              <svg width="24" height="24" style={{ marginRight: "8px" }}>
                <use href="#f-trash-red"></use>
              </svg>
              Delete Account
            </div>
            <div style={{ color: "#8D8D94", fontSize: "14px" }}>
              Once deleted, your records, files, safes and folders cannot be
              recovered
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={this.props.onClose}>
            Close
          </Button>
          {this.props.accountData.plan &&
            this.props.accountData.plan == "FREE" && (
              <Button variant="primary" onClick={this.onUpgrade}>
                Upgrade to Premium
              </Button>
            )}
        </Modal.Footer>
      </Modal>
    );
  }
}

export default AccountModal;

/*
            <div
              style={{
                background: "#00BC62",
                opacity: ".1",
                borderRadius: "16px",
              }}
            >
              <div>
                an email is needed so that other users can share safes with you,
                as well as to subscribe to news and updates
              </div>
</div> */
