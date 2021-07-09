import React, { Component } from "react";

class ItemViewIcon extends Component {
  render() {
    return (
      <span
        title={this.props.title}
        style={{ margin: "0 10px" }}
        onClick={this.props.onClick}
      >
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="#1B1B26"
          style={{
            opacity: this.props.opacity ? this.props.opacity : "0.5",
            verticalAlign: "unset",
          }}
        >
          <use href={this.props.iconId}></use>
        </svg>
      </span>
    );
  }
}

export default ItemViewIcon;
