import React, { Component } from "react";

import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import { contextMenu, Menu, Item, Separator, Submenu } from "react-contexify";

import FolderItem from "./folderItem";
import LoginItem from "./loginItem";
import NoteItem from "./noteItem";
import FileItem from "./fileItem";

// import NoteItemModal from "./noteItemModal";
import LoginModal from "./loginModal";
import NoteModal from "./noteModal";
import FileModal from "./fileModal";
import DeleteItemModal from "./deleteItemModal";
import AddDropUp from "./addDropUp";
import FolderMenu from "./folderMenu";

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

  constructor(props) {
    super(props);
    this.addButtonRef = React.createRef();
  }

  addButtonRect = { right: "16px", bottom: "16px" };

  handleAddClick = (cmd) => {
    console.log(cmd);
    if (cmd === "Password") {
      this.showLoginModal();
    }
    if (cmd === "File") {
      this.showFileModal();
    }
    if (cmd === "Note") {
      this.showNoteModal();
    }
    if (cmd === "Folder") {
      this.handleFolderMenuCmd(this.props.folder, "Add folder");
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

  /*  
  showAddMenu = (e) => {
    contextMenu.show({
      id: ADD_BUTTON_MENU_ID,
      event: e,
    });
  };
*/

  showAddMenu = (e) => {
    this.setState({
      showModal: "addDropUp",
    });
  };

  showLoginModal = (item) => {
    this.setState({
      showModal: "LoginModal",
      itemModalArgs: {
        item,
        folder: this.props.folder,
        openDeleteItemModal: this.openDeleteItemModal,
      },
    });
  };

  showNoteModal = (item) => {
    this.setState({
      showModal: "NoteModal",
      itemModalArgs: {
        item,
        folder: this.props.folder,
        openDeleteItemModal: this.openDeleteItemModal,
      },
    });
  };

  showFileModal = (item) => {
    this.setState({
      showModal: "FileModal",
      itemModalArgs: {
        item,
        folder: this.props.folder,
        openDeleteItemModal: this.openDeleteItemModal,
      },
    });
  };

  onItemModalClose = (refresh = false) => {
    this.setState({ showModal: "" });
    if (refresh === true) {
      this.props.refreshUserData();
    }
  };

  openDeleteItemModal = () => {
    this.setState({ showModal: "DeleteItemModal" });
  };

  openFolder = (folder) => {
    this.props.setActiveFolder(folder);
  };

  handleFolderMenuCmd = (node, cmd) => {
    this.props.onFolderMenuCmd(this.props.folder, cmd);
    console.log(cmd);
  };

  render() {
    if (!this.props.folder) {
      return null;
    }

    const { folder } = this.props;
    const emptyFolder = !(folder.folders.length + folder.items.length > 0);
    const isSafe = folder.path.length == 1 && !this.props.searchMode;
    let EmptyMessage = isSafe ? "Empty safe" : "Empty folder";
    if (this.props.searchMode) {
      EmptyMessage = (
        <div>
          <b>
            <p>Nothing found</p>
            <p>Try another search</p>
          </b>
        </div>
      );
    }
    return (
      <Col
        className="col-xl-9 col-lg-8 col-md-7 col-sm-6 d-none d-sm-block"
        id="table_pane"
      >
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <div
            className="d-sm-none green70"
            style={{ cursor: "pointer", marginBottom: "18px" }}
            onClick={() => {
              if (this.props.searchMode) {
                this.props.onSearchClear();
              }

              if (folder.SafeID) {
                this.props.openParentFolder(folder);
              } else {
                document.querySelector("#safe_pane").classList.remove("d-none");
                document.querySelector("#table_pane").classList.add("d-none");
              }
            }}
          >
            <svg
              width="24"
              height="24"
              style={{
                fill: "#009a50",
                transform: "rotate(90deg)",
              }}
            >
              <use href="#angle"></use>
            </svg>

            {folder.path.length == 1
              ? "All safes"
              : folder.path[folder.path.length - 2]}
          </div>
          <div
            className="d-sm-none"
            style={{
              display: "flex",
              justifyContent: "space-between",
              position: "relative",
            }}
          >
            <div className="h5">{folder.path[folder.path.length - 1]}</div>
            {!this.props.searchMode && (
              <FolderMenu
                node={folder}
                onMenuCmd={this.handleFolderMenuCmd}
                color="black"
                isSafe={true}
              />
            )}
          </div>

          <div className="d-none d-sm-block" style={{ color: "#1B1B26" }}>
            {folder.path.join(" > ")}
          </div>

          {emptyFolder && (
            <div>
              <div style={{ textAlign: "center" }}>
                <svg
                  width="400"
                  height="208"
                  style={{ margin: "2em auto 1em auto", display: "block" }}
                >
                  <use href={isSafe ? "#f-emptySafe" : "#f-emptyFolder"}></use>
                </svg>
                {EmptyMessage}
              </div>
            </div>
          )}

          {!emptyFolder && (
            <div style={{ overflowY: "auto" }}>
              <table className="item_table">
                <thead>
                  <tr>
                    <th className="d-none d-sm-table-cell">Title</th>
                    <th className="d-none d-lg-table-cell"></th>
                    <th className="d-none d-lg-table-cell"></th>
                    <th className="rightAlign d-none d-xl-table-cell">
                      Modified
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {folder.folders.map((f) => (
                    <FolderItem
                      item={f}
                      onClick={(folder) => {
                        this.openFolder(folder);
                      }}
                    />
                  ))}
                  {folder.items.map(
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
            </div>
          )}

          {this.addMenu}
          {!this.props.searchMode && (
            <Button
              variant="primary"
              type="submit"
              ref={this.addButtonRef}
              style={{
                width: "80px",
                height: "80px",
                position: "absolute",
                bottom: "16px",
                right: "16px",
                minWidth: "0",
                padding: "20px",
                borderRadius: "14px",
              }}
              onClick={() => {
                this.addButtonRect =
                  this.addButtonRef.current.getBoundingClientRect();
                this.showAddMenu();
              }}
            >
              <svg width="40" height="40">
                <use href="#f-plus"></use>
              </svg>
            </Button>
          )}

          <AddDropUp
            show={this.state.showModal == "addDropUp"}
            bottom={window.innerHeight - this.addButtonRect.bottom - 8}
            right={window.innerWidth - this.addButtonRect.right - 8}
            onClose={() => this.setState({ showModal: "" })}
            handleAddClick={this.handleAddClick}
          ></AddDropUp>

          <LoginModal
            show={this.state.showModal == "LoginModal"}
            args={this.state.itemModalArgs}
            openDeleteItemModal={this.openDeleteItemModal}
            onClose={(refresh = false) => {
              this.setState({ showModal: "" });
              if (refresh === true) {
                this.props.refreshUserData();
              }
            }}
          ></LoginModal>

          <FileModal
            show={this.state.showModal == "FileModal"}
            args={this.state.itemModalArgs}
            openDeleteItemModal={this.openDeleteItemModal}
            onClose={this.onItemModalClose}
            inMemoryView={(blob, filename) => {
              this.setState({ showModal: "" });
              this.props.inMemoryView(blob, filename);
            }}
          ></FileModal>

          <NoteModal
            show={this.state.showModal == "NoteModal"}
            args={this.state.itemModalArgs}
            openDeleteItemModal={this.openDeleteItemModal}
            onClose={this.onItemModalClose}
          ></NoteModal>

          <DeleteItemModal
            show={this.state.showModal == "DeleteItemModal"}
            folder={folder}
            args={this.state.itemModalArgs}
            onClose={(refresh = false) => {
              this.setState({ showModal: "" });
              if (refresh === true) {
                this.props.refreshUserData();
              }
            }}
          ></DeleteItemModal>
        </div>
      </Col>
    );
  }
}

export default TablePane;
