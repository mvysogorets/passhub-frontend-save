import React, { Component } from "react";

import axios from "axios";

import * as passhubCrypto from "../lib/crypto";
import { isStrongPassword } from "../lib/utils";
import { openInExtension } from "../lib/extensionInterface";

import ItemModalFieldNav from "./itemModalFieldNav";

import ItemModal from "./itemModal";

class LoginModal extends Component {
  state = {
    edit: false,
    showPassword: false,
    errorTitle: "",
    username: "",
    password: "",
    url: "",
  };

  isShown = false;

  showPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  onEdit = () => {
    this.setState({ edit: true });
  };

  onUsernameChange = (e) => this.setState({ username: e.target.value });

  onPasswordChange = (e) => this.setState({ password: e.target.value });

  onUrlChange = (e) => this.setState({ url: e.target.value });

  onClose = () => {
    this.props.onClose();
  };

  onSubmit = (title, note) => {
    const pData = [
      title,
      this.state.username,
      this.state.password,
      this.state.url,
      note,
    ];
    const options = {};

    const folder = this.props.args.folder;
    const [aesKey, SafeID, folderID] = folder.safe
      ? [folder.safe.bstringKey, folder.safe.id, folder.id]
      : [folder.bstringKey, folder.id, 0];

    const eData = passhubCrypto.encryptItem(pData, aesKey, options);
    const data = {
      verifier: document.getElementById("csrf").getAttribute("data-csrf"),
      vault: SafeID,
      folder: folderID,
      encrypted_data: eData,
    };
    if (this.props.args.item) {
      data.entryID = this.props.args.item._id;
    }

    axios
      .post("items.php", data)
      .then((reply) => {
        const result = reply.data;
        if (result.status === "Ok") {
          this.props.onClose(true);
          return;
        }
        if (result.status === "login") {
          window.location.href = "expired.php";
          return;
        }
        if (result.status === "expired") {
          window.location.href = "expired.php";
          return;
        }
        if (result.status === "no rights") {
          // showAlert("Sorry, you do not have editor rights for this safe");
          return;
        }
        // showAlert(result.status);
      })
      .catch(
        (err) => {} /*modalAjaxError($("#safe_users_alert"), "", "", err)*/
      );
  };

  render() {
    if (this.props.show) {
      if (!this.isShown) {
        this.isShown = true;
        this.state.showPassword = false;
        if (this.props.args.item) {
          this.state.username = this.props.args.item.cleartext[1];
          this.state.password = this.props.args.item.cleartext[2];
          this.state.url = this.props.args.item.cleartext[3];
          this.state.edit = false;
        } else {
          this.state.username = "";
          this.state.pasword = "";
          this.state.url = "";
          this.state.edit = true;
        }
      }
    } else {
      this.isShown = false;
    }

    let passwordType = this.state.showPassword ? "text" : "password";

    const path = this.props.args.folder
      ? this.props.args.folder.path.join(" > ")
      : [];

    const strongPassword = isStrongPassword(this.state.password);
    const passwordStrength = strongPassword ? (
      <span className="colored" style={{ opacity: "1" }}>
        <span style={{ margin: "0 .3em" }}>&#183;</span>
        Strong
      </span>
    ) : (
      <span style={{ color: "#EB6500", opacity: "1" }}>
        <span style={{ margin: "0 .3em" }}>&#183;</span>
        Weak
      </span>
    );

    const passwordBackground =
      !this.state.edit && this.state.password.length && !strongPassword
        ? "weakPassword"
        : "";

    return (
      <ItemModal
        show={this.props.show}
        args={this.props.args}
        onClose={this.props.onClose}
        onEdit={this.onEdit}
        onSubmit={this.onSubmit}
      >
        <div className="itemModalField upper">
          <ItemModalFieldNav copy name="Username" />
          <div>
            <input
              className="lp"
              onChange={this.onUsernameChange}
              readOnly={!this.state.edit}
              spellCheck={false}
              value={this.state.username}
            ></input>
          </div>
        </div>
        <div className={`itemModalField lower ${passwordBackground}`}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontSize: "14px" }}>
              <span style={{ opacity: "0.5" }}>Password</span>
              {this.state.password.length ? passwordStrength : ""}
            </div>
            <div>
              <span className="iconTitle">Copy</span>
              <svg
                width="24"
                height="24"
                fill="none"
                style={{ opacity: "0.5" }}
              >
                <use href="#f-copy"></use>
              </svg>
            </div>
          </div>
          <div>
            <input
              className="lp"
              type={passwordType}
              onChange={this.onPasswordChange}
              readOnly={!this.state.edit}
              spellCheck={false}
              value={this.state.password}
            ></input>
          </div>
        </div>
        <div
          className="colored"
          onClick={this.showPassword}
          style={{
            textAlign: "right",
            margin: "6px 0 16px 0",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          <svg width="21" height="21" fill="none">
            <use href="#f-eye"></use>
          </svg>
          <span
            style={{
              marginLeft: "6px",
              width: "6.5rem",
              display: "inline-block",
            }}
          >
            {this.state.showPassword ? "Hide" : "Show"} Password
          </span>
        </div>
        <div
          className="itemModalField"
          style={{ marginBottom: 32 }}
          onClick={
            !this.state.edit &&
            this.props.args.item &&
            this.props.args.item.cleartext[3].length > 0
              ? () => openInExtension(this.props.args.item)
              : () => {}
          }
        >
          <ItemModalFieldNav copy name="Website Address" />
          <div>
            <input
              onChange={this.onUrlChange}
              readOnly={!this.state.edit}
              spellCheck={false}
              value={this.state.url}
            ></input>
          </div>
        </div>
        {this.props.args.item &&
          this.props.args.item.cleartext[5] &&
          !this.state.edit && (
            <div className="itemModalField" style={{ marginBottom: 32 }}>
              <ItemModalFieldNav copy name="Google authenticator" />
              <div>
                <div
                  className="totp_circle"
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    background: "conic-gradient(red 25%,grey 0%)",
                  }}
                ></div>
              </div>
            </div>
          )}
        {this.state.edit && (
          <div className="itemModalPlusField">
            <svg width="24" height="24" fill="none">
              <use href="#f-plus-field"></use>
            </svg>
            Add Google Authenticator
          </div>
        )}
      </ItemModal>
    );
  }
}

