import React, { Component } from "react";

import axios from "axios";

import * as base32 from "hi-base32";

import * as passhubCrypto from "../lib/crypto";
import { isStrongPassword } from "../lib/utils";
import { openInExtension } from "../lib/extensionInterface";
import getTOTP from "../lib/totp";
import copyToClipboard from "../lib/copyToClipboard";

import ItemModalFieldNav from "./itemModalFieldNav";

import ItemModal from "./itemModal";

function drawTotpCircle() {
  const sec = new Date().getTime() / 1000;
  const fract = Math.ceil(((sec % 30) * 10) / 3);
  document.querySelectorAll(".totp_circle").forEach((e) => {
    //    e.style.background = `conic-gradient(#c4c4c4 ${fract}%, #e7e7ee 0)`;
    e.style.background = `conic-gradient(#1b1b26 ${fract}%, rgba(27, 27, 38, 0.1) 0)`;
  });
  if (Math.floor(sec % 30) == 0) {
    totpTimerListeners.forEach((f) => f());
  }
}

// const copiedTimer = null;

function startCopiedTimer() {
  setTimeout(() => {
    document
      .querySelectorAll(".copied")
      .forEach((e) => (e.style.display = "none"));
  }, 1000);
}

setInterval(drawTotpCircle, 1000);
let totpTimerListeners = [];

function totpTimerAddListener(f) {
  totpTimerListeners.push(f);
}

function totpTimerRemoveListener(f) {
  totpTimerListeners = totpTimerListeners.filter((e) => e !== f);
}

class LoginModal extends Component {
  state = {
    edit: false,
    showPassword: false,
    username: "",
    password: "",
    url: "",
    forceTotp: false,
    totpSecret: "",
  };

  timerEvent = () => {
    this.showOTP();
  };

  componentDidMount = () => {
    totpTimerAddListener(this.timerEvent);
  };

  componentWillUnmount = () => {
    totpTimerRemoveListener(this.timerEvent);
  };

  isShown = false;

  showPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  onEdit = () => {
    this.setState({ edit: true, forceTotp: false });
  };

  onUsernameChange = (e) => this.setState({ username: e.target.value });

  onPasswordChange = (e) => this.setState({ password: e.target.value });
  onTotpSecretChange = (e) =>
    this.setState({ totpSecret: e.target.value.toUpperCase() });

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
    const totpSecret = this.state.totpSecret
      .replace(/-/g, "")
      .replace(/ /g, "");

    if (totpSecret.length > 0) {
      pData.push(totpSecret);
    }

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

  showOTP = () => {
    if (
      this.props.edit ||
      !this.props.show ||
      !this.props.args.item ||
      this.props.args.item.cleartext.length < 6
    ) {
      return;
    }

    const secret = this.props.args.item.cleartext[5];
    if (secret.length > 0) {
      const s = secret.replace(/\s/g, "").toUpperCase();
      try {
        const secretBytes = new Uint8Array(base32.decode.asBytes(s));

        window.crypto.subtle
          .importKey(
            "raw",
            secretBytes,
            { name: "HMAC", hash: { name: "SHA-1" } },
            false,
            ["sign"]
          )
          .then((key) => getTOTP(key))
          .then((six) => {
            document
              .querySelectorAll(".totp_digits")
              .forEach((e) => (e.innerText = six));
          });
      } catch (err) {
        document
          .querySelectorAll(".totp_digits")
          .forEach((e) => (e.innerText = "invalid TOTP secret"));
      }
    }
  };

