import React from "react";

import { openInExtension } from "../lib/extensionInterface";
import { lastModified } from "../lib/utils";

/*
function prepareUrl(url) {
  if (url.startsWith("www")) {
    return `<a target='_blank' href='http://${url}' rel="noreferrer noopener">${url}</a>`;
  }
  if (url.startsWith("https://") || url.startsWith("http://")) {
    return `<a target='_blank' href='${url}' rel="noreferrer noopener">${url}</a>`;
  }
  return url;
}
*/

function PasswordItem(props) {
  const showModal = () => {
    props.showModal(props.item);
  };

  const item = props.item;

  let link_text = item.cleartext[3];
  if (link_text.startsWith("https://")) {
    link_text = link_text.substring(8);
  } else if (link_text.startsWith("http://")) {
    link_text = link_text.substring(7);
  }

  let trClass = props.searchMode ? "search-mode d-flex" : "d-flex";

  return (
    <tr className={trClass} style={{ alignItems: "center" }}>
      <td
        className="col-sm-12 col-md-6 col-lg-4 col-xl-3"
        onClick={showModal}
        style={{ cursor: "pointer" }}
      >
        <div style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
          <svg width="24" height="24" className="itemIcon">
            <use href="#i-key"></use>
          </svg>
          {item.cleartext[0]}
        </div>
        {props.searchMode && (
          <div className="search-path">{item.path.join(" > ")}</div>
        )}
      </td>
      <td className="d-none d-md-table-cell           col-md-6 col-lg-4 col-xl-3">
        {item.cleartext[1]}
      </td>
      <td
        className="d-none d-lg-table-cell                    col-lg-4 col-xl-3 login-item-link "
        onClick={() => {
          openInExtension(props.item);
        }}
        style={{
          cursor: link_text.length ? "pointer" : "",
        }}
      >
        {link_text}
      </td>
      <td className="d-none d-xl-table-cell                             col-xl-3 column-modified">
        {lastModified(item)}
      </td>
    </tr>
  );
}

export default PasswordItem;