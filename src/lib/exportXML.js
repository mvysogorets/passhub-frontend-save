import * as utils from "./utils";

let xml = '';

function dump_item(item, indent) {
  if (item.hasOwnProperty('file')) {
    return;
  }

  xml += indent + '<Entry>\r\n';
  const id1 = indent + '    ';
  const id2 = id1 + '    ';

  if (item.hasOwnProperty('lastModified')) {
    xml += id1 + '<Times>\r\n';
    xml += id2 + '<LastModificationTime>' + utils.escapeHtml(item.lastModified) + '</LastModificationTime>\r\n';
    xml += id1 + '</Times>\r\n';
  }

  if (item.cleartext[4] != '') {
    xml += id1 + '<String>\r\n';
    xml += id2 + '<Key>Notes</Key>\r\n';
    xml += id2 + '<Value>' + utils.escapeHtml(item.cleartext[4]) + '</Value>\r\n';
    xml += id1 + '</String>\r\n';
  }
  if (item.cleartext[2] != '') {
    xml += id1 + '<String>\r\n';
    xml += id2 + '<Key>Password</Key>\r\n';
    xml += id2 + '<Value ProtectInMemory="True">' + utils.escapeHtml(item.cleartext[2]) + '</Value>\r\n';
    xml += id1 + '</String>\r\n';
  }
  if (item.cleartext[0] != '') {
    xml += id1 + '<String>\r\n';
    xml += id2 + '<Key>Title</Key>\r\n';
    xml += id2 + '<Value>' + utils.escapeHtml(item.cleartext[0]) + '</Value>\r\n';
    xml += id1 + '</String>\r\n';
  }
  if (item.cleartext[3] != '') {
    xml += id1 + '<String>\r\n';
    xml += id2 + '<Key>URL</Key>\r\n';
    xml += id2 + '<Value>' + utils.escapeHtml(item.cleartext[3]) + '</Value>\r\n';
    xml += id1 + '</String>\r\n';
  }
  if (item.cleartext[1] != '') {
    xml += id1 + '<String>\r\n';
    xml += id2 + '<Key>UserName</Key>\r\n';
    xml += id2 + '<Value>' + utils.escapeHtml(item.cleartext[1]) + '</Value>\r\n';
    xml += id1 + '</String>\r\n';
  }
  if (item.hasOwnProperty('note')) {
    xml += id1 + '<String>\r\n';
    xml += id2 + '<Key>Note</Key>\r\n';
    xml += id2 + '<Value>' + 1 + '</Value>\r\n';
    xml += id1 + '</String>\r\n';
  }
  if (item.cleartext.length == 6) {
    xml += id1 + '<String>\r\n';
    xml += id2 + '<Key>TOTP</Key>\r\n';
    xml += id2 + '<Value>' + utils.escapeHtml(item.cleartext[5]) + '</Value>\r\n';
    xml += id1 + '</String>\r\n';
  }
  xml += indent + '</Entry>\r\n';
}

function exportFolder(folder, indent) {
  xml += indent + '<Group>\r\n';
  if(folder.safe) {
    xml += indent + '    <Name>' + utils.escapeHtml(folder.cleartext[0]) + '</Name>\r\n';
  } else {
    xml += indent + '    <Name>' + utils.escapeHtml(folder.name) + '</Name>\r\n';
  }

  for (let i = 0; i < folder.items.length; i++) {
      dump_item(folder.items[i], indent + '    ');
  }

  for (let i = 0; i < folder.folders.length; i++) {
    exportFolder(folder.folders[i], indent + '    ');
  }
  xml += indent + '</Group>\r\n';
}

function exportXML(folder) {
  xml = '<?xml version="1.0" encoding="utf-8" standalone="yes"?>\r\n<KeePassFile>\r\n    <Root>\r\n';
  xml += '        <Group>\r\n';
  xml += '            <Name>Passhub</Name>\r\n';

  if(Array.isArray(folder)) {
    for (let s = 0; s < folder.length; s++) {
      exportFolder(folder[s], '            ');
    }
  } else {
    exportFolder(folder, '            ');
  }
  xml += '        </Group>\r\n';  
  xml += '     </Root>\r\n</KeePassFile>\r\n';

  const blob = new Blob([xml], { type: 'text/xml' });
  return blob;
}

export default exportXML;
