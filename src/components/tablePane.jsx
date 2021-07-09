import React, { Component } from "react";

import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import { contextMenu, Menu, Item, Separator, Submenu } from "react-contexify";

import FolderItem from "./folderItem";
import LoginItem from "./loginItem";
import NoteItem from "./noteItem";
import FileItem from "./fileItem";

import NoteItemModal from "./noteItemModal";
import LoginModal from "./loginModal";
import FileModal from "./fileModal";
import DeleteItemModal from "./deleteItemModal";

const ADD_BUTTON_MENU_ID = "add-menu-id";

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
    showModal: "",

    itemModalArgs: {},
    currentItem: 0,
  };

  handleAddClick = (cmd) => {
    if (cmd == "Login") {
      this.setState({
        showModal: "LoginModal",
        itemModalArgs: {},
      });
    }
    if (cmd == "File") {
      this.setState({
        showModal: "FileModal",
        itemModalArgs: {},
      });
    }
  };

  addMenu = (
    <Menu id={ADD_BUTTON_MENU_ID}>
      <Item
        onClick={() => {
          this.handleAddClick("Login");
        }}
      >
        Login
      </Item>
      <Item
        onClick={() => {
          this.handleAddClick("Note");
        }}
      >
        Note
      </Item>
      <Item
        onClick={() => {
          this.handleAddClick("File");
        }}
      >
        File
      </Item>
      <Item
        onClick={() => {
          this.handleAddClick("Folder");
        }}
      >
        Folder
      </Item>
    </Menu>
  );

  showAddMenu = (e) => {
    // e.preventDefault();
    contextMenu.show({ id: ADD_BUTTON_MENU_ID, event: e });
  };

  showLoginModal = (item) => {
    this.setState({ showModal: "LoginModal", itemModalArgs: { item } });
  };

  showNoteModal = (item) => {
    this.setState({ showModal: "NoteModal", currentItem: item });
  };

  showFileModal = (item) => {
    this.setState({ showModal: "FileModal", itemModalArgs: { item } });
  };

  openDeleteItemModal = () => {
    this.setState({ showModal: "DeleteItemModal" });
  };

  hideModal = () => {
    this.setState({
      showModal: "",
    });
  };

  openFolder = (folder) => {};

  render() {
    const contentNotEmpty = this.props.folder != null;
    const emptyFolder = !(
      contentNotEmpty &&
      this.props.folder.folders.length + this.props.folder.items.length > 0
    );
    const isSafe = contentNotEmpty && this.props.folder.path.length == 1;

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
          <div style={{ color: "#1B1B26" }}>
            {this.props.folder.path.join(" > ")}
          </div>
        )}

        {contentNotEmpty && emptyFolder && (
          <div>
            <div style={{ textAlign: "center" }}>
              <svg
                width="400"
                height="208"
                style={{ margin: "2em auto 1em auto", display: "block" }}
              >
                <use href={isSafe ? "#f-emptySafe" : "#f-emptyFolder"}></use>
              </svg>
              {isSafe ? "Empty safe" : "Empty folder"}
            </div>
          </div>
        )}

        {contentNotEmpty && !emptyFolder && (
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
              {this.props.folder.folders.map((f) => (
                <FolderItem
                  item={f}
                  onclick={(folder) => {
                    this.openFolder(folder);
                  }}
                />
              ))}
              {this.props.folder.items.map(
                (f) =>
                  (isLoginItem(f) && (
                    <LoginItem item={f} showModal={this.showLoginModal} />
                  )) ||
                  (isNoteItem(f) && (
                    <NoteItem item={f} showModal={this.showNoteModal} />
                  )) ||
                  (isFileItem(f) && (
                    <FileItem item={f} showModal={this.showFileModal} />
                  ))
              )}
            </tbody>
          </table>
        )}

        {this.addMenu}
        <Button
          variant="primary"
          type="submit"
          style={{
            width: "80px",
            height: "80px",
            position: "absolute",
            bottom: "16px",
            right: "16px",
            minWidth: "0",
            padding: "0",
            borderRadius: "14px",
          }}
          onClick={this.showAddMenu}
        >
          +
        </Button>
        <LoginModal
          show={this.state.showModal == "LoginModal"}
          folder={this.props.folder}
          args={this.state.itemModalArgs}
          openDeleteItemModal={this.openDeleteItemModal}
          onClose={(refresh = false) => {
            this.setState({ showModal: "" });
            if (refresh === true) {
              this.props.refreshUserData();
            }
          }}
        ></LoginModal>

        <NoteItemModal
          show={this.state.showModal == "NoteModal"}
          item={this.state.currentItem}
          onClose={this.hideItemModal}
        />

        <FileModal
          show={this.state.showModal == "FileModal"}
          folder={this.props.folder}
          args={this.state.itemModalArgs}
          openDeleteItemModal={this.openDeleteItemModal}
          onClose={(refresh = false) => {
            this.setState({ showModal: "" });
            if (refresh === true) {
              this.props.refreshUserData();
            }
          }}
        ></FileModal>

        <DeleteItemModal
          show={this.state.showModal == "DeleteItemModal"}
          folder={this.props.folder}
          args={this.state.itemModalArgs}
          onClose={(refresh = false) => {
            this.setState({ showModal: "" });
            if (refresh === true) {
              this.props.refreshUserData();
            }
          }}
        ></DeleteItemModal>
      </Col>
    );
  }
}

export default TablePane;
