import React, { Component } from "react";

import { contextMenu, Menu, Item, Separator, Submenu } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";

class SafeUSer extends Component {
  state = {};

  handleRoleMenuClick = (cmd, e) => {
    let role = "readonly";
    if (cmd == "Can edit") {
      role = "editor";
    }
    if (cmd == "Safe owner") {
      role = "administrator";
    }
    if (cmd == "Remove") {
      role = "Remove";
    }

    this.props.setUserRole(this.props.user.name, role);
  };

  safeUserMenu = (
    <Menu id={"safe-user-menu"}>
      <Item
        onClick={(e) => {
          this.handleRoleMenuClick("Can view", e);
        }}
      >
        <div>
          <div>Can view</div>
          <div
            style={{
              fontSize: "13px",
              opacity: "0.5",
              maxWidth: "17em",
              whiteSpace: "break-spaces",
            }}
          >
            User can only view records and download files
          </div>
        </div>
      </Item>
      <Item onClick={(e) => this.handleRoleMenuClick("Can edit", e)}>
        <div>
          <div>Can Edit</div>
          <div
            style={{
              fontSize: "13px",
              opacity: "0.5",
              maxWidth: "17em",
              whiteSpace: "break-spaces",
            }}
          >
            User can edit, delete, and add files to the Safe
          </div>
        </div>
      </Item>
      <Item
        onClick={(e) => {
          this.handleRoleMenuClick("Safe owner", e);
        }}
      >
        <div>
          <div>Safe owner</div>
          <div
            style={{
              fontSize: "13px",
              opacity: "0.5",
              maxWidth: "17em",
              whiteSpace: "break-spaces",
            }}
          >
            Additionaly can share safe and manage user access rights
          </div>
        </div>
      </Item>
      <Item onClick={(e) => this.handleRoleMenuClick("Remove", e)}>
        <div style={{ color: "#B40020", fontWeight: "bold" }}>Remove</div>
      </Item>
    </Menu>
  );

  showSafeUserMenu = (e) => {
    contextMenu.show({ id: "safe-user-menu", event: e });
  };

  render() {
    let role = "can view";
    if (this.props.user.role == "editor") {
      role = "can edit";
    }
    if (this.props.user.role == "administrator") {
      role = "owner";
    }
    return this.props.user.myself ? (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
          fontWeight: "normal",
        }}
      >
        <div>
          Me &#183;{" "}
          <span style={{ color: "#8D8D94" }}>{this.props.user.name}</span>
        </div>
        <div style={{ marginRight: role == "owner" ? "40px" : 0 }}>{role}</div>
      </div>
    ) : (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div>{this.props.user.name}</div>
        {this.safeUserMenu}
        {this.props.isAdmin ? (
          <div className="roleChanger" onClick={this.showSafeUserMenu}>
            {role}

            <svg
              width="24"
              height="24"
              style={{
                verticalAlign: "top",
                fill: "#009A50",
              }}
            >
              <use href="#angle"></use>
            </svg>
          </div>
        ) : (
          <div>{role}</div>
        )}
      </div>
    );
  }
}

export default SafeUSer;
