import React, { Component } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

import axios from "axios";

import * as passhubCrypto from "../lib/crypto";
import copyToClipboard from "../lib/copyToClipboard";

import ItemModalFieldNav from "./itemModalFieldNav";

import ItemModal from "./itemModal";
import { ButtonGroup } from "react-bootstrap";

const monthNumbers = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];

function luhnLength(number) {
  if (number.charAt(0) === "4") {
    // visa
    return 16;
  }

  const d2 = parseInt(number.substring(0, 2));

  if (d2 == 34 || d2 == 37) {
    //amex
    return 15;
  }

  if (d2 >= 51 || d2 <= 55) {
    //mastercard (Diners Club US, Can 54, 55 )
    return 16;
  }

  const d4 = parseInt(number.substring(0, 4));
  if (d4 >= 2200 || d4 <= 2204) {
    //mir
    return 16;
  }

  if (d4 >= 2221 || d4 <= 2720) {
    //mastercard
    return 16;
  }

  return 0;
}

const thirtyYears = [];
let thisYear = new Date();
thisYear = thisYear.getFullYear();
for (let i = 0; i < 30; i++) {
  thirtyYears.push(thisYear + i);
}

const two = [0, 2, 4, 6, 8, 1, 3, 5, 7, 9];

// https://gist.github.com/DiegoSalazar/4075533

function isValidCardNumber(aNumber) {
  // Accept only digits, dashes or spaces

  if (/[^0-9-\s]+/.test(aNumber)) return false;
  const value = aNumber.replace(/\D/g, "");
  if (value.length < 8 || value.length > 19) {
    return false;
  }

  const ll = luhnLength(value);
  if (ll > 0 && value.length != ll) {
    return false;
  }

  let sum = 0,
    even = false;

  for (let n = value.length - 1; n >= 0; n--) {
    let c = value.charAt(n),
      ci = "0123456789".indexOf(c);
    sum += even ? two[ci] : ci;
    even = !even;
  }

  return sum % 10 == 0;
}

class BankCardModal extends Component {
  state = {
    edit: false,
    ccNumber: "",
    ccName: "",
    ccExpMonth: "Month",
    ccExpYear: "Year",
    ccCSC: "000",
    showModal: "",
    errorMsg: "",
  };

  isShown = false;

  onEdit = () => {
    this.setState({ edit: true });
  };

  onClose = () => {
    this.props.onClose();
  };

  onSubmit = (title, note) => {
    if (!monthNumbers.includes(this.state.ccExpMonth)) {
      this.setState({ errorMsg: "Expiration date not set" });
      return;
    }
    if (!thirtyYears.includes(parseInt(this.state.ccExpYear))) {
      this.setState({ errorMsg: "Expiration date not set" });
      return;
    }

    if (!isValidCardNumber(this.state.ccNumber)) {
      this.setState({ errorMsg: "Invalid card number" });
      return;
    }

    const pData = [
      "card",
      title,
      note,
      this.state.ccNumber,
      this.state.ccName,
      this.state.ccExpMonth,
      this.state.ccExpYear,
      this.state.ccCSC,
    ];

    const safe = this.props.args.safe;

    const aesKey = safe.bstringKey;
    const SafeID = safe.id;

    let folderID = 0;
    if (this.props.args.item) {
      folderID = this.props.args.item.folder;
    } else if (this.props.args.folder.safe) {
      folderID = this.props.args.folder.id;
    }
    const eData = passhubCrypto.encryptItem(pData, aesKey, { version: 5 });
    const data = {
      verifier: document.getElementById("csrf").getAttribute("data-csrf"),
      vault: SafeID,
      folder: folderID,
      encrypted_data: eData,
    };
    if (this.props.args.item) {
      data.entryID = this.props.args.item._id;
    }
    axios
      .post("items.php", data)
      .then((reply) => {
        const result = reply.data;
        if (result.status === "Ok") {
          this.props.onClose(true);
          return;
        }
        if (result.status === "login") {
          window.location.href = "expired.php";
          return;
        }
        if (result.status === "expired") {
          window.location.href = "expired.php";
          return;
        }
        this.setState({ errorMsg: result.status });
        return;
      })
      .catch((err) => {
        console.log("err ", err);
        this.setState({ errorMsg: "Server error. Please try again later" });
      });
  };

  copyToClipboard = (text) => {
    if (!this.state.edit) {
      copyToClipboard(text);
    }
  };

  onNumberChange = (e) =>
    this.setState({ ccNumber: e.target.value, errorMsg: "" });
  onNameChange = (e) => this.setState({ ccName: e.target.value, errorMsg: "" });
  onMonthSelect = (key, event) =>
    this.setState({ ccExpMonth: key, errorMsg: "" });
  onYearSelect = (key, event) =>
    this.setState({ ccExpYear: key, errorMsg: "" });

