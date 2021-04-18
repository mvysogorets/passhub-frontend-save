import React, { Component } from "react";

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

const menuDots1 = (
  <div className="menu-dots safe-menu">
    <svg width="24" height="24" style={iconStyle}>
      <use href="#el-dots"></use>
    </svg>
  </div>
);

const menuDots = (
  <div className="menu-dots safe-menu">
    <svg width="24" height="24" style={iconStyle}>
      <use href="#angle"></use>
    </svg>
    <svg width="24" height="24" style={iconStyle}>
      <use href="#angle1"></use>
    </svg>
  </div>
);

class FolderTreeNode extends Component {
  leafStyle = {
    position: "relative",
    overflow: "hidden",
    whiteSpace: "nowrap",
    marginLeft: "37px",
    outline: "none",
  };

  detailsStyle = {
    position: "relative",
    paddingLeft: "20px",
    outline: "none",
  };

  summaryStyle = {
    overflow: "hidden",
    whiteSpace: "nowrap",
    outline: "none",
  };

  getClass = () => {
    return this.props.node.isCurrent ? "selectedFolder" : "";
  };

  render() {
    console.log("props", this.props);
    const icon = this.props.node.isSharedSafe ? sharedFolderIcon : folderIcon;

    const menuDotsHere = this.props.node.isCurrent ? menuDots : "";

    if ("children" in this.props.node && this.props.node.children.length > 0) {
      return (
        <details style={this.detailsStyle}>
          <summary
            className={this.getClass()}
            onClick={() => this.props.onSelect(this.props.node.id)}
            style={this.summaryStyle}
          >
            {icon}
            {this.props.node.name}
            {menuDotsHere}
          </summary>
          {this.props.node.children.map((c) => (
            <FolderTreeNode
              onSelect={this.props.onSelect}
              key={c.id}
              node={c}
            />
          ))}
        </details>
      );
    }

    console.log(this);
    return (
      <div
        className={this.getClass()}
        onClick={() => this.props.onSelect(this.props.node.id)}
        style={this.leafStyle}
      >
        {icon}
        {this.props.node.name}
        {menuDotsHere}
      </div>
    );
  }
}

export default FolderTreeNode;
