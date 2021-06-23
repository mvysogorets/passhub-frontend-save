import React, { Component } from "react";

import { contextMenu, Menu, Item, Separator, Submenu } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";

const iconStyle = {
  stroke: "white",
  opacity: "0.7",
  verticalAlign: "middle",
  marginRight: "10px",
};

const sharedFolderIcon = (
  <svg width="24" height="24" style={iconStyle}>
    <use href="#i-folder_shared"></use>
  </svg>
);

const folderIcon = (
  <svg width="24" height="24" style={iconStyle}>
    <use href="#i-folder"></use>
  </svg>
);

const SAFE_MENU_ID = "safe-menu-id";
const FOLDER_MENU_ID = "folder-menu-id";

class FolderTreeNode extends Component {
  getClass = () => {
    return this.props.node.id === this.props.activeFolder
      ? "folder active_folder"
      : "folder";
  };

  handleItemClick = (cmd) => {
    this.props.onMenuCmd(this.props.node, cmd);
    console.log(cmd);
  };

  folderMenu = (
    <Menu id={FOLDER_MENU_ID}>
      <Item
        onClick={() => {
          this.handleItemClick("rename");
        }}
      >
        Rename
      </Item>
      <Item
        onClick={() => {
          this.handleItemClick("Add folder");
        }}
      >
        Add folder
      </Item>
      <Item disabled>Paste</Item>
      <Item
        onClick={() => {
          this.handleItemClick("export");
        }}
      >
        Export
      </Item>
      <Item
        onClick={() => {
          this.handleItemClick("delete");
        }}
      >
        Delete
      </Item>
    </Menu>
  );

  safeMenu = (
    <Menu id={SAFE_MENU_ID}>
      <Item
        onClick={() => {
          this.handleItemClick("share");
        }}
      >
        Share
      </Item>
      <Item
        onClick={() => {
          this.handleItemClick("users");
        }}
      >
        Users
      </Item>
      <Item
        onClick={() => {
          this.handleItemClick("rename");
        }}
      >
        Rename
      </Item>
      <Item
        onClick={() => {
          this.handleItemClick("Add folder");
        }}
      >
        Add folder
      </Item>

      <Item disabled>Paste</Item>
      <Item
        onClick={() => {
          this.handleItemClick("export");
        }}
      >
        Export
      </Item>
      <Item
        onClick={() => {
          this.handleItemClick("delete");
        }}
      >
        Delete
      </Item>
    </Menu>
  );

  showSafeMenu = (e) => {
    // e.preventDefault();
    contextMenu.show({ id: SAFE_MENU_ID, event: e });
  };

  showFolderMenu = (e) => {
    // e.preventDefault();
    contextMenu.show({ id: FOLDER_MENU_ID, event: e });
  };

  menuDots = (
    <div
      className="menu-dots"
      onClick={this.props.isSafe ? this.showSafeMenu : this.showFolderMenu}
    >
      <svg width="24" height="24" style={iconStyle}>
        <use href="#el-dots"></use>
      </svg>
    </div>
  );

  componentDidMount() {
    console.log("treeNode mounted");
  }

  render() {
    const icon = this.props.node.users > 1 ? sharedFolderIcon : folderIcon;
    const menuDotsHere =
      this.props.node.id === this.props.activeFolder ? this.menuDots : "";

    const menu = this.props.isSafe ? this.safeMenu : this.folderMenu;
    const padding = this.props.padding ? this.props.padding : 0;
    if ("folders" in this.props.node && this.props.node.folders.length > 0) {
      const folders = this.props.open
        ? this.props.node.folders.map((s) => (
            <FolderTreeNode
              onSelect={this.props.onSelect}
              key={s.id}
              node={s}
              padding={padding + 20}
              open={this.props.open.has(s.id) && this.props.open}
              onOpen={this.props.onOpen}
              activeFolder={this.props.activeFolder}
              onMenuCmd={this.props.onMenuCmd}
            />
          ))
        : "";
      const angleIcon = (
        <svg
          width="24"
          height="24"
          style={{
            fill: "white",
            transform: this.props.open ? false : "rotate(-90deg)",
          }}
          onClick={(e) => {
            // e.preventDefault();
            e.stopPropagation();
            this.props.onOpen(this.props.node.id);
          }}
          activeFolder={this.props.activeFolder}
        >
          <use href="#angle"></use>
        </svg>
      );

      return (
        <div>
          <div
            className={this.getClass()}
            onClick={() => this.props.onSelect(this.props.node.id)}
            style={{
              position: "relative",
              paddingLeft: padding + "px",
              outline: "none",
            }}
          >
            {angleIcon}
            {menu}
            {icon}
            {this.props.node.name}
            {menuDotsHere}
          </div>
          {folders}
        </div>
      );
    }

    return (
      <div
        className={this.getClass()}
        onClick={() => this.props.onSelect(this.props.node.id)}
        style={{
          position: "relative",
          overflow: "hidden",
          whiteSpace: "nowrap",
          paddingLeft: padding + 24 + "px",
          outline: "none",
        }}
      >
        {menu}
        {icon}
        {this.props.node.name}
        {menuDotsHere}
      </div>
    );
  }
}

export default FolderTreeNode;
