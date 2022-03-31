import React, { Component } from "react";
import { setApiUrl, getApiUrl, setCsrfToken } from "../lib/utils";
import * as WWPass from "wwpass-frontend";
import axios from "axios";

import "../login.css";

/* moz-extension://352b66fa-a868-4b29-8100-9dc6c1716b61/frontend/index.html */
console.log(window.location.href);

class LoginPage extends Component {
  state = {};

  loginCallback = (str) => {
    axios.get(`${getApiUrl()}loginSPA.php${str}`, {}).then((reply) => {
      console.log(reply);
      // console.log("csrf token:", reply.headers["x-csrf-token"]);
      setCsrfToken(reply.headers["x-csrf-token"]);
      const result = reply.data;
      if (result.status == "Ok") {
        this.props.whenDone();
        return;
      }
    });
  };

  componentDidMount = () => {
    if (!window.location.protocol.toLowerCase().startsWith("http")) {
      console.log(`- ${getApiUrl()}getticket.php -`);
      WWPass.authInit({
        qrcode: "#qrcode",
        // passkey: document.querySelector('#button--login'),
        ticketURL: `${getApiUrl()}getticket.php`,
        callbackURL: this.loginCallback,
      });
    }
  };

  render() {
    if (!this.props.show) {
      return null;
    }

    setApiUrl("https://trial.passhub.net/");

    return (
      <div id="login-root">
        <div class="rectangle640">
          <div style={{ width: 256 }}>
            <div class="rectangle1237">To sign-in, scan the QR code</div>
            <div class="rectangle1237a">
              <div style={{ marginTop: 0 }}>
                with <b>WWPass™ Key App</b>
              </div>
            </div>
            <div id="qrcode"></div>
            <div class="rectangle1237b">
              <div style={{ marginBottom: 0 }}>
                or connect <b>WWPass Key</b>
              </div>
            </div>
            <div class="rectangle1237c">
              <svg style={{ width: 30, height: 18, marginRight: 11 }}>
                <use href="#loaf-ico"></use>
              </svg>
              Login with WWPass Key
            </div>
          </div>
          <div class="passhub-logo">PassHub</div>
          <div class="help-contact">
            <div style={{ margin: "0 88px 0 60px", display: "flex" }}>
              <svg style={{ width: 20, height: 20, marginRight: 11 }}>
                <use href="#help-ico"></use>
              </svg>
              Help
            </div>

            <div style={{ display: "flex" }}>
              <svg
                style={{
                  width: "20px",
                  height: "20px",
                  marginRight: "11px",
                  marginTop: "4px",
                }}
              >
                <use href="#contact-ico"></use>
              </svg>
              Contact us
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginPage;

/*
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>login</div>
        <div id="qrcode" style={{ width: 256 }}></div>
      </div>


*/
