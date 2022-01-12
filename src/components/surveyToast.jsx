import Toast from "react-bootstrap/Toast";
import Button from "react-bootstrap/Button";

import React, { Component } from "react";

class SurveyToast extends Component {
  onSubmit = () => {
    this.props.onClose("showSurveyModal");
  };

  render() {
    return (
      <Toast onClose={this.props.onClose} show={this.props.show}>
        <div className="toast-header">
          <div>Help us improve PassHub.net</div>
          <div>
            <svg
              style={{ width: 24, height: 24, cursor: "pointer" }}
              onClick={this.props.onClose}
            >
              <use href="#f-cross24"></use>
            </svg>
          </div>
        </div>

        <Toast.Body>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              margin: "16px 0 0 0",
            }}
          >
            <Button variant="primary" type="button" onClick={this.onSubmit}>
              Take&nbsp;short&nbsp;survey
            </Button>
            <Button variant="outline-secondary" onClick={this.props.onClose}>
              Remind&nbsp;me&nbsp;later
            </Button>
          </div>
        </Toast.Body>
      </Toast>
    );
  }
}

export default SurveyToast;

/*
          <div
            style={{
              fontFamily: "OpenSansBold",
              fontStyle: "normal",
              fontWeight: "bold",
              fontSize: "19px",
              lineHeight: "24px",
              color: "#FFFFFF",
              marginBottom: "24px",
            }}
          >
           
          </div>




<div class="toast toast_improve hide" role="status" aria-live="polite" aria-atomic="true"
  data-autohide="false" data-animation="true">
    <div class="toast-header" style="background:lemonchiffon">
      <strong class="mr-auto toast_header_text">Help us improve PassHub.net</strong>
      <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="toast-body" style="padding: 10px;">
      <span id = 'take_survey' style="text-decoration: underline; font-weight: 200;margin:0 15px; cursor:pointer;">Take&nbsp;short&nbsp;survey</span>
      <span data-dismiss="toast" style="text-decoration: underline; font-weight: 200;margin:0 15px; cursor:pointer;">Remind&nbsp;me&nbsp;later</span>
    </div>
</div>
*/
