import React, { Component } from "react";

class ItemModalFieldNav extends Component {
  state = {};
  render() {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="label">{this.props.name}</div>
        {this.props.copy ? (
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
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default ItemModalFieldNav;
