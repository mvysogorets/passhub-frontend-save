import React, { Component } from "react";

class FolderItem extends Component {
  state = {};
  render() {
    const item = this.props.item;
    const modified = new Date(item.lastModified).toLocaleString();
    return (
      <tr>
        <td colspan="3">
          <svg width="16" height="16" className="itemIcon">
            <use href="#i-folder"></use>
          </svg>
          {item.cleartext[0]}
        </td>
        <td className="rightAlign">{modified}</td>
      </tr>
    );
  }
}

export default FolderItem;