  render() {
    if (!this.props.show) {
      this.isShown = false;
      return null;
    }

    if (!this.isShown) {
      this.isShown = true;
      this.state.errorMsg = "";

      this.state.showPassword = false;
      if (this.props.args.item) {
        this.state.ccNumber = this.props.args.item.cleartext[3];
        this.state.ccName = this.props.args.item.cleartext[4];
        this.state.ccExpMonth = this.props.args.item.cleartext[5];
        this.state.ccExpYear = this.props.args.item.cleartext[6];
        this.state.ccCSC = this.props.args.item.cleartext[7];
        this.state.edit = false;
      } else {
        this.state.ccNumber = "0000 1111";
        this.state.ccName = "Gift";
        this.state.ccExpMonth = "Month";
        this.state.ccExpYear = "Year";
        this.state.ccCSC = "777";
        this.state.edit = true;
      }
    }

    const path = this.props.args.folder
      ? this.props.args.folder.path.join(" > ")
      : [];

    return (
      <ItemModal
        show={this.props.show}
        args={this.props.args}
        onClose={this.props.onClose}
        onEdit={this.onEdit}
        onSubmit={this.onSubmit}
        errorMsg={this.state.errorMsg}
      >
        <div className="itemModalField" style={{ marginBottom: 32 }}>
          <ItemModalFieldNav
            copy={!this.state.edit}
            name="Card number"
            for="cc-number"
          />
          <div>
            {this.state.edit ? (
              <input
                id="cc-number"
                onChange={this.onNumberChange}
                spellCheck={false}
                value={this.state.ccNumber}
              ></input>
            ) : (
              this.state.ccNumber
            )}
          </div>
        </div>
        <div className="itemModalField" style={{ marginBottom: 32 }}>
          <ItemModalFieldNav
            copy={!this.state.edit}
            name="Cardholder full name"
            for="cc-name"
          />
          <div>
            {this.state.edit ? (
              <input
                id="cc-name"
                onChange={this.onNameChange}
                spellCheck={false}
                value={this.state.ccName}
              ></input>
            ) : (
              this.state.ccName
            )}
          </div>
        </div>

        <div
          className="itemModalField"
          style={{
            marginBottom: 32,
            display: "flex",
            justifyContent: "space-between",
            overflow: "visible",
          }}
        >
          <div class="date-selector">
            <ItemModalFieldNav name="Expiration date" />
            <ButtonGroup>
              <DropdownButton
                variant="outline-secondary"
                size="sm"
                id="expMonth"
                title={this.state.ccExpMonth}
                onSelect={this.onMonthSelect}
              >
                {[
                  "01",
                  "02",
                  "03",
                  "04",
                  "05",
                  "06",
                  "07",
                  "08",
                  "09",
                  "10",
                  "11",
                  "12",
                ].map((m) => (
                  <Dropdown.Item eventKey={m}>{m}</Dropdown.Item>
                ))}
              </DropdownButton>

              <DropdownButton
                variant="outline-secondary"
                size="sm"
                id="expYear"
                title={this.state.ccExpYear}
                onSelect={this.onYearSelect}
              >
                {thirtyYears.map((y) => (
                  <Dropdown.Item eventKey={y}>{y}</Dropdown.Item>
                ))}
              </DropdownButton>
            </ButtonGroup>
          </div>
          <div>
            <ItemModalFieldNav name="Security code" for="cc-csc" />
            <div>
              {this.state.edit ? (
                <input
                  id="cc-csc"
                  type="password"
                  placeholder="000"
                  onChange={this.onCscChange}
                  spellCheck={false}
                  value={this.state.ccCSC}
                ></input>
              ) : (
                this.state.ccName
              )}
            </div>
          </div>
        </div>
      </ItemModal>
    );
  }
}

export default BankCardModal;

/*

        


        <div className="itemModalField" style={{ marginBottom: 32 }}>
          <ItemModalFieldNav name="Cardholder full name" for="cc-name" />
          <div>
            {this.state.edit ? (
              <input
                id="cc-name"
                onChange={this.onNameChange}
                spellCheck={false}
                value={this.state.ccName}
              ></input>
            ) : (
              this.state.ccName
            )}
          </div>
        </div>

        <div
          className="itemModalField"
          style={{
            marginBottom: 32,
            display: "flex",
            justifyContent: "space-between",
            overflow: "visible",
          }}
        >
          <div class="date-selector">
            <ItemModalFieldNav name="Expiration date" />
            <ButtonGroup>
              <DropdownButton
                variant="outline-secondary"
                size="sm"
                id="expMonth"
                title={this.state.ccExpMonth}
                onSelect={this.onMonthSelect}
              >
                {[
                  "01",
                  "02",
                  "03",
                  "04",
                  "05",
                  "06",
                  "07",
                  "08",
                  "09",
                  "10",
                  "11",
                  "12",
                ].map((m) => (
                  <Dropdown.Item eventKey={m}>{m}</Dropdown.Item>
                ))}
              </DropdownButton>

              <DropdownButton
                variant="outline-secondary"
                size="sm"
                id="expYear"
                title={this.state.ccExpYear}
                onSelect={this.onYearSelect}
              >
                {thirtyYears.map((y) => (
                  <Dropdown.Item eventKey={y}>{y}</Dropdown.Item>
                ))}
              </DropdownButton>
            </ButtonGroup>
          </div>
          <div>
            <ItemModalFieldNav name="Security code" for="cc-csc" />
            <div>
              {this.state.edit ? (
                <input
                  id="cc-csc"
                  type="password"
                  placeholder="000"
                  onChange={this.onCscChange}
                  spellCheck={false}
                  value={this.state.ccCSC}
                ></input>
              ) : (
                this.state.ccName
              )}
            </div>
          </div>
        </div>
        -->

*/
