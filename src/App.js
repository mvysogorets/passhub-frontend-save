import React, { Component } from "react";
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";

import Header from "./components/header"
// import UserManagementPage from "./components/userManagementPage";
import MainPage from "./components/mainPage";


class App extends Component {
  state={
    searchString:"",
    accountData:{}
  }
  constructor(props) {
    super(props);
    this.mainPageRef = React.createRef();
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

  render () {
    return (
      <Container className='d-flex' style={{flexDirection: "column"}}>
        <Header 
        onSearchChange={this.onSearchStringChange} 
        searchString = {this.state.searchString} 
        onAccountMenuCommand={this.onAccountMenuCommand}
        accountData={this.state.AccountData}/>

        <Row style={{
          flexGrow: "1",  
          borderRadius: "6px"
        }}>
          <MainPage searchString = {this.state.searchString} updateAccountData={this.updateAccountData} ref={this.mainPageRef}/>
          { /* <UserManagementPage /> */}
        </Row>
        <Row>
          <div style={{height:"3em"}}></div>
        </Row>

      </Container>
    );
  }
}

export default App;
