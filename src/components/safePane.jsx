import axios from "axios";
import React, { Component } from "react";
import Col from "react-bootstrap/Col";

import FolderNameModal from "./folderNameModal";
import DeleteFolderModal from "./deleteFolderModal";
import ExportFolderModal from "./exportFolderModal";
import MessageModal from "./messageModal";
import ShareModal from "./shareModal";

import FolderTreeNode from "./folderTreeNode";
import MobileSafeNode from "./mobileSafeNode";

import * as passhubCrypto from "../lib/crypto";
import { popCopyBuffer } from "../lib/copyBuffer";

class SafePane extends Component {
  state = {
    showModal: "",
    folderNameModalArgs: {},
    shareModalArgs: null,
    messageModalArgs: null,
  };

  modalKey = 1;

  handleSelect = (folder) => {
    this.props.setActiveFolder(folder);
  };

  onAccountMenuCommand(cmd) {
    if (cmd === "Export") {
      this.setState({
        showModal: "ExportFolderModal",
        exportFolderModalArgs: this.props.safes,
      });
    }
    /*
    if (cmd === "Import") {
      this.setState({
        showModal: "ImportModal",
      });
    }
    */
  }

  onFolderMenuCmd = (node, cmd) => {
    if (cmd === "delete") {
      this.modalKey++;

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

    if (cmd === "Paste") {
      this.pasteItem(node);
    }

    if (cmd === "export") {
      this.setState({
        showModal: "ExportFolderModal",
        exportFolderModalArgs: node,
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
        shareModalArgs: { folder: node, email: this.props.email },
      });
    }
  };

  moveItemFinalize(recordID, dst_safe, dst_folder, item, operation) {
    axios
      .post("move.php", {
        id: recordID,
        src_safe: 0, //state.currentSafe.id,
        dst_safe,
        dst_folder,
        item,
        operation,
      })
      .then((response) => {
        const result = response.data;
        if (result.status === "Ok") {
          this.props.refreshUserData();
          return;
        }
        if (result.status === "login") {
          window.location.href = "expired.php";
          return;
        }
        alert(result.status);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  pasteItem = (node) => {
    const clip = popCopyBuffer();
    if (clip == null) {
      return true;
    }
    const { item, operation } = clip;

    let dst_safe = node.id;
    let dstFolder = 0;
    if (node.safe) {
      dst_safe = node.safe.id;
      dstFolder = node.id;
    }
    let src_safe = item.SafeID;
    /// --->> if src == dst, do nothing

    axios
      .post("move.php", {
        id: item._id,
        src_safe,
        dst_safe,
        operation,
        checkRights: true,
      })
      .then((response) => {
        const result = response.data;
        if (result.status === "no src write") {
          this.setState({
            showModal: "NoRightsModal",
            messageModalArgs: {
              message:
                'Sorry, "Move" operation is forbidden. You have only read access to the source safe.',
            },
          });

          return;
        }
        if (result.status === "no dst write") {
          this.setState({
            showModal: "NoRightsModal",
            messageModalArgs: {
              message:
                'Sorry, "Paste" is forbidden. You have only read access to the destination safe.',
            },
          });
          return;
        }
        if (result.status === "Ok") {
          if ("file" in result.item) {
            const eItem = JSON.stringify(
              passhubCrypto.moveFile(result.item, src_safe, dst_safe)
            );
            console.log(eItem);
            return this.moveItemFinalize(
              clip.item._id,
              dst_safe,
              dstFolder,
              eItem,
              clip.operation
            );
          } else {
            let pItem;
            return passhubCrypto
              .decryptAesKey(result.src_key)
              .then((srcAesKey) => {
                return passhubCrypto.decodeItem(result.item, srcAesKey);
              })
              .then((ppItem) => {
                pItem = ppItem;
                return passhubCrypto.decryptAesKey(result.dst_key);
              })
              .then((dstAesKey) => {
                return passhubCrypto.encryptItem(pItem, dstAesKey, {
                  note: result.item.note,
                });
              })
              .then((eItem) =>
                this.moveItemFinalize(
                  item._id,
                  dst_safe,
                  dstFolder,
                  eItem,
                  operation
                )
              );
          }
        }
        if (result.status === "login") {
          window.location.href = "index.php";
          return false;
        }
        alert(result.status);
        return false;
      })
      .catch((err) => {
        /// --->>> TODO
      });
  };

  render() {
    if (!this.props.show) {
      return null;
    }
    /*
    if (this.props.activeFolder && this.props.activeFolder.safe) {
      let parentId = this.props.activeFolder.parent;
      while (parentId) {
        if (!this.state.openNodes.has(parentId)) {
          this.state.openNodes.add(parentId);
        }
        const parentNode = getFolderById(
          this.props.activeFolder.safe.folders,
          parentId
        );
        parentId = parentNode.parent;
      }

      if (!this.state.openNodes.has(this.props.activeFolder.safe.id)) {
        this.state.openNodes.add(this.props.activeFolder.safe.id);
      }
    }
*/

    return (
      <Col
        className="col-xl-3 col-lg-4 col-md-5 col-sm-6 col d-sm-block safe_pane"
        id="safe_pane"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            // marginRight: "0.3em",
          }}
        >
          {/*<div className="folder">Recent and favorities</div> */}
          <div className="folders-header">SAFES</div>
          <div className="safe_scroll_control custom-scroll d-sm-none">
            {this.props.safes.map((s) => (
              <MobileSafeNode
                key={s.id}
                node={s}
                onSelect={this.handleSelect}
              />
            ))}
          </div>

          <div className="safe_scroll_control custom-scroll d-none d-sm-block">
            {this.props.safes.map((s) => (
              <FolderTreeNode
                key={s.id}
                onSelect={this.handleSelect}
                onOpen={this.props.handleOpenFolder}
                node={s}
                open={this.props.openNodes.has(s.id) && this.props.openNodes}
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
          onClose={(refresh = false, newFolderID) => {
            this.setState({ showModal: "" });
            if (refresh === true) {
              this.props.refreshUserData(newFolderID);
            }
          }}
        ></FolderNameModal>
        <DeleteFolderModal
          show={this.state.showModal == "DeleteFolderModal"}
          folder={this.state.deleteFolderModalArgs}
          key={`deleteFolderModal${this.modalKey}`}
          onClose={(refresh = false) => {
            this.setState({ showModal: "" });
            if (refresh === true) {
              this.props.refreshUserData();
            }
          }}
        ></DeleteFolderModal>
        <ExportFolderModal
          show={this.state.showModal == "ExportFolderModal"}
          folder={this.state.exportFolderModalArgs}
          onClose={() => {
            this.setState({ showModal: "" });
          }}
        ></ExportFolderModal>
        <ShareModal
          show={this.state.showModal == "ShareModal"}
          args={this.state.shareModalArgs}
          onClose={(refresh = false) => {
            this.setState({ showModal: "" });
            if (refresh === true) {
              this.props.refreshUserData();
            }
          }}
        ></ShareModal>

        <MessageModal
          show={this.state.showModal == "NoRightsModal"}
          args={this.state.shareModalArgs}
          norights
          onClose={() => {
            this.setState({ showModal: "" });
          }}
        >
          {this.state.messageModalArgs && this.state.messageModalArgs.message}
        </MessageModal>
      </Col>
    );
  }
}

export default SafePane;

/*
        <ImportModal
          show={this.state.showModal == "ImportModal"}
          safes={this.props.safes}
          onClose={(refresh = false) => {
            this.setState({ showModal: "" });
            if (refresh === true) {
              this.props.refreshUserData();
            }
          }}
        ></ImportModal>

*/
