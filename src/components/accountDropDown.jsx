import React, { Component } from "react";
import axios from "axios";

import * as utils from "../lib/utils";

function perCent(part, all) {
  if (part == 0) {
    return 0;
  }

  let result = Math.floor((part * 100) / all);
  if (result < 2) {
    return 2;
  }
  if (result > 100) {
    return 100;
  }
  return result;
}

class AccountDropDown extends Component {
  state = { accountData: {} };
  isShown = false;

  handleButtonClick = (e) => {
    console.log("button click");
    this.props.onClose();
  };

  handleBodyClick = (e) => {
    e.stopPropagation();
    console.log("body click");
  };

  handleOuterClick = () => {
    console.log("outer click");
    this.props.onClose();
  };

  handleLogout = () => {
    window.location = "logout.php";
  };

  handleMenuCommand = (e, cmd) => {
    e.stopPropagation();
    this.props.onClose();
    this.props.onMenuCommand(cmd);
  };

  onUpgrade = () => {
    this.props.onClose();
    this.props.onMenuCommand("upgrade");
  };

  getAccountData = () => {
    const self = this;
    axios
      .post("account.php", {
        verifier: document.getElementById("csrf").getAttribute("data-csrf"),
      })
      .then((reply) => {
        const result = reply.data;
        if (result.status === "Ok") {
          self.setState({ accountData: result });
          return;
        }
        if (result.status === "login") {
          window.location.href = "expired.php";
          return;
        }
      });
  };

  componentDidMount = () => {
    this.getAccountData();
    console.log("account mounted");
  };

  componentDidUpdate = () => {
    console.log("account updated");
  };

  componentWillUnmount = () => {
    console.log("account will unmount");
  };

  render() {
    if (this.props.show) {
      if (!this.isShown) {
        this.isShown = true;
        this.getAccountData();
      }
    } else {
      this.isShown = false;
      return null;
    }

    console.log(this.state);

    const modalClasses = this.props.show ? "pmodal" : "pmodal d-none";
    const storage = (
      <b>
        {utils.humanReadableFileSize(
          this.state.accountData.used ? this.state.accountData.used : 0
        )}
      </b>
    );
    const records = (
      <b>
        {this.state.accountData.records ? this.state.accountData.records : 0}
      </b>
    );

    return (
      <div className={modalClasses} onClick={this.handleOuterClick}>
        <div
          className="pmodal-body account"
          onClick={this.handleBodyClick}
          style={{ right: this.props.right }}
        >
          <div style={{ marginBottom: "16px" }}>
            {this.state.accountData.email && (
              <div>{this.state.accountData.email}</div>
            )}
            {this.state.accountData.upgrade_button && (
              <div
                style={{
                  fontSize: "13px",
                  lineHeight: "24px",
                  color: "#979797",
                }}
              >
                Free acount{" "}
                <a className="link" href="#">
                  Upgrade
                </a>
              </div>
            )}
          </div>

          {this.state.accountData.maxRecords ? (
            <div style={{ marginBottom: "18px" }}>
              {records} of {this.state.accountData.maxRecords} records
              <div
                style={{
                  height: "4px",
                  background: "#E7E7EE",
                  borderRadius: "4px",
                }}
              >
                <div
                  style={{
                    height: "4px",
                    width: `${perCent(
                      this.state.accountData.records,
                      this.state.accountData.maxRecords
                    )}%`,
                    background: "#00BC62",
                    borderRadius: "4px",
                  }}
                ></div>
              </div>
            </div>
          ) : (
            <div style={{ marginBottom: "18px" }}>{records} records</div>
          )}

          {this.state.accountData.maxStorage ? (
            <div style={{ marginBottom: "24px" }}>
              {storage} of{" "}
              {utils.humanReadableFileSize(this.state.accountData.maxStorage)}
              <div
                style={{
                  height: "4px",
                  background: "#E7E7EE",
                  borderRadius: "4px",
                }}
              >
                <div
                  style={{
                    height: "4px",
                    width: `${perCent(
                      this.state.accountData.used,
                      this.state.accountData.maxStorage
                    )}%`,
                    background: "#00BC62",
                    borderRadius: "4px",
                  }}
                ></div>
              </div>
            </div>
          ) : (
            <div style={{ marginBottom: "24px" }}>{storage}</div>
          )}

          {this.state.accountData.upgrade_button && (
            <div>
              <button
                className="btn btn-primary"
                style={{ width: "100%", marginBottom: "14px" }}
                onCLick={this.onUpgrade}
              >
                Get more
              </button>
            </div>
          )}

          <div
            className="account-menu-item"
            onClick={(e) => this.handleMenuCommand(e, "Account settings")}
          >
            <svg width="24" height="24">
              <use href="#f-nut"></use>
            </svg>
            Account settings
          </div>

          <div
            className="account-menu-item"
            onClick={(e) => this.handleMenuCommand(e, "Help")}
          >
            <svg width="24" height="24">
              <use href="#f-lightbulb"></use>
            </svg>
            How it works (Help)
          </div>

          <div
            className="account-menu-item"
            onClick={(e) => this.handleMenuCommand(e, "Export")}
          >
            <svg width="24" height="24">
              <use href="#f-upload"></use>
            </svg>
            Export
          </div>
          <div
            className="account-menu-item"
            onClick={(e) => this.handleMenuCommand(e, "Import")}
          >
            <svg width="24" height="24">
              <use href="#f-download"></use>
            </svg>
            Import
          </div>
          <div
            className="account-menu-item"
            onClick={(e) => this.handleMenuCommand(e, "Contact us")}
          >
            <svg width="24" height="24">
              <use href="#f-chatCircleText"></use>
            </svg>
            Contact us
          </div>
          <div
            className="account-menu-item"
            style={{
              color: "#B40020",
            }}
            onClick={this.handleLogout}
          >
            <svg width="24" height="24">
              <use href="#f-signout"></use>
            </svg>
            Log out
          </div>
        </div>
      </div>
    );
  }
}

export default AccountDropDown;
