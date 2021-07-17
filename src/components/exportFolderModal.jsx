import axios from "axios";
import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import { saveAs } from "file-saver";

import exportXML from "../lib/exportXML";
import exportCSV from "../lib/exportCSV";

class ExportFolderModal extends Component {
  state = {
    format: "XML",
  };
  isShown = false;

  handleFormatChange = (e) => {
    this.setState({
      format: e,
    });
  };

  onClose = () => {
    this.props.onClose();
  };

  onSubmit = () => {
    if (this.state.format == "XML") {
      const blob = exportXML(this.props.folder);
      saveAs(blob, "passhub.xml");
    } else {
      const blob = exportCSV(this.props.folder);
      saveAs(blob, "passhub.csv");
    }
    this.props.onClose();
  };

  render() {
    const formatEntries = [
      { format: "XML", comment: "KeePass 2.0 compatible, RECOMMENDED" },
      { format: "CSV", comment: "Readable, Excel compatible" },
    ];

    if (this.props.show) {
      if (!this.isShown) {
        this.isShown = true;
        this.state.format = "XML";
      }
    } else {
      this.isShown = false;
    }

    let folderType = "";
    let folderName = "";

    if (this.props.show) {
      folderName = this.props.folder.path[this.props.folder.path.length - 1];
      const isSafe = this.props.folder.path.length < 2;
      folderType = isSafe ? "Safe" : "Folder";
    }

    return (
      <Modal
        show={this.props.show}
        onHide={this.onClose}
        onEnter={this.onEnter}
        animation={false}
      >
        <Modal.Header closeButton>
          <h2>
            Export {folderType}: {folderName}
          </h2>
        </Modal.Header>
        <Modal.Body>
          <div style={{ marginBottom: 32 }}>
            {formatEntries.map((e) => (
              <div
                style={{ display: "flex", marginBottom: 12 }}
                onClick={() => {
                  this.handleFormatChange(e.format);
                }}
              >
                <div>
                  <svg
                    width="22"
                    height="22"
                    fill="none"
                    style={{ marginRight: "14px" }}
                  >
                    <use
                      href={
                        this.state.format == e.format
                          ? "#f-radio-checked"
                          : "#f-radio"
                      }
                    ></use>
                  </svg>
                </div>
                <div>
                  <div>{e.format}</div>
                  <div style={{ fontSize: 13, opacity: 0.5 }}>{e.comment}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", color: "#DE5F00" }}>
            <div>
              {" "}
              <svg
                width="39"
                height="41"
                fill="none"
                style={{ marginRight: "14px" }}
              >
                <use href="#no-files-exported"></use>
              </svg>
            </div>
            <div>
              Files and images will not be exported.<br></br> Unfortunately, you
              need to download them manually
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={this.onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            onClick={() => this.onSubmit()}
          >
            Export
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ExportFolderModal;
