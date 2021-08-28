import axios from "axios";
import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ModalCross from "./modalCross";

class DeleteFolderModal extends Component {
  state = {
    phase: "initial",
  };
  stats = {};

  onClose = (refresh = false) => {
    this.setState({ phase: "initial" });
    if (this.state.phase === "safeDeleted") {
      this.props.onClose(true);
      return;
    }
    this.props.onClose(false);
  };

  onSubmit = () => {
    if (this.state.phase === "safeDeleted") {
      this.onClose(true);
      return;
    }
    const operation =
      this.state.phase === "notEmptyFolderWarning"
        ? "delete_not_empty"
        : "delete";

    const verifier = document.getElementById("csrf").getAttribute("data-csrf");

    let uri = "delete_safe.php";
    let args = {
      operation,
      verifier,
      SafeID: this.props.folder.id,
    };

    if (this.props.folder.path.length > 1) {
      // folder
      uri = "folder_ops.php";
      args = {
        operation,
        verifier,
        SafeID: this.props.folder.SafeID,
        folderID: this.props.folder.id,
      };
    }

    axios
      .post(uri, args)
      .then((reply) => {
        const result = reply.data;
        if (result.status === "Ok") {
          if (result.hasOwnProperty("items")) {
            this.stats = result;
            this.setState({ phase: "safeDeleted" });
            return;
          }
          this.props.onClose(true);
          return;
        }

        if (result.status === "not empty") {
          this.setState({ phase: "notEmptyFolderWarning" });
          return;
        }
        if (result.status === "unsubscribe") {
          this.setState({ phase: "unsubscribe" });
          return;
        }

        if (result.status === "login") {
          window.location.href = "expired.php";
          return;
        }
      })
      .catch((err) => {});
  };

  render() {
    let folderType = "";
    let folderName = "";

    if (this.props.show) {
      folderName = this.props.folder.path[this.props.folder.path.length - 1];
      const isSafe = this.props.folder.path.length < 2;
      folderType = isSafe ? "Safe" : "Folder";
    }
    const showSecondary = this.state.phase !== "safeDeleted";

    return (
      <Modal
        show={this.props.show}
        onHide={this.onClose}
        onEnter={this.onEnter}
        animation={false}
        centered
      >
        <ModalCross onClose={this.props.onClose}></ModalCross>
        <div className="modalTitle">
          <div className="h2">Delete {folderType}</div>
        </div>

        <Modal.Body>
          {this.state.phase === "initial" && (
            <p>
              Do you really want to delete{" "}
              <span style={{ fontSize: "larger", fontWeight: "bold" }}>
                {folderName}
              </span>{" "}
              ?
            </p>
          )}
          {this.state.phase === "notEmptyFolderWarning" && (
            <p>
              The {folderType}{" "}
              <span style={{ fontSize: "larger", fontWeight: "bold" }}>
                {folderName}
              </span>{" "}
              is not empty. Do you want to delete it with all its items and
              subfolders?
            </p>
          )}
          {this.state.phase === "unsubscribe" && (
            <div>
              <p>You are not the safe owner, you cannot delete the safe.</p>
              <p>
                Still you can cancel your membership by clicking 'unsubscribe'
                button
              </p>
            </div>
          )}
          {this.state.phase === "safeDeleted" && (
            <div>
              Deleted folders: {this.stats.folders} items: {this.stats.items}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {showSecondary && (
            <Button variant="outline-secondary" onClick={this.onClose}>
              Cancel
            </Button>
          )}
          <Button
            variant="danger"
            type="submit"
            onClick={() => this.onSubmit()}
          >
            {this.state.phase === "initial" && "Delete"}
            {this.state.phase === "notEmptyFolderWarning" && "Delete"}
            {this.state.phase === "safeDeleted" && "Close"}
            {this.state.phase === "unsubscribe" && "Unsubscribe"}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default DeleteFolderModal;
