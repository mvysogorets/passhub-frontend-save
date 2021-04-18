import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";

class DelUserModal extends Component {
  /*
  state = {
    isOpen: true,
  };
  openModal = () => {
    this.setState({ isOpen: true });
  };
  */

  closeModal = () => {
    this.props.hide();
  };

  submit = () => {
    const self = this;
    axios
      .post("../iam.php", {
        verifier: document.getElementById("csrf").getAttribute("data-csrf"),
        operation: "delete",
        email: self.props.data.email,
        id: self.props.data.id,
      })
      .then((result) => {
        if (result.data.status === "Ok") {
          self.props.updatePage();
          return;
        }
        if (result.data.status === "login") {
          window.location.href = "expired.php";
          return;
        }
        self.setState({ errorMsg: result.data.status });
      })
      .catch((error) => {
        // alert(error);
        self.setState({ errorMsg: error });
      });
  };

  render() {
    return (
      <Modal show={this.props.data.show} onHide={this.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>email: {this.props.data.email}</div>
          <div>id: {this.props.data.id}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={this.closeModal}>
            Cancel
          </Button>
          <Button onClick={this.submit}>Ok</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default DelUserModal;
