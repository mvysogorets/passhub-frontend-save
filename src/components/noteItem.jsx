import React, { Component } from "react";

class NoteItem extends Component {
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
          colspan="3"
          className="col-md-12 col-lg-8 col-xl-9"
          onClick={this.showModal}
          style={{ cursor: "pointer" }}
        >
          <svg width="24" height="24" className="itemIcon">
            <use href="#i-note"></use>
          </svg>
          {item.cleartext[0]}
        </td>
        <td className="column-modified d-none d-xl-table-cell col-xl-3">
          {modified}
        </td>
      </tr>
    );
  }
}

export default NoteItem;
