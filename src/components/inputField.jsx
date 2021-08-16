import React, { Component } from "react";

class InputField extends Component {
  state = {};
  render() {
    return (
      <div
        className="itemModalField"
        style={{
          padding: "11px 16px",
          marginBottom: "16px",
          cursor: this.props.onClick ? "pointer" : "",
        }}
        onClick={this.props.onClick}
      >
        {(this.props.value.length ||
          this.props.children ||
          !this.props.edit) && (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontSize: "14px" }}>
              <span style={{ opacity: "0.5" }}>
                <label htmlFor={this.props.id} style={{ margin: 0 }}>
                  {this.props.value.length ? this.props.label : ""}
                </label>
              </span>
            </div>
            <div>{this.props.children}</div>
          </div>
        )}

        <div>
          <input
            id={this.props.id}
            onChange={this.props.onChange}
            readOnly={!this.props.edit}
            spellCheck={false}
            value={this.props.value}
            placeholder={this.props.label}
          ></input>
        </div>
      </div>
    );
  }
}

export default InputField;
