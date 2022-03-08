import React, { Component } from "react";
import { setApiUrl, getApiUrl, setCsrfToken } from "../lib/utils";
import * as WWPass from "wwpass-frontend";
import axios from "axios";

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
    );
  }
}

export default LoginPage;
