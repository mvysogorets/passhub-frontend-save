import React, { Component } from "react";

import Col from "react-bootstrap/Col";
import FolderTreeNode from "./folderTreeNode";

/*
function setSelected(nodes, id) {
  let r = nodes.map((s) => {
    const result = {};

    result.isCurrent = s.id === id ? true : false;

    for (let p in s) {
      if (p !== "children") {
        if (p !== "isCurrent") {
          result[p] = s[p];
        }
      } else {
        result[p] = setSelected(s[p], id);
      }
    }
    return result;
  });
  return r;
}
*/

class SafePane extends Component {
  state = {
    openNodes: new Set(),
  };

  handleSelect = (id) => {
    this.props.setActiveFolder(id);
  };

  handleOpen = (id) => {
    const openNodesCopy = new Set(this.state.openNodes);
    if (this.state.openNodes.has(id)) {
      openNodesCopy.delete(id);
    } else {
      openNodesCopy.add(id);
    }
    this.setState({ openNodes: openNodesCopy });
  };

  componentDidMount() {
    console.log("safePane mounted");
  }

  render() {
    return (
      <Col
        className="col-xl-3 col-lg-4 col-md-5 col-12 vaults_pane"
        style={{
          background: "rgba(27, 27, 38, 0.86)",
          color: "white",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: 0,
          borderRadius: "16px 0 0 16px",
        }}
      >
        <div
          style={{
            overflowY: "auto",
            paddingTop: "16px" /* marginLeft: "-20px" */,
          }}
        >
          {this.props.safes.map((s) => (
            <FolderTreeNode
              key={s.id}
              onSelect={this.handleSelect}
              onOpen={this.handleOpen}
              node={s}
              open={this.state.openNodes.has(s.id) && this.state.openNodes}
              activeFolder={this.props.activeFolder}
              isSafe={true}
            />
          ))}
        </div>
      </Col>
    );
  }
}

export default SafePane;

/*
    safes: [
      {
        name: "safe10",
        id: 10,
        children: [
          {
            name: "folder112",
            id: 112,
            children: [
              {
                name: "folder1112",
                id: 1112,
                isCurrent: true,
                children: [],
              },
            ],
          },
          {
            name: "folder114",
            id: 114,
          },
        ],
      },
      {
        name: "safe11",
        id: 11,
        isSharedSafe: true,
        children: [],
      },
      {
        name: "safe12",
        id: 12,
        isSharedSafe: true,
        children: [],
      },
      {
        name: "safe13",
        id: 13,
        isSharedSafe: true,
        children: [],
      },
      {
        name: "safe14",
        id: 14,
        isSharedSafe: true,
        children: [],
      },
      {
        name: "safe15",
        id: 15,
        isSharedSafe: true,
        children: [],
      },
      {
        name: "safe16",
        id: 16,
        isSharedSafe: true,
        children: [],
      },
    ],

*/
/*
function getChildren(folders, parent) {
  const result = [];
  for (let f = 0; f < folders.length; f++) {
    if (folders[f].parent == parent) {
      const child = {};
      //      child.name = utils.escapeHtml(folders[f].cleartext[0]);
      child.name = folders[f].cleartext[0];
      child.id = folders[f]._id;
      // child.icon = folderIcon;
      const children = getChildren(folders, folders[f]._id);
      if (children.length > 0) {
        child.children = children;
      }
      result.push(child);
    }
  }
  return result;
}
*/
/*
    const data = [];

    for (let i = 0; i < this.props.safes.length; i++) {
      const safe = this.props.safes[i];
      const children = getChildren(safe.folders, 0);
      if (children.length > 0) {
        safe.children = children;
      }
    }
    */
