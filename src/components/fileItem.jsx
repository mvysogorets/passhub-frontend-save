import React, { Component } from "react";

class FileItem extends Component {
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
        <td colspan="2" onClick={this.showModal}>
          {" "}
          <svg width="16" height="16" className="itemIcon">
            <use href="#i-file"></use>
          </svg>
          {item.cleartext[0]}
        </td>
        <td className="rightAlign d-none d-lg-table-cell"></td>
        <td className="rightAlign d-none d-xl-table-cell">{modified}</td>
      </tr>
    );
  }
}

export default FileItem;
