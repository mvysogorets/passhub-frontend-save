import React, { Component } from "react";

class FileItem extends Component {
  state = {};
  showModal = () => {
    this.props.showModal(this.props.item);
  };

  render() {
    const item = this.props.item;
    const modified = new Date(item.lastModified).toLocaleString();
    return (
      <tr>
        <td colspan="2" onClick={this.showModal}>
          {" "}
          <svg width="16" height="16" className="itemIcon">
            <use href="#i-file"></use>
          </svg>
          {item.cleartext[0]}
        </td>
        <td className="rightAlign">1.35 KBytes</td>
        <td className="rightAlign">{modified}</td>
      </tr>
    );
  }
}

export default FileItem;
