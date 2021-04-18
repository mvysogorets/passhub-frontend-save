import React, { Component } from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NavSpan from "./navSpan";

class Header extends Component {
  state = {};
  render() {
    return (
      <Row>
        <Col
          className="py-md-2 col"
          style={{ paddingRight: "0", margin: "0 auto" }}
        >
          <a href="index.php">
            <img src="public/img/new_ph_logo.svg" alt="logo" width="98" />
          </a>
          <span className="d-md-none" id="xs_indicator"></span>
          <NavSpan />
        </Col>
      </Row>
    );
  }
}

export default Header;