  copyToClipboard = (text) => {
    if (!this.state.edit) {
      copyToClipboard(text);
    }
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
          this.state.totpSecret =
            this.props.args.item.cleartext.length > 5
              ? this.props.args.item.cleartext[5].toUpperCase()
              : "";
        } else {
          this.state.username = "";
          this.state.password = "";
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

    if (
      this.props.args.item &&
      this.props.args.item.cleartext[5] &&
      !this.state.edit
    ) {
      this.showOTP();
    }

    let totp = "";

    if (!this.state.edit) {
      if (this.props.args.item && this.props.args.item.cleartext.length > 5) {
        totp = (
          <div
            className="itemModalField"
            style={{ marginBottom: 32, position: "relative" }}
            onClick={() => {
              this.copyToClipboard(
                document.querySelector(".totp_digits").innerText
              );
              document.querySelector("#totp_copied").style.display = "flex";
              startCopiedTimer();
            }}
          >
            <ItemModalFieldNav
              copy={!this.state.edit}
              name="Google authenticator"
            />
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className="totp_circle"></div>
              <div className="totp_digits"></div>
            </div>
            <div className="copied green70" id="totp_copied">
              <div style={{ margin: "0 auto" }}>Copied &#10003;</div>
            </div>
          </div>
        );
      }
    } else {
      if (
        (this.props.args.item && this.props.args.item.cleartext.length > 5) ||
        this.state.forceTotp
      ) {
        totp = (
          <div
            className="itemModalField"
            style={{ marginBottom: 32 }}
            onClick={() => {
              if (!this.state.edit) {
                this.copyToClipboard(
                  document.querySelector(".totp_digits").innerText
                );
              }
            }}
          >
            {this.state.totpSecret.length > 0 ? (
              <ItemModalFieldNav
                copy={!this.state.edit}
                name="Google authenticator secret"
              />
            ) : (
              ""
            )}
            <input
              onChange={this.onTotpSecretChange}
              spellCheck={false}
              value={this.state.totpSecret}
              placeholder="Google authenticator secret"
            ></input>
          </div>
        );
      } else {
        totp = (
          <div
            className="itemModalPlusField"
            onClick={() => this.setState({ forceTotp: true })}
          >
            <svg width="24" height="24" fill="none">
              <use href="#f-add"></use>
            </svg>
            Add Google Authenticator
          </div>
        );
      }
    }

    return (
      <ItemModal
        show={this.props.show}
        args={this.props.args}
        onClose={this.props.onClose}
        onEdit={this.onEdit}
        onSubmit={this.onSubmit}
      >
        <div
          className="itemModalField upper"
          style={{ position: "relative" }}
          onClick={() => {
            if (!this.state.edit) {
              this.copyToClipboard(this.state.username);
              document.querySelector("#username_copied").style.display = "flex";
              startCopiedTimer();
            }
          }}
        >
          <ItemModalFieldNav copy={!this.state.edit} name="Username" />
          <div>
            <input
              className="lp"
              onChange={this.onUsernameChange}
              readOnly={!this.state.edit}
              spellCheck={false}
              value={this.state.username}
            ></input>
          </div>
          <div className="copied" id="username_copied">
            <div>Copied &#10003;</div>
          </div>
        </div>
        <div
          className={`itemModalField lower ${passwordBackground}`}
          style={{ position: "relative" }}
          onClick={() => {
            if (!this.state.edit) {
              this.copyToClipboard(this.state.password);
              document.querySelector("#password_copied").style.display = "flex";
              startCopiedTimer();
            }
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontSize: "14px" }}>
              <span style={{ opacity: "0.5" }}>Password</span>
              {this.state.password.length ? passwordStrength : ""}
            </div>
            {!this.state.edit && (
              <div>
                <span className="iconTitle">Copy</span>
                <svg width="24" height="24" fill="none">
                  <use href="#f-copy"></use>
                </svg>
              </div>
            )}
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
          <div className="copied green70" id="password_copied">
            <div style={{ margin: "0 auto" }}>Copied &#10003;</div>
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
          <ItemModalFieldNav
            gotowebsite={!this.state.edit}
            name="Website Address"
          />
          <div>
            {this.state.edit ? (
              <input
                onChange={this.onUrlChange}
                spellCheck={false}
                value={this.state.url}
              ></input>
            ) : (
              <a
                href={this.state.url}
                noreferrer
                noopener
                target="_blank"
                style={{ color: "#1b1b26" }}
              >
                {this.state.url}
              </a>
            )}
          </div>
        </div>
        {totp}
      </ItemModal>
    );
  }
}

export default LoginModal;
