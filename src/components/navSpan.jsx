import React, { Component } from "react";
import AccountDropDown from "./accountDropDown";

class NavSpan extends Component {
  state = { showAccount: false };
  searchClear = () => {
    this.props.onSearchChange("");
  };

  onSearchChange = (e) => {
    this.props.onSearchChange(e.target.value);
  };

  right = 0;

  handleToggleAccount = (e) => {
    e.stopPropagation();
    if (!this.state.showAccount) {
      this.right =
        document.body.getBoundingClientRect().right -
        e.currentTarget.parentElement.getBoundingClientRect().right -
        27;
      if (this.right <= 16) {
        this.right = 16;
      }
    }
    this.setState({ showAccount: !this.state.showAccount });
  };

  handleHideAccont = () => {
    this.setState({ showAccount: false });
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
          onClick={this.handleToggleAccount}
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
          onClick={this.handleToggleAccount}
          style={{ padding: "8px 16px 0 0" }}
        >
          <svg width="24" height="24" fill="white">
            <use href="#angle"></use>
          </svg>
        </span>
        <AccountDropDown
          show={this.state.showAccount}
          right={this.right}
          onClose={this.handleHideAccont}
          onMenuCommand={this.props.onMenuCommand}
        />
      </React.Fragment>
    );
  }
}

export default NavSpan;
