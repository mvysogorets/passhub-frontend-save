import React, { Component } from "react";
import AccountDropDown from "./accountDropDown";
import ContactUsModal from "./contactUsModal";
import SuccessModal from "./successModal";
import UpgradeModal from "./upgradeModal";

class NavSpan extends Component {
  state = { showModal: "" };
  searchClear = () => {
    this.props.onSearchChange("");
  };

  onSearchChange = (e) => {
    this.props.onSearchChange(e.target.value);
  };

  right = 0;
  /*
  handleToggleAccount = (e) => {
    e.stopPropagation();
    if (this.state.showModal != "AccountDropDown") {
      this.right =
        document.body.getBoundingClientRect().right -
        e.currentTarget.parentElement.getBoundingClientRect().right -
        27;
      if (this.right <= 16) {
        this.right = 16;
      }
      this.setState({ showModal: "AccountDropDown" });
    } else {
      this.setState({ showModal: "" });
    }
  };
*/

  showAccountDropDown = (e) => {
    e.stopPropagation();
    this.right =
      document.body.getBoundingClientRect().right -
      e.currentTarget.parentElement.getBoundingClientRect().right -
      27;
    if (this.right <= 16) {
      this.right = 16;
    }
    this.setState({ showModal: "AccountDropDown" });
  };

  handleMenuCommand = (cmd) => {
    if (cmd === "Contact us") {
      this.setState({ showModal: "Contact us" });
      return;
    }
    if (cmd === "Account settings") {
      this.setState({ showModal: "upgrade" });
      return;
    }

    this.props.onMenuCommand(cmd);
  };

  render() {
    return (
      <React.Fragment>
        <div
          style={{
            flexGrow: 1,
            padding: "0 36px 0 40px",
            position: "relative",
          }}
        >
          <input
            className="search_string"
            type="text"
            placeholder="Search.."
            autoComplete="off"
            onChange={this.onSearchChange}
            value={this.props.searchString}
            style={{
              width: "100%",
              background: "rgba(255, 255, 255, 0.6)",
              backdropFilter: "blur(40px)",
            }}
          />

          <span className="search_clear" onClick={this.searchClear}>
            <svg width="0.7em" height="0.7em" className="item_icon">
              <use href="#cross"></use>
            </svg>
          </span>
          <span style={{ position: "absolute", left: "55px", top: "8px" }}>
            <svg
              width="24"
              height="24"
              style={{
                opacity: 0.4,
                verticalAlign: "text-bottom",
              }}
            >
              <use href="#f-search"></use>
            </svg>
          </span>

          <input id="fake_username" type="text" />
          <input id="fake_password" type="password" />
        </div>

        <span
          onClick={this.showAccountDropDown}
          style={{
            width: "40px",
            height: "40px",
            padding: "7px 0 0 0",
            borderRadius: "12px",
            background: "rgba(255, 255, 255, 0.6)",
            backdropFilter: "blur(40px)",
            overflow: "hidden",
          }}
        >
          <svg width="40" height="34" style={{ opacity: 0.8 }}>
            <use href="#f-account"></use>
          </svg>
        </span>
        <span
          onClick={this.showAccountDropDown}
          style={{ padding: "8px 16px 0 0" }}
        >
          <svg width="24" height="24" fill="white">
            <use href="#angle"></use>
          </svg>
        </span>
        <AccountDropDown
          show={this.state.showModal == "AccountDropDown"}
          right={this.right}
          onClose={() => this.setState({ showModal: "" })}
          onMenuCommand={this.handleMenuCommand}
        />
        <ContactUsModal
          show={this.state.showModal == "Contact us"}
          onClose={(dummy, success) => {
            this.setState({ showModal: success ? "success" : "" });
          }}
        ></ContactUsModal>
        <SuccessModal
          show={this.state.showModal == "success"}
          onClose={() => {
            this.setState({ showModal: "" });
          }}
        ></SuccessModal>
        <UpgradeModal
          show={this.state.showModal == "upgrade"}
          onClose={() => {
            this.setState({ showModal: "" });
          }}
        ></UpgradeModal>
      </React.Fragment>
    );
  }
}

export default NavSpan;
