import React, { Component } from "react";

import Col from "react-bootstrap/Col";
// import CreateSafeModal from "./createSafeModal";
import FolderNameModal from "./folderNameModal";
import DeleteFolderModal from "./deleteFolderModal";
import ShareModal from "./shareModal";

import FolderTreeNode from "./folderTreeNode";

class SafePane extends Component {
  state = {
    openNodes: new Set(),
    showModal: "",
    folderNameModalArgs: {},
    shareModalArgs: null,
  };

  handleSelect = (id) => {
    this.props.setActiveFolder(id);
  };

  handleOpen = (id) => {
    const openNodesCopy = new Set(this.state.openNodes);
    if (this.state.openNodes.has(id)) {
      openNodesCopy.delete(id);
    } else {
      openNodesCopy.add(id);
    }
    this.setState({ openNodes: openNodesCopy });
  };

  onFolderMenuCmd = (node, cmd) => {
    if (cmd === "delete") {
      this.setState({
        showModal: "DeleteFolderModal",
        deleteFolderModalArgs: node,
      });
    }

    if (cmd === "rename") {
      this.setState({
        showModal: "FolderNameModal",
        folderNameModalArgs: { folder: node },
      });
    }

    if (cmd === "Add folder") {
      this.setState({
        showModal: "FolderNameModal",
        folderNameModalArgs: { parent: node },
      });
    }
    if (cmd === "Share") {
      this.setState({
        showModal: "ShareModal",
        shareModalArgs: node,
      });
    }
  };

  render() {
    return (
      <Col className="col-xl-3 col-lg-4 col-md-5 col safe_pane">
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <div className="folder">Recent and favorities</div>
          <div
            className="folder"
            style={{
              fontSize: "14px",
              margin: "17px 0 6px 0",
              letterSpacing: "0.16em",
            }}
          >
            SAFES
          </div>
          <div className="safe_scroll_control">
            {this.props.safes.map((s) => (
              <FolderTreeNode
                key={s.id}
                onSelect={this.handleSelect}
                onOpen={this.handleOpen}
                node={s}
                open={this.state.openNodes.has(s.id) && this.state.openNodes}
                activeFolder={this.props.activeFolder}
                isSafe={true}
                onMenuCmd={this.onFolderMenuCmd}
                padding={20}
              />
            ))}
          </div>
          <div
            className="add_safe"
            onClick={() => {
              this.setState({
                folderNameModalArgs: {},
                showModal: "FolderNameModal",
              });
            }}
          >
            Add safe
          </div>
        </div>

        <FolderNameModal
          show={this.state.showModal == "FolderNameModal"}
          args={this.state.folderNameModalArgs}
          onClose={(refresh = false) => {
            this.setState({ showModal: "" });
            if (refresh === true) {
              this.props.refreshUserData();
            }
          }}
        ></FolderNameModal>

        <DeleteFolderModal
          show={this.state.showModal == "DeleteFolderModal"}
          folder={this.state.deleteFolderModalArgs}
          onClose={(refresh = false) => {
            this.setState({ showModal: "" });
            if (refresh === true) {
              this.props.refreshUserData();
            }
          }}
        ></DeleteFolderModal>
        <ShareModal
          show={this.state.showModal == "ShareModal"}
          folder={this.state.shareModalArgs}
          onClose={(refresh = false) => {
            this.setState({ showModal: "" });
            if (refresh === true) {
              this.props.refreshUserData();
            }
          }}
        ></ShareModal>
      </Col>
    );
  }
}

export default SafePane;
