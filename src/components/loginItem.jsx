import React, { Component } from "react";

class LoginItem extends Component {
  state = {};
  showModal = () => {
    this.props.showModal(this.props.item);
  };
  render() {
    const item = this.props.item;
    const modified = new Date(item.lastModified).toLocaleString();
    return (
      <tr>
        <td onClick={this.showModal}>{item.cleartext[0]}</td>
        <td>{item.cleartext[1]}</td>
        <td>{item.cleartext[3]}</td>
        <td className="rightAlign">{modified}</td>
      </tr>
    );
  }
}

export default LoginItem;
