import React, { Component } from "react";
import NavIcon from "./navIcon";

class NavSpan extends Component {
  state = { searchString: "" };
  searchClear = () => {
    this.setState({ searchString: "" });
  };

  onSearchChange = (e) => this.setState({ searchString: e.target.value });

  render() {
    return (
      <span style={{ float: "right" }}>
        <span
          className="d-none d-md-inline-block"
          style={{ marginRight: "20px" }}
        >
          <span>
            <svg
              width="24"
              height="24"
              style={{
                marginRight: "-32px",
                opacity: 0.3,
                verticalAlign: "text-bottom",
              }}
            >
              <use href="#f-search"></use>
            </svg>
          </span>
          <input
            className="search_string"
            type="text"
            placeholder="Search.."
            autoComplete="off"
            onChange={this.onSearchChange}
            value={this.state.searchString}
          />
          <span className="search_clear" onClick={this.searchClear}>
            <svg width="0.7em" height="0.7em" className="item_icon">
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
