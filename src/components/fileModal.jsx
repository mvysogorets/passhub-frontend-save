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

function getMimeByExt(filename) {
  const mimeType = {
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    gzip: "application/gzip",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    pdf: "application/pdf",
    png: "image/png",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    tif: "image/tiff",
    tiff: "image/tiff",
    txt: "text/plain",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    zip: "application/zip",
  };
  const i = filename.lastIndexOf(".");
  if (i !== -1) {
    const ext = filename.substr(i + 1).toLowerCase();
    if (ext in mimeType) {
      return mimeType[ext];
    }
  }
  // }
  return "application/octet-binary";
}

class FileModal extends Component {
  state = {
    edit: true,
    errorMsg: "",
    theFile: null,
  };

  constructor(props) {
    super(props);
    this.wrapperComponent = React.createRef();
  }

  isShown = false;

  onClose = () => {
    this.props.onClose();
  };

  download(callBack) {
    const [eAesKey, SafeID, folderID] = this.props.args.folder.safe
      ? [
          this.props.args.folder.safe.key,
          this.props.args.folder.safe.id,
          this.props.args.folder.id,
        ]
      : [this.props.args.folder.key, this.props.args.folder.id, 0];

    // progress.lock(0);
    axios
      .post("file_ops.php", {
        operation: "download",
        SafeID,
        verifier: document.getElementById("csrf").getAttribute("data-csrf"),
        itemId: this.props.args.item._id,
      })
      .then((reply) => {
        const result = reply.data;
        if (result.status === "Ok") {
          passhubCrypto.decryptAesKey(eAesKey).then((aesKey) => {
            const { filename, buf } = passhubCrypto.decryptFile(result, aesKey);
            const mime = getMimeByExt(filename);
            const blob = new Blob([buf], { type: mime });
            callBack(blob, filename);
            // progress.unlock();
          });
          return;
        }
        if (result.status === "File not found") {
          // progress.unlock();
          // utils.bsAlert('File not found. Could be erased by another user');
          // passhub.refreshUserData();
          return;
        }
        if (result.status === "login") {
          // progress.unlock();
          window.location.href = "expired.php";
          return;
        }
        //progress.unlock();
        window.location.href = "error_page.php?js=other";
      })
      .catch((err) => {
        // progress.unlock();
        // passhub.modalAjaxError($('#rename_vault_alert'), hdr, status, err);
      });
  }

  onDownload = () => {
    this.download(saveAs);
  };

  onView = () => {};

  onFileInputChange = (e) => {
    this.setState({
      theFile: e.target.files[0],
      title: e.target.files[0].name,
      errorMsg: "",
    });
    this.wrapperComponent.current.setTitle(e.target.files[0].name);
    const { type, size, lastModifiedDate } = e.target.files[0];
    console.log(type, size, lastModifiedDate);
  };

  onSubmit = (title, note) => {
    if (!this.props.args.item && !this.state.theFile) {
      this.setState({ errorMsg: "No file defined" });
      return;
    }

    const pData = [title, "", "", "", note];
    const options = {};

    const [aesKey, SafeID, folderID] = this.props.args.folder.safe
      ? [
          this.props.args.folder.safe.bstringKey,
          this.props.args.folder.safe.id,
          this.props.args.folder.id,
        ]
      : [this.props.args.folder.bstringKey, this.props.args.folder.id, 0];

    const eData = passhubCrypto.encryptItem(
      pData,
      aesKey,
      // init.safe.bstringKey, ?? TODO
      options
    );

    if (this.props.args.item) {
      axios
        .post("file_ops.php", {
          verifier: document.getElementById("csrf").getAttribute("data-csrf"),
          operation: "rename",
          SafeID,
          itemId: this.props.args.item._id,
          newName: eData,
        })
        .then((reply) => {
          //            progress.unlock();
          const result = reply.data;
          if (result.status == "Ok") {
            this.props.onClose(true);
            return;
          }
          if (result.status === "login") {
            window.location.href = "login.php";
            return;
          }
          if (result.status === "expired") {
            window.location.href = "expired.php";
            return;
          }
        })
        .catch((err) => {});
      return;
    }

    const reader = new FileReader();

    // progress.lock(0, 'Encrypting.');
    reader.readAsArrayBuffer(this.state.theFile);

    reader.onerror = (err) => {
      // console.log(err, err.loaded, err.loaded === 0, file);
      alert("fail");
    };

    reader.onload = () => {
      const { fileInfo, cFileContent } = passhubCrypto.encryptFile(
        reader.result,
        aesKey
      );
      //        progress.unlock();
      //        progress.lock(0, "Uploading. ");

      const data = new FormData();
      data.append("vault", SafeID);
      data.append("folder", folderID);
      data.append(
        "verifier",
        document.getElementById("csrf").getAttribute("data-csrf")
      );

      data.append("meta", eData);
      data.append("file", fileInfo);
      const ab = passhubCrypto.str2uint8(cFileContent);
      const bl = new Blob([ab]);
      data.append("blob", bl);

      axios
        .post("create_file.php", data, {
          headers: {
            "content-type": "multipart/form-data",
          },
          timeout: 600000,
        })
        .then((reply) => {
          //            progress.unlock();
          const result = reply.data;
          if (result.status == "Ok") {
            this.props.onClose(true);
            return;
          }
          if (result.status === "login") {
            window.location.href = "login.php";
            return;
          }
          if (result.status === "expired") {
            window.location.href = "expired.php";
            return;
          }
        })
        .catch((err) => {});
    };
  };

  render() {
    if (this.props.show) {
      if (!this.isShown) {
        this.isShown = true;
        this.state.errorMsg = "";
        if (this.props.args.item) {
          this.state.title = this.props.args.item.cleartext[0];
          this.state.edit = false;
        } else {
          this.state.title = "";
          this.state.edit = true;
        }
      }
    } else {
      this.isShown = false;
    }

    let modalClass = this.state.edit ? "edit" : "view";

    // const path = this.props.folder ? this.props.folder.path.join(" > ") : [];

    return (
      <ItemModal
        show={this.props.show}
        args={this.props.args}
        onClose={this.props.onClose}
        ref={this.wrapperComponent}
        onSubmit={this.onSubmit}
      >
        {!this.props.args.item ? (
          <div
            className="itemModalField"
            style={{
              marginBottom: 62,
              position: "relative",
              background: "#E6F8EF",
            }}
          >
            <div
              style={{
                margin: "12px auto",
                color: "#009A50",
                display: "table",
              }}
            >
              <svg width="24" height="24">
                <use href="#f-addfile"></use>
              </svg>
              <b>Upload file</b>
              <div>or drag & drop it here</div>
            </div>

            <svg
              width="151"
              height="134"
              style={{ position: "absolute", top: 16, left: 32 }}
            >
              <use href="#f-dragfile"></use>
            </svg>

            <input
              type="file"
              id="inputFileModal"
              onChange={this.onFileInputChange}
            ></input>
          </div>
        ) : (
          <div style={{ margin: "12px auto", display: "table" }}>
            <svg width="105" height="132">
              <use href="#f-file"></use>
            </svg>
          </div>
        )}
        <DownloadAndViewButtons
          onDownload={this.onDownload}
          onView={this.onView}
        ></DownloadAndViewButtons>
      </ItemModal>
    );
  }
}

export default FileModal;
