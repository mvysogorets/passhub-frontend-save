import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import axios from "axios";

import * as passhubCrypto from "../lib/crypto";
import { isStrongPassword } from "../lib/utils";

import ItemModalFieldNav from "./itemModalFieldNav";
import ItemViewIcon from "./itemViewIcon";

class LoginModal extends Component {
  state = {
    edit: true,
    showPassword: false,
    title: "",
    errorTitle: "",
    username: "",
    password: "",
    url: "",
  };

  isShown = false;

  constructor(props) {
    super(props);
    this.titleInput = React.createRef();
  }

  showPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  onTitleChange = (e) =>
    this.setState({ title: e.target.value, errorTitle: "" });

  onUsernameChange = (e) => this.setState({ username: e.target.value });

  onPasswordChange = (e) => this.setState({ password: e.target.value });

  onUrlChange = (e) => this.setState({ url: e.target.value });

  onShow = () => {
    this.state.edit && this.titleInput.current.focus();
  };

  onClose = () => {
    this.props.onClose();
  };

  onEdit = () => {
    this.setState({ edit: true });
  };

  onSubmit = () => {
    const pData = [
      this.state.title,
      this.state.username,
      this.state.password,
      this.state.url,
      "",
    ];
    //    const options = init.note ? { note: 1 } : {};
    const options = {};

    const [eAesKey, SafeID, folderID] = this.props.folder.safe
      ? [
          this.props.folder.safe.key,
          this.props.folder.safe.id,
          this.props.folder.id,
        ]
      : [this.props.folder.key, this.props.folder.id, 0];

    passhubCrypto.decryptAesKey(eAesKey).then((aesKey) => {
      const eData = passhubCrypto.encryptItem(
        pData,
        aesKey,
        // init.safe.bstringKey, ?? TODO
        options
      );
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
    });
  };

  render() {
    if (this.props.show) {
      if (!this.isShown) {
        this.isShown = true;
        this.state.showPassword = false;
        if (this.props.args.item) {
          this.state.title = this.props.args.item.cleartext[0];
          this.state.username = this.props.args.item.cleartext[1];
          this.state.password = this.props.args.item.cleartext[2];
          this.state.url = this.props.args.item.cleartext[3];
          this.state.notes = this.props.args.item.cleartext[4];
          this.state.edit = false;
        } else {
          this.state.title = "";
          this.state.username = "";
          this.state.pasword = "";
          this.state.url = "";
          this.state.notes = "";
          this.state.edit = true;
        }
      }
    } else {
      this.isShown = false;
    }

    let passwordType = this.state.showPassword ? "text" : "password";

    let path = [];

    let modalClass = this.state.edit ? "edit" : "view";

    if (this.props.folder) {
      path = this.props.folder.path.join(" > ");
    }

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
      <Modal
        show={this.props.show}
        onShow={this.onShow}
        onHide={this.onClose}
        animation={false}
        centered
      >
        <div class="itemModalNav">
          <div className="itemModalPath">{path}</div>
          <div>
            {!this.state.edit && (
              <React.Fragment>
                <ItemViewIcon iconId="#f-history" opacity="1" title="History" />
                <ItemViewIcon iconId="#f-move" title="Move" />
                <ItemViewIcon iconId="#f-copy" title="Copy" />
                <ItemViewIcon iconId="#f-trash" title="Delete" />
                <div class="itemModalEditButton" onClick={this.onEdit}>
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    stroke="#00BC62"
                    style={{
                      verticalAlign: "unset",
                      marginRight: "10px",
                    }}
                  >
                    <use href="#f-edit"></use>
                  </svg>
                  <span style={{ verticalAlign: "top" }}>Edit</span>
                </div>
              </React.Fragment>
            )}

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

        {this.state.edit ? (
          <Form.Control
            className="itemModalTitle"
            ref={this.titleInput}
            type="text"
            onChange={this.onTitleChange}
            value={this.state.title}
            placeholder="Title"
          />
        ) : (
          <div className="itemModalTitle">{this.state.title}</div>
        )}

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
              <use href="#show-password"></use>
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

        {this.state.edit && (
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={this.onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" onClick={this.onSubmit}>
              {this.props.args.item ? "Save" : "Save"}
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    );
  }
}

export default LoginModal;
