import React, { Component } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import Header from "./header";
import UserManagementPage from "./userManagementPage";
import MainPage from "./mainPage";
import ViewFile from "./viewFile";
import CopyMoveToast from "./copyMoveToast";
// import LoginPane from "./loginPane";

import {
  copyBufferAddListener,
  copyBufferRemoveListener,
  popCopyBuffer,
  peekCopyBuffer,
} from "../lib/copyBuffer";

class Root extends Component {
  state = {
    searchString: "",
    page: "Main",
    filename: "",
    blob: null,
    showToast: "",
    copyMoveOperaion: "move",
    accountData: {},

    itemPaneArgs: {},
  };

  constructor(props) {
    super(props);
    this.mainPageRef = React.createRef();
  }

  componentDidMount = () => {
    copyBufferAddListener(this.copyBufferEvent);
  };

  componentWillUnmount = () => {
    copyBufferRemoveListener(this.copyBufferEvent);
  };

  copyBufferEvent = () => {
    const entry = peekCopyBuffer();
    if (entry) {
      this.setState({
        showToast: "CopyToast",
        copyMoveOperaion: entry.operation,
      });
    } else {
      this.setState({ showToast: "" });
    }
  };

  onCopyToastClose = () => {
    popCopyBuffer();
  };

  gotoMain = () => {
    this.setState({
      page: "Main",
      filename: "",
      blob: null,
    });
  };

  gotoIam = () => {
    this.setState({
      page: "Iam",
      filename: "",
      blob: null,
    });
  };

  updateAccountData = (data) => {
    this.setState({ accountData: data });
  };
  onSearchStringChange = (searchString) => {
    this.setState({ searchString: searchString });
  };
  onAccountMenuCommand = (cmd) => {
    this.mainPageRef.current.onAccountMenuCommand(cmd);
  };
  inMemoryView = (blob, filename) => {
    this.setState({ page: "ViewFile", filename, blob });
    console.log("inMemory view", filename);
  };

  /*
  showItemPane = (args) => {
    this.setState({ page: "loginPane", itemPaneArgs: args });
    console.log("loginPane");
  };
*/
  render() {
    return (
      <Container className="d-flex" style={{ flexDirection: "column" }}>
        <Header
          onSearchChange={this.onSearchStringChange}
          searchString={this.state.searchString}
          mainPage={this.state.page === "Main"}
          onAccountMenuCommand={this.onAccountMenuCommand}
          accountData={this.state.AccountData}
          onClose={this.gotoMain}
          gotoIam={this.gotoIam}
          narrowPage={this.state.page === "loginPane"}
        />

        <Row className="mainRow">
          <ViewFile
            show={this.state.page === "ViewFile"}
            gotoMain={this.gotoMain}
            filename={this.state.filename}
            blob={this.state.blob}
          />
          {/*
          <LoginPane
            show={this.state.page === "loginPane"}
            args={this.state.itemPaneArgs}
            onClose={(refresh = false) => {
              this.gotoMain();
              if (refresh === true) {
                this.mainPageRef.current.refreshUserData();
              }
            }}
          />
          */}

          <MainPage
            show={this.state.page === "Main"}
            inMemoryView={this.inMemoryView}
            showItemPane={this.showItemPane}
            searchString={this.state.searchString}
            onSearchClear={() => this.onSearchStringChange("")}
            updateAccountData={this.updateAccountData}
            ref={this.mainPageRef}
          />

          <UserManagementPage
            show={this.state.page === "Iam"}
            gotoMain={this.gotoMain}
          />
        </Row>
        <Row className="d-none d-sm-block">
          <div
            style={{
              height: "22px",
              display: this.state.page === "Main" ? "" : "none",
            }}
          ></div>
        </Row>
        <CopyMoveToast
          show={this.state.showToast === "CopyToast"}
          operation={this.state.copyMoveOperaion}
          onClose={this.onCopyToastClose}
        ></CopyMoveToast>
      </Container>
    );
  }
}

export default Root;
