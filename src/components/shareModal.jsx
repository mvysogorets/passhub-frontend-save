import axios from "axios";
import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ModalCross from "./modalCross";

import { contextMenu, Menu, Item, Separator, Submenu } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";

import SafeUser from "./safeUser";
import ItemModalFieldNav from "./itemModalFieldNav";
import * as passhubCrypto from "../lib/crypto";

class ShareModal extends Component {
  state = {
    userList: [],
    email: "",
    invitedUserRights: "can view",
    errMsg: "",
  };

  isShown = false;
  isAdmin = false;
  refreshOnClose = false;

  onEmailChange = (e) => this.setState({ email: e.target.value, errMsg: "" });

  onClose = (refresh = false) => {
    this.props.onClose(refresh || this.refreshOnClose);
  };

  safeUserMenu = (
    <Menu id={"invited-user-menu"}>
      <Item
        onClick={(e) => {
          this.setState({ invitedUserRights: "can view" });
        }}
      >
        <div>
          <div>Can view</div>
          <div
            style={{
              fontSize: "13px",
              opacity: "0.5",
              maxWidth: "17em",
              whiteSpace: "break-spaces",
            }}
          >
            User can only view records and download files
          </div>
        </div>
      </Item>
      <Item
        onClick={(e) => {
          this.setState({ invitedUserRights: "can edit" });
        }}
      >
        <div>
          <div>Can Edit</div>
          <div
            style={{
              fontSize: "13px",
              opacity: "0.5",
              maxWidth: "17em",
              whiteSpace: "break-spaces",
            }}
          >
            User can edit, delete, and add files to the Safe
          </div>
        </div>
      </Item>
      <Item
        onClick={(e) => {
          this.setState({ invitedUserRights: "safe owner" });
        }}
      >
        <div>
          <div>Safe owner</div>
          <div
            style={{
              fontSize: "13px",
              opacity: "0.5",
              maxWidth: "17em",
              whiteSpace: "break-spaces",
            }}
          >
            Additionaly can share safe and manage user access rights
          </div>
        </div>
      </Item>
    </Menu>
  );

  shareByMailFinal = (username, eAesKey) => {
    let role = "readonly";
    if (this.invitedUserRights == "can view") {
      role = "editor";
    }
    if (this.invitedUserRights == "site owner") {
      role = "administrator";
    }

    const vault = this.props.folder.safe
      ? this.props.folder.safe.id
      : this.props.folder.id;
    axios
      .post("safe_acl.php", {
        verifier: document.getElementById("csrf").getAttribute("data-csrf"),
        vault,
        operation: "email_final",
        name: username,
        key: eAesKey,
        safeName: vault.name,
        role,
      })
      .then((reply) => {
        const result = reply.data;
        if (result.status == "Ok") {
          /*
          const url =
            window.location.href.substring(
              0,
              window.location.href.lastIndexOf("/")
            ) + "/";
          const subj = "Passhub safe shared with you";
          const body = `${state.userMail} shared a Passhub safe with you.\n\n Please visit ${url}`;
          openmailclient.openMailClient(username, subj, body);
          */
          this.refreshOnClose = true;
          this.getSafeUsers();
          return;
        }
        this.setState({ errMsg: result.status });
        return;
      })
      .catch((err) => {
        this.setState({ errMsg: err });
      });
  };

  onSubmit = () => {
    let name = this.state.email.trim();
    if (name.length < 1) {
      this.setState({ errMsg: "Recipient email should not be empty" });
      return;
    }

    const [SafeID, safeAesKey] = this.props.folder.safe
      ? [this.props.folder.safe.id, this.props.folder.safe.key]
      : [this.props.folder.id, this.props.folder.key];

    axios
      .post("safe_acl.php", {
        verifier: document.getElementById("csrf").getAttribute("data-csrf"),
        vault: SafeID,
        operation: "email",
        origin: window.location.origin,
        name: this.state.email,
      })
      .then((reply) => {
        const result = reply.data;
        if (result.status === "login") {
          window.location.href = "expired.php";
          return;
        }

        if (result.status == "Ok") {
          passhubCrypto.decryptAesKey(safeAesKey).then((aesKey) => {
            const hexPeerEncryptedAesKey = passhubCrypto.encryptAesKey(
              result.public_key,
              aesKey
            );
            this.shareByMailFinal(this.state.email, hexPeerEncryptedAesKey);
          });
          return;
        }
        this.setState({ errMsg: result.status });
        return;
      })
      .catch((err) => {
        this.setState({ errMsg: err });
      });
  };

  removeUser = (name) => {
    axios
      .post("safe_acl.php", {
        verifier: document.getElementById("csrf").getAttribute("data-csrf"),
        vault: this.props.folder.id,
        operation: "delete",
        name,
      })
      .then((reply) => {
        const result = reply.data;
        if (result.status == "Ok") {
          this.setState({ userList: result.UserList });
          return;
        }
        this.setState({ errMsg: result.status });
      })
      .catch((err) => {
        this.setState({ errMsg: err });
      });
  };

