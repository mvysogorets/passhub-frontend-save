import React from "react";
import { humanReadableFileSize, lastModified } from "../lib/utils";

function FileItem(props) {
  const showModal = () => {
    props.showModal(props.item);
  };

  const item = props.item;
  return (
    <tr className="d-flex" style={{ alignItems: "center" }}>
      <td
        colSpan="2"
        className="col-md-12 col-lg-8 col-xl-6"
        onClick={showModal}
        style={{ cursor: "pointer" }}
      >
        <div style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
          <svg width="24" height="24" className="itemIcon">
            <use href="#i-file"></use>
          </svg>
          {item.cleartext[0]}
        </div>
        {props.searchMode && (
          <div className="search-path">{item.path.join(" > ")}</div>
        )}
      </td>
      <td className="rightAlign d-none d-lg-table-cell col-lg-4 col-xl-3">
        {humanReadableFileSize(item.file.size)}
      </td>
      <td className="column-modified d-none d-xl-table-cell col-xl-3">
        {lastModified(item)}
      </td>
    </tr>
  );
}

export default FileItem;
