import React, { Component } from "react";

class FolderItem extends Component {
  state = {};

  onClick = () => {
    this.props.onClick(this.props.item);
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

    const angleIcon = (
      <svg
        className="d-sm-none"
        width="32"
        height="32"
        style={{
          fill: "rgba(27,27,38,0.6)",
          transform: "rotate(-90deg)",
          float: "right",
        }}
      >
        <use href="#angle"></use>
      </svg>
    );

    return (
      <tr>
        <td colspan="3" onClick={this.onClick} style={{ cursor: "pointer" }}>
          <svg width="24" height="24" className="itemIcon">
            <use href="#i-folder"></use>
          </svg>
          {item.cleartext[0]}
          {angleIcon}
        </td>
        <td className="rightAlign d-none d-xl-table-cell">{modified}</td>
      </tr>
    );
  }
}

export default FolderItem;
