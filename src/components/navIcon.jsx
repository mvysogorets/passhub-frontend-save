import React, { Component } from "react";

class NavIcon extends Component {
  state = {};
  render() {
    return (
      <a href={this.props.href} title={this.props.title}>
        <svg className="top_icon" width="24" height="24">
          <use href={this.props.icon}></use>
        </svg>
      </a>
    );
  }
}

export default NavIcon;
