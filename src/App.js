import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";

import Header from "./components/header"
import UserManagementPage from "./components/userManagementPage";
import MainPage from "./components/mainPage";


function App() {
  return (
    <Container className='d-flex' style={{flexDirection: "column"}}>
      <Header />
      <Row style={{
        flexGrow: "1",  
        borderRadius: "6px"
      }}>
        <MainPage />
        { /* <UserManagementPage /> */}
      </Row>
      <Row>
        <div style={{height:"3em"}}></div>
      </Row>

    </Container>
  );
}

export default App;
