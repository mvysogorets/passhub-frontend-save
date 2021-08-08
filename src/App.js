import React, { Component } from "react";
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";

import Header from "./components/header"
// import UserManagementPage from "./components/userManagementPage";
import MainPage from "./components/mainPage";
import ViewFile from "./components/viewFile";


class App extends Component {
  state={
    searchString:"",
    page:"Main",
    filename:"",
    blob: null,
    accountData:{}
  }
  constructor(props) {
    super(props);
    this.mainPageRef = React.createRef();
  }

  gotoMain = () => {
    this.setState({
      page:"Main",
      filename:"",
      blob: null,
    })
  }

  updateAccountData = (data) => {
    this.setState({accountData:data})
  }
  onSearchStringChange = searchString => {
    this.setState({searchString:searchString.trim()})
  }
  onAccountMenuCommand = cmd => {
    this.mainPageRef.current.onAccountMenuCommand(cmd);
  }
  inMemoryView = (blob, filename) => {
    this.setState({page: "ViewFile", filename, blob})
    console.log("inMemory view", filename);
  }

  render () {
    return (
      <Container className='d-flex' style={{flexDirection: "column"}}>
        <Header 
        onSearchChange={this.onSearchStringChange} 
        searchString = {this.state.searchString} 
        onAccountMenuCommand={this.onAccountMenuCommand}
        accountData={this.state.AccountData}
        gotoMain={this.gotoMain}
        />

        <Row style={{
          flexGrow: "1",  
          borderRadius: "6px"
        }}>
          <ViewFile 
            show= {this.state.page == "ViewFile"} 
            filename={this.state.filename} 
            blob = {this.state.blob}/>

          <MainPage 
            show={this.state.page=="Main"}
            inMemoryView={this.inMemoryView}
            searchString = {this.state.searchString} 
            updateAccountData={this.updateAccountData} 
            ref={this.mainPageRef}/>
          { /* <UserManagementPage /> */}
        </Row>
        <Row>
          <div style={{height:"3em", display: this.state.page == "Main"? '':"none"}}></div>
        </Row>

      </Container>
    );
  }
}

export default App;
