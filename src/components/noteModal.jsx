import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import axios from "axios";
import { saveAs } from "file-saver";

import * as passhubCrypto from "../lib/crypto";

import ItemModalFieldNav from "./itemModalFieldNav";
import ItemViewIcon from "./itemViewIcon";
import DownloadAndViewButtons from "./downloadAndViewButtons";

import ItemModal from "./itemModal";

class NoteModal extends Component {
  onClose = () => {
    this.props.onClose();
  };

  onSubmit = (title, note) => {
    const pData = [title, "", "", "", note];
    const options = { note: 1 };

    const folder = this.props.args.folder;
    const [aesKey, SafeID, folderID] = folder.safe
      ? [folder.safe.bstringKey, folder.safe.id, folder.id]
      : [folder.bstringKey, folder.id, 0];

    const eData = passhubCrypto.encryptItem(
      pData,
      aesKey,
      // init.safe.bstringKey, ?? TODO
      options
    );
    const data = {
      verifier: document.getElementById("csrf").getAttribute("data-csrf"),
      vault: SafeID,
      folder: folderID,
      encrypted_data: eData,
    };
    if (this.props.args.item) {
      data.entryID = this.props.args.item._id;
    }

    axios
      .post("items.php", data)
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
        if (result.status === "expired") {
          window.location.href = "expired.php";
          return;
        }
        if (result.status === "no rights") {
          // showAlert("Sorry, you do not have editor rights for this safe");
          return;
        }
        // showAlert(result.status);
      })
      .catch(
        (err) => {} /*modalAjaxError($("#safe_users_alert"), "", "", err)*/
      );
  };

  render() {
    return (
      <ItemModal
        show={this.props.show}
        args={this.props.args}
        onClose={this.props.onClose}
        onSubmit={this.onSubmit}
      ></ItemModal>
    );
  }
}

export default NoteModal;
