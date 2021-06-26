import React, { Component } from "react";

import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import { contextMenu, Menu, Item, Separator, Submenu } from "react-contexify";

import FolderItem from "./folderItem";
import LoginItem from "./loginItem";
import NoteItem from "./noteItem";
import FileItem from "./fileItem";

import NoteItemModal from "./noteItemModal";
// import LoginItemModal from "./loginItemModal";
import LoginModal from "./loginModal";

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
    //    showLoginItemModal: false,
    showNoteItemModal: false,
    showFileItemModal: false,
    showLoginModal: false,
    itemModalArgs: {},
    currentItem: 0,
  };

  handleAddClick = (cmd) => {
    if (cmd == "Login") {
      this.setState({
        showLoginModal: true,
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
    //    this.setState({ showLoginItemModal: true, currentItem: item });
    this.setState({ showLoginModal: true, itemModalArgs: { item } });
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
                <FolderItem item={f} />
              ))}
              {this.props.folder.items.map(
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
        {/*
        <LoginItemModal
          show={this.state.showLoginItemModal}
          item={this.state.currentItem}
          onClose={this.hideItemModal}
        />
*/}
        <LoginModal
          show={this.state.showLoginModal}
          folder={this.props.folder}
          args={this.state.itemModalArgs}
          onClose={(refresh = false) => {
            this.setState({ showLoginModal: false });
            if (refresh === true) {
              this.props.refreshUserData();
            }
          }}
        ></LoginModal>

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
