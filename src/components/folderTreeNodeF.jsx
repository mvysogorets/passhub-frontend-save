import React from "react";

import FolderMenu from "./folderMenu";

const sharedFolderIcon = (
  <svg width="24" height="24" className="safe_pane_icon">
    <use href="#i-folder_shared"></use>
  </svg>
);

const folderIcon = (
  <svg width="24" height="24" className="safe_pane_icon">
    <use href="#i-folder"></use>
  </svg>
);

function FolderTreeNode(props) {
  const getClass = () => {
    return props.node.id === props.activeFolder.id
      ? "folder active_folder"
      : "folder";
  };

  const handleMenuCmd = (node, cmd) => {
    props.onMenuCmd(props.node, cmd);
  };

  const menuDots = (
    <FolderMenu
      node={props.node}
      onMenuCmd={handleMenuCmd}
      isSafe={props.isSafe}
    />
  );

  const icon = props.node.users > 1 ? sharedFolderIcon : folderIcon;
  const menuDotsHere = props.node.id === props.activeFolder.id ? menuDots : "";

  const padding = props.padding ? props.padding : 0;

  if ("folders" in props.node && props.node.folders.length > 0) {
    const folders = props.open
      ? props.node.folders.map((s) => (
          <FolderTreeNode
            onSelect={props.onSelect}
            key={s.id}
            node={s}
            padding={padding + 20}
            open={props.open.has(s.id) && props.open}
            onOpen={props.onOpen}
            activeFolder={props.activeFolder}
            onMenuCmd={props.onMenuCmd}
          />
        ))
      : "";
    const angleIcon = (
      <svg
        width="24"
        height="24"
        style={{
          fill: "white",
          transform: props.open ? false : "rotate(-90deg)",
        }}
        onClick={(e) => {
          // e.preventDefault();
          e.stopPropagation();
          props.onOpen(props.node);
        }}
        activeFolder={props.activeFolder}
      >
        <use href="#angle"></use>
      </svg>
    );

    return (
      <div>
        <div
          className={getClass()}
          onClick={() => props.onSelect(props.node)}
          style={{
            position: "relative",
            paddingLeft: padding + "px",
            outline: "none",
            display: "flex",
          }}
        >
          <div>
            {angleIcon}
            {icon}
          </div>
          <div
            style={{
              cursor: "default",
              flexGrow: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {props.node.name}
          </div>
          {menuDotsHere}
        </div>
        {folders}
      </div>
    );
  }

  return (
    <div
      className={getClass()}
      onClick={() => props.onSelect(props.node)}
      style={{
        position: "relative",
        overflow: "hidden",
        whiteSpace: "nowrap",
        paddingLeft: padding + 24 + "px",
        outline: "none",
        display: "flex",
      }}
    >
      <div style={{ cursor: "default" }}>{icon}</div>
      <div
        style={{
          cursor: "default",
          flexGrow: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {props.node.name}
      </div>
      {menuDotsHere}
    </div>
  );
}

export default FolderTreeNode;
