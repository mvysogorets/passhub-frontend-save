import React, { Component } from "react";
import { lastModified } from "../lib/utils";

class BankCardItem extends Component {
  state = {};
  showModal = () => {
    this.props.showModal(this.props.item);
  };

  render() {
    const item = this.props.item;

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
          {item.cleartext[1]}
        </td>
        <td className="column-modified d-none d-xl-table-cell col-xl-3">
          {lastModified(item)}
        </td>
      </tr>
    );
  }
}

export default BankCardItem;
