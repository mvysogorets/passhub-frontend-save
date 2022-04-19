import React from "react";
import { lastModified } from "../lib/utils";

function BankCardItem(props) {
  const showModal = () => {
    props.showModal(props.item);
  };

  const item = props.item;

  const trClass = props.searchMode ? "search-mode d-flex" : "d-flex";
  return (
    <tr className={trClass} style={{ alignItems: "center" }}>
      <td
        colSpan="3"
        className="col-md-12 col-lg-8 col-xl-9"
        onClick={showModal}
        style={{ cursor: "pointer" }}
      >
        <div style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
          <svg
            width="24"
            height="24"
            className="itemIcon"
            style={{ stroke: "none", opacity: "0.5" }}
          >
            <use href="#credit_card"></use>
          </svg>
          {item.cleartext[1]}
        </div>
        {props.searchMode && (
          <div className="search-path">{item.path.join(" > ")}</div>
        )}
      </td>
      <td className="column-modified d-none d-xl-table-cell col-xl-3">
        {lastModified(item)}
      </td>
    </tr>
  );
}

export default BankCardItem;
