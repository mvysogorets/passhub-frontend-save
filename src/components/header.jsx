import React, { Component } from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NavSpan from "./navSpan";

class Header extends Component {
  render() {
    return (
      <Row>
        <Col
          style={{
            paddingLeft: 24,
            paddingRight: 0,
            margin: "20px auto 12px auto",
            display: "flex",
          }}
        >
          <div>
            <a href="index.php">
              <img src="public/img/new_ph_logo.svg" alt="logo" width="133" />
            </a>
            <span className="d-md-none" id="xs_indicator"></span>
          </div>
          <NavSpan
            onSearchChange={this.props.onSearchChange}
            searchString={this.props.searchString}
            onMenuCommand={this.props.onAccountMenuCommand}
          />
        </Col>
      </Row>
    );
  }
}

export default Header;
