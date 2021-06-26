import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import axios from "axios";

import * as passhubCrypto from "../lib/crypto";

class FolderNameModal extends Component {
  state = { name: "", error_msg: "" };
  isShown = false;
  title = "";

  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }

  onShow = () => {
    this.textInput.current.focus();
  };

  onClose = () => {
    this.props.onClose();
  };

  createSafe = (safeName) => {
    const safe = passhubCrypto.createSafe(safeName);
    axios
      .post("create_safe.php", {
        verifier: document.getElementById("csrf").getAttribute("data-csrf"),
        safe,
      })
      .then((result) => {
        if (result.data.status === "Ok") {
          this.props.onClose(true);
        }
        if (result.data.status === "login") {
          window.location.href = "expired.php";
          return;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  renameSafe = (newName) => {
    axios
      .post("update_vault.php", {
        vault: this.props.args.folder.id,
        verifier: document.getElementById("csrf").getAttribute("data-csrf"),
        newSafeName: newName,
      })
      .then((reply) => {
        const result = reply.data;
        if (result.status === "Ok") {
          this.props.onClose(true);
          return;
        }
        if (result.status === "login") {
          window.location.href = "expired.php";
          return;
        }
        this.setState({ error_msg: result.status });
      })
      .catch((err) => {
        this.setState({ error_msg: err });
      });
  };

  createFolder = (parent, folderName) => {
    const [eAesKey, SafeID, folderID] = parent.safe
      ? [parent.safe.key, parent.safe.id, parent.id]
      : [parent.key, parent.id, 0];

    passhubCrypto.decryptAesKey(eAesKey).then((aesKey) => {
      const eFolderName = passhubCrypto.encryptFolderName(folderName, aesKey);
      axios
        .post("folder_ops.php", {
          operation: "create",
          verifier: document.getElementById("csrf").getAttribute("data-csrf"),
          SafeID,
          folderID,
          name: eFolderName,
        })
        .then((reply) => {
          const result = reply.data;
          if (result.status === "Ok") {
            // safes.setNewFolderID(result.id);
            this.props.onClose(true);
            return;
          }
          if (result.status === "login") {
            window.location.href = "expired.php";
            return;
          }
          this.setState({ error_msg: result.status });
        })
        .catch((err) => {
          this.setState({ error_msg: err });
        });
    });
  };

  renameFolder = (newName) => {
    passhubCrypto
      .decryptAesKey(this.props.args.folder.safe.key)
      .then((aesKey) => {
        const eFolderName = passhubCrypto.encryptFolderName(newName, aesKey);
        axios
          .post("folder_ops.php", {
            operation: "rename",
            verifier: document.getElementById("csrf").getAttribute("data-csrf"),
            SafeID: this.props.args.folder.safe.id,
            folderID: this.props.args.folder.id,
            name: eFolderName,
          })
          .then((reply) => {
            const result = reply.data;
            if (result.status === "Ok") {
              this.props.onClose(true);
              return;
            }
            if (result.status === "login") {
              window.location.href = "expired.php";
              return;
            }
            this.setState({ error_msg: result.status });
          })
          .catch((err) => {
            this.setState({ error_msg: err });
          });
      });
  };

  onSubmit = () => {
    console.log(`submit ${this.title}`);
    const name = this.state.name.trim();
    if (name.length == 0) {
      this.setState({ name: name, error_msg: "name cannot be empty" });
      return;
    }

    if (this.title == "Create Safe") {
      this.createSafe(this.state.name);
      return;
    }

    if (this.title == "Create Folder") {
      this.createFolder(this.props.args.parent, this.state.name);
      return;
    }

    // rename
    let prevName =
      this.props.args.folder.path[this.props.args.folder.path.length - 1];
    if (prevName == name) {
      this.props.onClose();
      return;
    }

    if (this.title == "Rename Safe") {
      this.renameSafe(this.state.name);
      return;
    }
    if (this.title == "Rename Folder") {
      this.renameFolder(this.state.name);
    }
  };

  handleChange = (e) => this.setState({ name: e.target.value, error_msg: "" });

  render() {
    this.title = "Create";
    let icon = "#f-safe";

    if (this.props.args.folder) {
      [this.title, icon] =
        this.props.args.folder.path.length < 2
          ? ["Rename Safe", "#f-safe"]
          : ["Rename Folder", "#f-folderSimplePlus"];
    } else {
      [this.title, icon] = this.props.args.parent
        ? ["Create Folder", "#f-folderSimplePlus"]
        : ["Create Safe", "#f-safe"];
    }

    if (this.props.show) {
      if (!this.isShown) {
        this.isShown = true;
        if (this.props.args.folder) {
          // rename
          this.state.name =
            this.props.args.folder.path[this.props.args.folder.path.length - 1];
        } else {
          this.state.name = "";
        }
        this.state.error_msg = "";
      }
    } else {
      this.isShown = false;
    }

    return (
      <Modal
        show={this.props.show}
        onShow={this.onShow}
        onHide={this.onClose}
        animation={false}
        centered
      >
        <Modal.Header closeButton>
          <svg width="32" height="32" style={{ margin: "8px 10px 0 0" }}>
            <use href={icon}></use>
          </svg>
          <h2>{this.title}</h2>
        </Modal.Header>
        {this.title == "Create Safe" && <div>Shareable top-level folder</div>}
        <Modal.Body>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              ref={this.textInput}
              type="text"
              spellCheck={false}
              onChange={this.handleChange}
              value={this.state.name}
            />
          </Form.Group>
          {this.state.error_msg.length > 0 && (
            <div style={{ color: "red" }}>{this.state.error_msg}</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={this.onClose}>
            Cancel
          </Button>

          <Button variant="primary" type="submit" onClick={this.onSubmit}>
            {this.props.args.folder ? "Rename" : "Create"}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default FolderNameModal;
