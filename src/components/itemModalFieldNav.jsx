import React, { Component } from "react";

class ItemModalFieldNav extends Component {
  state = {};

  render() {
    let clickAction = null;
    if (this.props.copy) {
      clickAction = (
        <div>
          <span className="iconTitle">Copy</span>
          <svg width="24" height="24" fill="none" title="Copy">
            <use href="#f-copy"></use>
          </svg>
        </div>
      );
    } else if (this.props.gotowebsite) {
      clickAction = (
        <div>
          <span className="iconTitle">Go to website</span>
          <svg
            className="gotowebsite"
            width="24"
            height="24"
            title="Go to website"
            style={{ opacity: "0.5", stroke: "black", fill: "none" }}
          >
            <use href="#f-gotowebsite"></use>
          </svg>
        </div>
      );
    }

    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="label">{this.props.name}</div>
        {clickAction}
      </div>
    );
  }
}

export default ItemModalFieldNav;
