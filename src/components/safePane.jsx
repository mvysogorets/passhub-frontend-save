import React, { Component } from "react";
import axios from "axios";

import * as passhubCrypto from "../lib/crypto";
import Col from "react-bootstrap/Col";
// import CreateSafeModal from "./createSafeModal";
import FolderNameModal from "./folderNameModal";
import DeleteFolderModal from "./deleteFolderModal";

import FolderTreeNode from "./folderTreeNode";

class SafePane extends Component {
  state = {
    openNodes: new Set(),
    // showCreateSafeModal: false,
    showFolderNameModal: false,
    folderNameModalArgs: {},
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
        showDeleteFolderModal: true,
        deleteFolderModalArgs: node,
      });
    }

    if (cmd === "rename") {
      this.setState({
        showFolderNameModal: true,
        folderNameModalArgs: { folder: node },
      });
    }

    if (cmd === "Add folder") {
      this.setState({
        showFolderNameModal: true,
        folderNameModalArgs: { parent: node },
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
              /* this.setState({ showCreateSafeModal: true }); */
              this.setState({
                folderNameModalArgs: {},
                showFolderNameModal: true,
              });
            }}
          >
            Add safe
          </div>
        </div>

        <FolderNameModal
          show={this.state.showFolderNameModal}
          args={this.state.folderNameModalArgs}
          onClose={(refresh = false) => {
            this.setState({ showFolderNameModal: false });
            if (refresh === true) {
              this.props.refreshUserData();
            }
          }}
        ></FolderNameModal>

        <DeleteFolderModal
          show={this.state.showDeleteFolderModal}
          folder={this.state.deleteFolderModalArgs}
          onClose={(refresh = false) => {
            this.setState({ showDeleteFolderModal: false });
            if (refresh === true) {
              this.props.refreshUserData();
            }
          }}
        ></DeleteFolderModal>
      </Col>
    );
  }
}

export default SafePane;
