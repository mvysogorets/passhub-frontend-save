import React, { Component } from "react";

import { openInExtension } from "../lib/extensionInterface";

class LoginItem extends Component {
  state = {};
  showModal = () => {
    this.props.showModal(this.props.item);
  };

  render() {
    const item = this.props.item;
    const modified = new Date(item.lastModified).toLocaleString([], {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <tr>
        <td onClick={this.showModal} style={{ cursor: "pointer" }}>
          <svg width="16" height="16" className="itemIcon">
            <use href="#i-key"></use>
          </svg>
          {item.cleartext[0]}
        </td>
        <td className="d-none d-lg-table-cell">{item.cleartext[1]}</td>
        <td
          className="d-none d-lg-table-cell"
          onClick={() => {
            openInExtension(this.props.item);
          }}
          style={{ cursor: item.cleartext[3].length ? "pointer" : "" }}
        >
          {item.cleartext[3]}
        </td>
        <td className="rightAlign d-none d-xl-table-cell">{modified}</td>
      </tr>
    );
  }
}

export default LoginItem;
