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
      <tr className="d-flex" style={{ alignItems: "center" }}>
        <td
          className="col-sm-12 col-md-6 col-lg-4 col-xl-3"
          onClick={this.showModal}
          style={{ cursor: "pointer" }}
        >
          <svg width="24" height="24" className="itemIcon">
            <use href="#i-key"></use>
          </svg>
          {item.cleartext[0]}
        </td>
        <td className="d-none d-md-table-cell           col-md-6 col-lg-4 col-xl-3">
          {item.cleartext[1]}
        </td>
        <td
          className="d-none d-lg-table-cell                    col-lg-4 col-xl-3"
          onClick={() => {
            openInExtension(this.props.item);
          }}
          style={{
            cursor: item.cleartext[3].length ? "pointer" : "",
          }}
        >
          {item.cleartext[3]}
        </td>
        <td className="d-none d-xl-table-cell                             col-xl-3 column-modified">
          {modified}
        </td>
      </tr>
    );
  }
}

export default LoginItem;
