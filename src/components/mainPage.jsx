import React, { Component } from "react";
import axios from "axios";
import IdleTimer from "react-idle-timer";
/*
import {
  getPrivateKey,
  decryptAesKey,
  decodeItem,
  decodeFolder,
} from "../lib/crypto";
*/
import * as passhubCrypto from "../lib/crypto";
import { keepTicketAlive } from "../lib/utils";

import SafePane from "./safePane";
import TablePane from "./tablePane";
import IdleModal from "./idleModal";

function decryptSafeData(aesKey, safe) {
  for (let i = 0; i < safe.items.length; i += 1) {
    safe.items[i].cleartext = passhubCrypto.decodeItem(safe.items[i], aesKey);
  }

  for (let i = 0; i < safe.folders.length; i += 1) {
    safe.folders[i].cleartext = passhubCrypto.decodeFolder(
      safe.folders[i],
      aesKey
    );
  }
}

function decryptSafes(eSafes) {
  // console.log("xxx");
  const promises = [];
  for (let i = 0; i < eSafes.length; i++) {
    const safe = eSafes[i];
    if (safe.key) {
      promises.push(
        passhubCrypto.decryptAesKey(safe.key).then((bstringKey) => {
          safe.bstringKey = bstringKey;
          return decryptSafeData(bstringKey, safe);
        })
      );
    }
  }
  return Promise.all(promises);
}
function normalizeFolder(folder, items, folders) {
  folder.name = folder.cleartext[0];
  folder.id = folder._id;
  folder.path = [...folder.path, folder.cleartext[0]];

  folder.items = [];
  for (const item of items) {
    if (item.folder === folder.id) {
      folder.items.push(item);
      item.path = folder.path;
    }
  }
  folder.items.sort((a, b) =>
    a.cleartext[0].toLowerCase().localeCompare(b.cleartext[0].toLowerCase())
  );

  folder.folders = [];
  for (const f of folders) {
    if (f.parent === folder.id) {
      folder.folders.push(f);
      f.path = folder.path;
      f.safe = folder.safe;
      normalizeFolder(f, items, folders);
    }
  }
  folder.folders.sort((a, b) =>
    a.cleartext[0].toLowerCase().localeCompare(b.cleartext[0].toLowerCase())
  );
}

function normalizeSafes(safes) {
  for (const safe of safes) {
    safe.rawItems = safe.items;
    safe.path = [safe.name];
    safe.items = [];
    for (const item of safe.rawItems) {
      if (!item.folder || item.folder == "0") {
        safe.items.push(item);
        item.path = [safe.name];
      }
    }
    safe.items.sort((a, b) =>
      a.cleartext[0].toLowerCase().localeCompare(b.cleartext[0].toLowerCase())
    );

    safe.rawFolders = safe.folders;
    safe.folders = [];
    for (const folder of safe.rawFolders) {
      if (!folder.parent || folder.parent == "0") {
        safe.folders.push(folder);
        folder.path = [safe.name];
        folder.safe = safe;
        normalizeFolder(folder, safe.rawItems, safe.rawFolders);
      }
    }
    safe.folders.sort((a, b) =>
      a.cleartext[0].toLowerCase().localeCompare(b.cleartext[0].toLowerCase())
    );
  }
}

function getFolderById(folderList, id) {
  for (const folder of folderList) {
    if (folder.id === id) {
      return folder;
    }
    const f = getFolderById(folder.folders, id);
    if (f) {
      return f;
    }
  }
  return null;
}

class MainPage extends Component {
  state = {
    safes: [],
    activeFolder: 0,
    idleTimeoutAlert: false,
  };

  /*
  getFolderContent = (folderId) => {
    const folder = getFolderById(this.state.safes, folderId);
    if (folder) {
      return { folders: folder.folders, items: folder.items };
    }
    return { folders: [], items: [] };
  };
*/

  setActiveFolder = (id) => {
    this.setState({ activeFolder: id });
  };

  refreshUserData = () => {
    const self = this;
    axios
      .post("../get_user_datar.php", {
        verifier: document.getElementById("csrf").getAttribute("data-csrf"),
      })
      .then((result) => {
        if (result.data.status === "Ok") {
          const data = result.data.data;
          const safes = data.safes;
          return decryptSafes(safes).then(() => {
            safes.sort((a, b) =>
              a.name.toLowerCase().localeCompare(b.name.toLowerCase())
            );
            normalizeSafes(safes);
            self.setState({ safes, activeFolder: data.currentSafe });
          });
        }
        if (result.data.status === "login") {
          window.location.href = "expired.php";
          return;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getPageData = () => {
    const self = this;
    axios
      .post("../get_user_datar.php", {
        verifier: document.getElementById("csrf").getAttribute("data-csrf"),
      })
      .then((result) => {
        if (result.data.status === "Ok") {
          const data = result.data.data;

          passhubCrypto.getPrivateKey(data).then(() => {
            return decryptSafes(data.safes).then(() => {
              data.safes.sort((a, b) =>
                a.name.toLowerCase().localeCompare(b.name.toLowerCase())
              );
              normalizeSafes(data.safes);
              data.activeFolder = data.currentSafe;
              self.setState(data);
              keepTicketAlive(data.WWPASS_TICKET_TTL, data.ticketAge);

              /*
              self.setState({
                safes: data.safes,
                activeFolder: data.currentSafe,
              });
              */
            });
          });
        }
        if (result.data.status === "login") {
          window.location.href = "expired.php";
          return;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  componentDidMount() {
    console.log("mainPage mounted");
    this.getPageData();
  }

  handleOnIdle = () => {
    this.setState({ idleTimeoutAlert: true });

    this.logoutTimer = setTimeout(() => {
      document.location.href = "logout.php";
    }, 60 * 1000);

    console.log("handleOnIdle");
  };
  onActive() {
    console.log("userIactive");
  }

  onIdleModalClose = () => {
    console.log("onIdleModalClose");
    this.setState({ idleTimeoutAlert: false });
    clearTimeout(this.logoutTimer);
  };

  render() {
    const activeFolder =
      this.state.safes.length === 0 ? 0 : this.state.activeFolder;

    const idleTimeout =
      "idleTimeout" in this.state ? this.state.idleTimeout : 0;

    return (
      <React.Fragment>
        <SafePane
          safes={this.state.safes}
          setActiveFolder={this.setActiveFolder}
          activeFolder={activeFolder}
          refreshUserData={this.refreshUserData}
        />
        <TablePane folder={getFolderById(this.state.safes, activeFolder)} />

        {"idleTimeout" in this.state && (
          <div>
            Here I am, the idle timer {idleTimeout}
            <IdleTimer
              ref={(ref) => {
                this.idleTimer = ref;
              }}
              timeout={/*this.state.idleTimeout*/ idleTimeout * 1000}
              onIdle={this.handleOnIdle}
              onActive={this.onActive}
              debounce={250}
            />
          </div>
        )}

        <IdleModal
          show={this.state.idleTimeoutAlert}
          onClose={this.onIdleModalClose}
        ></IdleModal>
      </React.Fragment>
    );
  }
}

export default MainPage;