  setUserRole = (name, role) => {
    if (role == "Remove") {
      this.removeUser(name);
      return;
    }

    axios
      .post("safe_acl.php", {
        verifier: document.getElementById("csrf").getAttribute("data-csrf"),
        vault: this.props.folder.id,
        operation: "role",
        name,
        role,
      })
      .then((reply) => {
        const result = reply.data;
        if (result.status == "Ok") {
          this.setState({ userList: result.UserList });
          return;
        }
        this.setState({ errMsg: result.status });
      })
      .catch((err) => {
        this.setState({ errMsg: err });
      });
  };

  onUnsubscribe = () => {
    const [SafeID, safeAesKey] = this.props.folder.safe
      ? [this.props.folder.safe.id, this.props.folder.safe.key]
      : [this.props.folder.id, this.props.folder.key];

    axios
      .post("safe_acl.php", {
        verifier: document.getElementById("csrf").getAttribute("data-csrf"),
        vault: SafeID,
        operation: "unsubscribe",
      })
      .then((reply) => {
        const result = reply.data;
        this.onClose(true);
      })
      .catch((err) => {
        this.setState({ errMsg: err });
      });
  };

  getSafeUsers = () => {
    const vault = this.props.folder.safe
      ? this.props.folder.safe.id
      : this.props.folder.id;

    axios
      .post("safe_acl.php", {
        verifier: document.getElementById("csrf").getAttribute("data-csrf"),
        vault: this.props.folder.id,
      })
      .then((reply) => {
        const result = reply.data;
        if (result.status === "Ok") {
          let filteredUserList = result.UserList.filter((user) => {
            if (user.myself && user.role == "administrator") {
              this.isAdmin = true;
            }
            return user.name.length > 0 || user.myself;
          });
          filteredUserList.sort((u1, u2) => {
            if (u1.myself && !u2.myself) {
              return -1;
            }
            if (u1.name.toUpperCase() < u2.name.toUpperCase()) {
              return -1;
            }
            if (u1.name.toUpperCase() > u2.name.toUpperCase()) {
              return 1;
            }
            return 0;
          });

          this.setState({ userList: filteredUserList });

          return;
        }
        if (result.status === "login") {
          window.location.href = "expired.php";
          return;
        }
      })
      .catch((err) => {
        // modalAjaxError($("#safe_users_alert"), "", "", err);
      });
  };

  render() {
    let title = "";
    if (this.props.show) {
      title = this.props.folder.name;
    }

    if (this.props.show) {
      if (!this.isShown) {
        this.isShown = true;
        this.isAdmin = false;
        this.refreshOnClose = false;
        this.state.userList = [];
        this.state.email = "";
        this.state.errMsg = "";
        this.getSafeUsers();
      }
    } else {
      this.isShown = false;
    }

    const recipientField =
      !this.isAdmin && this.state.userList.length > 0 ? (
        ""
      ) : (
        <div className="itemModalField" style={{ marginBottom: "16px" }}>
          <ItemModalFieldNav name="Email" />
          <div>
            <input
              onChange={this.onEmailChange}
              readOnly={false}
              spellCheck={false}
              value={this.state.email}
            ></input>
          </div>
        </div>
      );

    let userCount = "";
    if (this.state.userList.length == 1) {
      userCount = "1 user has access";
    }
    if (this.state.userList.length > 1) {
      userCount = `${this.state.userList.length} users have access`;
    }

    return (
      <Modal
        show={this.props.show}
        onHide={() => this.onClose()}
        animation={false}
        centered
      >
        <ModalCross onClose={this.props.onClose}></ModalCross>
        <div className="modalTitle">
          <div>
            <svg width="32" height="32" style={{ margin: "8px 10px 0 0" }}>
              <use href="#f-safe"></use>
            </svg>
          </div>

          <div className="h2">{title}</div>
        </div>

        <Modal.Body className="edit">
          {this.isAdmin && (
            <div style={{ marginBottom: "12px" }}>
              User invited:{" "}
              <span
                style={{
                  color: "#009A50",
                  cursor: "pointer",
                  marginLeft: "6px",
                }}
                onClick={(e) => {
                  contextMenu.show({ id: "invited-user-menu", event: e });
                }}
              >
                {this.state.invitedUserRights}
                <svg
                  width="24"
                  height="24"
                  style={{
                    verticalAlign: "top",
                    fill: "#009A50",
                  }}
                >
                  <use href="#angle"></use>
                </svg>
              </span>
              {this.safeUserMenu}
            </div>
          )}
          {recipientField}

          {this.state.errMsg.length > 0 ? (
            <div style={{ color: "red" }}>{this.state.errMsg}</div>
          ) : (
            ""
          )}

          {this.isAdmin && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "24px",
              }}
            >
              <Button onClick={this.onSubmit}>Share Safe</Button>
            </div>
          )}
          <div
            style={{
              fontSize: "14px",
              lineHeight: "22px",
              color: "#8D8D94",
              marginBottom: "20px",
            }}
          >
            {userCount}
          </div>
          {this.state.userList.map((user) => (
            <SafeUser
              key={user.name}
              user={user}
              isAdmin={this.isAdmin}
              setUserRole={this.setUserRole}
            />
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => {
              this.onClose();
            }}
          >
            Close
          </Button>
          {!this.isAdmin && this.state.userList.length > 0 && (
            <Button onClick={this.onUnsubscribe}>Unsubscribe</Button>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ShareModal;
