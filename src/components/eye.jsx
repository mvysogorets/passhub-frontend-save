import React, { Component } from "react";

class Eye extends React.Component {
  state;
  render() {
    return (
      <div style={{ marginLeft: "8px" }}>
        <svg
          fill="none"
          style={{ width: 32, height: 32, marginBottom: -5, cursor: "pointer" }}
          onClick={this.props.onClick}
        >
          {this.props.hide ? (
            <use href="#eye"></use>
          ) : (
            <use href="#eye-off"></use>
          )}
        </svg>
      </div>
    );
  }
  state;
}

export default Eye;

/* 
          hide={this.props.hide}

          */
