import React, { Component } from "react";

import Col from "react-bootstrap/Col";

import FolderItem from "./folderItem";
import LoginItem from "./loginItem";
import NoteItem from "./noteItem";
import FileItem from "./fileItem";

import NoteItemModal from "./noteItemModal";
import LoginItemModal from "./loginItemModal";

function isLoginItem(item) {
  return !item.note && !item.file;
}

function isFileItem(item) {
  return item.file ? true : false;
}

function isNoteItem(item) {
  return item.note ? true : false;
}

class TablePane extends Component {
  state = {
    showLoginItemModal: false,
    showNoteItemModal: false,
    showFileItemModal: false,
    currentItem: 0,
  };

  showLoginModal = (item) => {
    this.setState({ showLoginItemModal: true, currentItem: item });
  };

  showNoteModal = (item) => {
    this.setState({ showNoteItemModal: true, currentItem: item });
  };

  hideItemModal = () => {
    this.setState({
      showLoginItemModal: false,
      showNoteItemModal: false,
      showFileItemModal: false,
    });
  };

  render() {
    const contentNotEmpty =
      this.props.content.folders.length > 0 ||
      this.props.content.items.length > 0;
    return (
      <Col
        className="col-xl-9 col-lg-8 col-md-7 d-none d-md-block"
        style={{
          background: "rgba(255,255,255,1)",
          paddingTop: "16px",
          height: "100%",
          flexDirection: "column",
          borderRadius: "0 16px 16px 0",
        }}
      >
        {contentNotEmpty && (
          <table className="item_table">
            <thead>
              <tr>
                <th>Title</th>
                <th></th>
                <th></th>
                <th className="rightAlign">Modified</th>
              </tr>
            </thead>
            <tbody>
              {this.props.content.folders.map((f) => (
                <FolderItem item={f} />
              ))}
              {this.props.content.items.map(
                (f) =>
                  (isLoginItem(f) && (
                    <LoginItem item={f} showModal={this.showLoginModal} />
                  )) ||
                  (isNoteItem(f) && (
                    <NoteItem item={f} showModal={this.showNoteModal} />
                  )) ||
                  (isFileItem(f) && <FileItem item={f} />)
              )}
            </tbody>
          </table>
        )}
        <LoginItemModal
          show={this.state.showLoginItemModal}
          item={this.state.currentItem}
          onClose={this.hideItemModal}
        />
        <NoteItemModal
          show={this.state.showNoteItemModal}
          item={this.state.currentItem}
          onClose={this.hideItemModal}
        />
      </Col>
    );
  }
}

export default TablePane;
