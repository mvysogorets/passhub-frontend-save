import React, { Component } from "react";

// import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ItemViewIcon from "./itemViewIcon";
import ItemModalFieldNav from "./itemModalFieldNav";
import { isStrongPassword } from "../lib/utils";

class LoginItemModal extends Component {
  state = { showPassword: false };
  handleClose = (e) => {
    this.props.onClose();
  };

  showPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  render() {
    let [title, username, password, url, notes, code6, path] = [
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

    const strongPassword = isStrongPassword(password);
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
      password.length && !strongPassword ? "weakPassword" : "";

    const passwordType = this.state.showPassword ? "text" : "password";

    return (
      <Modal show={this.props.show} onHide={this.handleClose} animation={false}>
        <div class="itemModalNav">
          <div className="itemModalPath">{path}</div>
          <div>
            <ItemViewIcon iconId="#f-history" opacity="1" title="History" />
            <ItemViewIcon iconId="#f-move" title="Move" />
            <ItemViewIcon iconId="#f-copy" title="Copy" />

            {/* <ItemViewIcon iconId="#f-edit" />*/}

            <div class="itemModalEditButton">
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
              <span style={{ verticalAlign: "text-bottom" }}>Edit</span>
            </div>

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
        <div className="itemModalTitle">{title}</div>
        <Modal.Body>
          <div className="itemModalField upper">
            <ItemModalFieldNav copy name="Username" />
            <div>
              <input className="lp" readonly value={username}></input>
            </div>
          </div>
          <div className={`itemModalField lower ${passwordBackground}`}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontSize: "14px" }}>
                <span style={{ opacity: "0.5" }}>Password</span>
                {password.length ? passwordStrength : ""}
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
                readonly
                value={password}
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
            <span style={{ marginLeft: "6px" }}>Show Password</span>
          </div>
          <div className="itemModalField" style={{ marginBottom: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="label">Website address</div>
              <div>
                <span className="iconTitle">Go to website</span>
                <svg width="24" height="24" fill="none" stroke="#1B1B26">
                  <use href="#f-gotowebsite"></use>
                </svg>
              </div>
            </div>
            <div>{url}</div>
          </div>
          <div className="itemModalField" style={{ marginBottom: "24px" }}>
            <ItemModalFieldNav copy name="Google Authenticator" />
            <div>123456</div>
          </div>
          <div className="itemModalField">
            <ItemModalFieldNav name="Notes" />
            <div>{notes}</div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

export default LoginItemModal;

{
  /*
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="label">Username</div>
              <div>
                <span className="iconTitle">Copy</span>
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  title="Copy"
                  style={{ opacity: "0.5" }}
                >
                  <use href="#f-copy"></use>
                </svg>
              </div>
            </div>

                <span className="colored" style={{ opacity: "1" }}>
                  <span style={{ margin: "0 .3em" }}>&#183;</span>
                  Strong
                </span>


            */
}
