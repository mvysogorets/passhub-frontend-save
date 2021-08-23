import React, { Component } from "react";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import ItemModalFieldNav from "./itemModalFieldNav";
import ItemViewIcon from "./itemViewIcon";

import { putCopyBuffer } from "../lib/copyBuffer";

class ItemModal extends Component {
  state = {
    edit: true,
    title: "",
    note: "",
    errorMsg: "",
  };

  isShown = false;

  constructor(props) {
    super(props);
    this.titleInput = React.createRef();
  }

  onTitleChange = (e) => this.setState({ title: e.target.value, errorMsg: "" });

  onNoteChange = (e) => this.setState({ note: e.target.value });

  onShow = () => {
    this.state.edit && this.titleInput.current.focus();
  };

  onClose = () => {
    this.props.onClose();
  };

  onSubmit = () => {
    this.state.title = this.state.title.trim();
    if (this.state.title == "") {
      this.setState({ errorMsg: "Please set a title" });
      return;
    }
    this.props.onSubmit(this.state.title, this.state.note);
  };

  onEdit = () => {
    this.setState({ edit: true });

    if (this.props.onEdit) {
      this.props.onEdit();
    }
  };

  setTitle = (aTitle) => {
    this.setState({ title: aTitle });
  };

  handleMove = () => {
    putCopyBuffer({ item: this.props.args.item, operation: "move" });
    this.props.onClose();
  };

  handleCopy = () => {
    putCopyBuffer({ item: this.props.args.item, operation: "copy" });
    this.props.onClose();
  };

  onView = () => {};

  render() {
    let path = "";

    if (this.props.show) {
      if (this.props.args.item) {
        path = this.props.args.folder.path.join(" > ");
      }
      if (!this.isShown) {
        this.isShown = true;
        this.state.errorMsg = "";
        if (this.props.args.item) {
          this.state.title = this.props.args.item.cleartext[0];
          this.state.note = this.props.args.item.cleartext[4];
          this.state.edit = false;
        } else {
          this.state.title = "";
          this.state.note = "";
          this.state.edit = true;
        }
      }
    } else {
      this.isShown = false;
    }

    let modalClass = this.state.edit ? "edit" : "view";

    return (
      <Modal
        show={this.props.show}
        onShow={this.onShow}
        onHide={this.onClose}
        animation={false}
        centered
      >
        <div class="itemModalNav">
          <div className="itemModalPath">{path}</div>
          <div>
            {!this.state.edit && (
              <React.Fragment>
                <ItemViewIcon iconId="#f-history" opacity="1" title="History" />
                <ItemViewIcon
                  iconId="#f-move"
                  title="Move"
                  onClick={this.handleMove}
                />
                <ItemViewIcon
                  iconId="#f-copy"
                  title="Copy"
                  onClick={this.handleCopy}
                />
                <ItemViewIcon
                  iconId="#f-trash"
                  title="Delete"
                  onClick={this.props.args.openDeleteItemModal}
                />
                <div class="itemModalEditButton" onClick={this.onEdit}>
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    stroke="#00BC62"
                    style={{
                      verticalAlign: "unset",
                      marginRight: "10px",
                    }}
                  >
                    <use href="#f-edit"></use>
                  </svg>
                  <span style={{ verticalAlign: "top" }}>Edit</span>
                </div>
              </React.Fragment>
            )}

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

        {this.state.edit ? (
          <Form.Control
            className="itemModalTitle"
            ref={this.titleInput}
            type="text"
            onChange={this.onTitleChange}
            value={this.state.title}
            spellCheck="false"
            placeholder="Title"
          />
        ) : (
          <div className="itemModalTitle">{this.state.title}</div>
        )}

        <Modal.Body className={modalClass}>
          {this.state.errorMsg && (
            <div style={{ color: "red" }}>{this.state.errorMsg}</div>
          )}
          {this.props.children}

          {/* this.state.edit && this.state.notes != "" && (
            <div className="itemModalPlusField">
              <svg width="24" height="24" fill="none">
                <use href="#f-plus-field"></use>
              </svg>
              Add Notes
            </div>
          )*/}

          <div className="itemNoteModalField">
            <ItemModalFieldNav name="Note" />
            <div>
              {this.state.edit ? (
                <textarea
                  className="notes"
                  onChange={this.onNoteChange}
                  readOnly={!this.state.edit}
                  spellCheck={false}
                  value={this.state.note}
                  style={{ width: "100%" }}
                  rows="5"
                  placeholder="Type notes here"
                ></textarea>
              ) : (
                <p>{this.state.note}</p>
              )}
            </div>
          </div>
        </Modal.Body>

        {this.state.edit && (
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={this.onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="button" onClick={this.onSubmit}>
              Save
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    );
  }
}

export default ItemModal;