export default LoginModal;

/*
        <div class="itemModalNav">
          <div className="itemModalPath">{path}</div>
          <div>
            <span
              style={{
                fontSize: "2rem",
                fontWeight: "400",
                position: "absolute",
                right: "0",
                marginRight: "20px",
                cursor: "pointer",
              }}
              onClick={this.props.onClose}
            >
              &#215;
            </span>
          </div>
        </div>

        <Modal.Body className={modalClass}>
          <div className="itemModalField upper">
            <ItemModalFieldNav copy name="Username" />
            <div>
              <input
                className="lp"
                onChange={this.onUsernameChange}
                readOnly={!this.state.edit}
                spellCheck={false}
                value={this.state.username}
              ></input>
            </div>
          </div>
          <div className={`itemModalField lower ${passwordBackground}`}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontSize: "14px" }}>
                <span style={{ opacity: "0.5" }}>Password</span>
                {this.state.password.length ? passwordStrength : ""}
              </div>
              <div>
                <span className="iconTitle">Copy</span>
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  style={{ opacity: "0.5" }}
                >
                  <use href="#f-copy"></use>
                </svg>
              </div>
            </div>
            <div>
              <input
                className="lp"
                type={passwordType}
                onChange={this.onPasswordChange}
                readOnly={!this.state.edit}
                spellCheck={false}
                value={this.state.password}
              ></input>
            </div>
          </div>
          <div
            className="colored"
            onClick={this.showPassword}
            style={{
              textAlign: "right",
              margin: "6px 0 16px 0",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            <svg width="21" height="21" fill="none">
              <use href="#f-eye"></use>
            </svg>
            <span
              style={{
                marginLeft: "6px",
                width: "6.5rem",
                display: "inline-block",
              }}
            >
              {this.state.showPassword ? "Hide" : "Show"} Password
            </span>
          </div>

          <div className="itemModalField">
            <ItemModalFieldNav copy name="Website Address" />
            <div>
              <input
                onChange={this.onUrlChange}
                readOnly={!this.state.edit}
                spellCheck={false}
                value={this.state.url}
              ></input>
            </div>
          </div>

          <div className="itemModalPlusField">
            <svg width="24" height="24" fill="none">
              <use href="#f-plus-field"></use>
            </svg>
            Add Google Authenticator
          </div>
          <div className="itemModalPlusField">
            <svg width="24" height="24" fill="none">
              <use href="#f-plus-field"></use>
            </svg>
            Add Notes
          </div>
        </Modal.Body>
            */
