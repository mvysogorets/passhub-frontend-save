import React, { Component } from "react";
import NavIcon from "./navIcon";

class NavSpan extends Component {
  state = {};
  render() {
    return (
      <span style={{ float: "right" }}>
        <span
          className="d-none d-md-inline-block main-page"
          style={{ marginRight: "20px" }}
        >
          <input
            id="search_string"
            className="main-page"
            type="text"
            placeholder="Search.."
            autoComplete="off"
          />
          <span className="search_clear">
            <svg width="0.7em" height="0.7em" className="item_icon main-page">
              <use href="#cross"></use>
            </svg>
          </span>
        </span>
        <input id="fake_username" type="text" />
        <input id="fake_password" type="password" />
        <NavIcon href="help.php" title="Help" icon="#i-help" />
        <NavIcon href="feedback.php" title="Contact Us" icon="#i-contact" />
        <NavIcon title="My Account" icon="#account" />
      </span>
    );
  }
}

export default NavSpan;
