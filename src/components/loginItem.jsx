import React, { Component } from "react";

import { openInExtension } from "../lib/extensionInterface";

function prepareUrl(url) {
  if (url.startsWith("www")) {
    return `<a target='_blank' href='http://${url}' rel="noreferrer noopener">${url}</a>`;
  }
  if (url.startsWith("https://") || url.startsWith("http://")) {
    return `<a target='_blank' href='${url}' rel="noreferrer noopener">${url}</a>`;
  }
  return url;
}

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

    let link_text = item.cleartext[3];
    if (link_text.startsWith("https://")) {
      link_text = link_text.substring(8);
    } else if (link_text.startsWith("http://")) {
      link_text = link_text.substring(7);
    }

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
          className="d-none d-lg-table-cell                    col-lg-4 col-xl-3 login-item-link "
          onClick={() => {
            openInExtension(this.props.item);
          }}
          style={{
            cursor: link_text.length ? "pointer" : "",
          }}
        >
          {link_text}
        </td>
        <td className="d-none d-xl-table-cell                             col-xl-3 column-modified">
          {modified}
        </td>
      </tr>
    );
  }
}

export default LoginItem;
