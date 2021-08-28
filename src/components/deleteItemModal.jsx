import axios from "axios";
import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

class DeleteItemModal extends Component {
  onClose = (refresh = false) => {
    this.props.onClose(false);
  };

  onSubmit = () => {
    const vault = this.props.folder.safe
      ? this.props.folder.safe.id
      : this.props.folder.id;

    axios
      .post("delete.php", {
        vault,
        verifier: document.getElementById("csrf").getAttribute("data-csrf"),
        id: this.props.args.item._id,
      })
      .then((reply) => {
        const result = reply.data;
        if (result.status === "Ok") {
          this.props.onClose(true);
          return;
        }
        if (result.status === "Record not found") {
          // utils.bsAlert('Record not found. Erased by another user?');
          // passhub.refreshUserData();
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
    let path = [];
    let title = "";
    let modalTitle = "Delete Record";
    if (this.props.show) {
      path = this.props.folder ? this.props.folder.path.join(" > ") : [];
      title = this.props.args.item.cleartext[0];

      if (this.props.args.item.file) {
        modalTitle = "Delete File";
      }
      if (this.props.args.item.note) {
        modalTitle = "Delete Note";
      }
    }

    return (
      <Modal
        show={this.props.show}
        onHide={this.onClose}
        animation={false}
        centered
      >
        <div class="itemModalNav">
          <div className="itemModalPath">{path}</div>
          <div>
            <span
              style={{
                fontSize: "2rem",
                fontWeight: "400",
                position: "absolute",
                right: "0",
                marginRight: "20px",
                cursor: "pointer",
              }}
              onClick={this.props.onClose}
            >
              &#215;
            </span>
          </div>
        </div>
        <div className="ModalTitle h2">{modalTitle}</div>

        <Modal.Body>
          Do you really want to delete{" "}
          <span style={{ fontSize: "larger", fontWeight: "bold" }}>
            {title} ?
          </span>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={this.onClose}>
            Cancel
          </Button>
          <Button variant="danger" type="submit" onClick={this.onSubmit}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default DeleteItemModal;
