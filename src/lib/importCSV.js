

// thanks to Ben Nadel: 
// https://www.bennadel.com/blog/1504-ask-ben-parsing-csv-strings-with-javascript-exec-regular-expression-command.htm

function CSVToArray( strData, strDelimiter ){
  // Check to see if the delimiter is defined. If not,
  // then default to comma.
  strDelimiter = (strDelimiter || ",");

  // Create a regular expression to parse the CSV values.
  var objPattern = new RegExp(
    (
      // Delimiters.
      "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

      // Quoted fields.
      "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

      // Standard fields.
      "([^\"\\" + strDelimiter + "\\r\\n]*))"
    ),
    "gi"
    );


  // Create an array to hold our data. Give the array
  // a default empty first row.
  var arrData = [[]];

  // Create an array to hold our individual pattern
  // matching groups.
  var arrMatches = null;


  // Keep looping over the regular expression matches
  // until we can no longer find a match.
  while (arrMatches = objPattern.exec( strData )){

    // Get the delimiter that was found.
    var strMatchedDelimiter = arrMatches[ 1 ];

    // Check to see if the given delimiter has a length
    // (is not the start of string) and if it matches
    // field delimiter. If id does not, then we know
    // that this delimiter is a row delimiter.
    if (
      strMatchedDelimiter.length &&
      (strMatchedDelimiter != strDelimiter)
      ){

      // Since we have reached a new row of data,
      // add an empty row to our data array.
      arrData.push( [] );

    }


    // Now that we have our delimiter out of the way,
    // let's check to see which kind of value we
    // captured (quoted or unquoted).
    if (arrMatches[ 2 ]){

      // We found a quoted value. When we capture
      // this value, unescape any double quotes.
      var strMatchedValue = arrMatches[ 2 ].replace(
        new RegExp( "\"\"", "g" ),
        "\""
        );

    } else {

      // We found a non-quoted value.
      var strMatchedValue = arrMatches[ 3 ];

    }


    // Now that we have our value string, let's add
    // it to the data array.
    arrData[ arrData.length - 1 ].push( strMatchedValue );
  }

  // Return the parsed data.
  if(arrData.length > 0) {
    if( (arrData[arrData.length-1].length === 1) &&(arrData[arrData.length-1] === '')) {
      arrData.pop();
    }
  }
  return( arrData );
}


function findFolder(folders, path) {
  for (let f = 0; f < folders.length; f++) {
    if (folders[f].name == path[0]) {
      if (path.length === 1) {
        return folders[f];
      }
      path.shift();
      return findFolder(folders[f].folders, path);
    }
  }
  // not found
  const folder = { name: path[0], folders: [], entries: [] };
  folders.push(folder);
  if (path.length === 1) {
    return folder;
  }
  path.shift();
  return findFolder(folder.folders, path);
}

function addRecordToSafe(safe, record, path) {
  if (path.length === 0) {
    safe.entries.push(record);
    return;
  }
  const folder = findFolder(safe.folders, path);
  folder.entries.push(record);
}


function addRecord(safes, r) {
  const path = r.shift().split('/');
  // check_limits_on_import(r); // raises exception
  for (let s = 0; s < safes.length; s++) {
    if (safes[s].name == path[0]) {
      path.shift();
      addRecordToSafe(safes[s], { cleartext: r, options: {} }, path);
      return;
    }
  }
  // no such safe
  const safe = { name: path[0], folders: [], entries: [] };
  safes.push(safe);
  path.shift();
  addRecordToSafe(safe, { cleartext: r, options: {} }, path);
}

function importCSV(text) {

  let data  = CSVToArray(text);

  const safes = [];

  const titles = data.shift();

  if (titles.length === 1) { // dashline?
    const t = data.shift();
    data.unshift(t);
    if (t.length === 7) {
      data.forEach((e) => {
        if (e.length === 7) {
          const e1 = [titles[0], e[0], e[2], e[5], e[1], e[6]];
          addRecord(safes, e1);
        }
      });
      return safes;
    }
  }

  // url,username,password,extra,name,grouping,fav -- lastpass
  if ((titles.length === 7)
    && (titles[0] === 'url')
    && (titles[1] === 'username')
    && (titles[2] === 'password')
    && (titles[3] === 'extra')
    && (titles[4] === 'name')
    && (titles[5] === 'grouping')
    && (titles[6] === 'fav')) {

    data.forEach((e) => {
      if(e.length === 7) {
        addRecord(safes, ['lastpass', e[4], e[1], e[2], e[0], e[3]]);
      }
    });
    return safes;
  }

  if ((titles.length === 4) // chrome
    && (titles[0] === 'name')
    && (titles[1] === 'url')
    && (titles[2] === 'username')
    && (titles[3] === 'password')) {
    // chrome
    data.forEach((e) => {
      if(e.length === 4) {
        const e1 = ['chrome', e[0], e[2], e[3], e[1], ''];
        addRecord(safes, e1);
      }
    });
    return safes;
  }

  if ((titles.length === 9) // firefox
    && (titles[0] === 'url')
    && (titles[1] === 'username')
    && (titles[2] === 'password')
    && (titles[3] === 'httpRealm')
    && (titles[4] === 'formActionOrigin')
    && (titles[5] === 'guid')
    && (titles[6] === 'timeCreated')
    && (titles[7] === 'timeLastUsed')
    && (titles[8] === 'timePasswordChanged')
    ) {
    // firefox
    data.forEach((e) => {
      if(e.length === 9) {
        const url = new URL(e[0]);
        const hostname = url.hostname;
        const e1 = ['firefox', hostname, e[1], e[2], e[0], ''];
        addRecord(safes, e1);
      }
    });
    return safes;
  }
  
  if (titles.length !== 6) {
    throw new Error('Unknown file format');
  }
  // KeePassX
  data.forEach((e) => {
    if(e.length === 6) {
      addRecord(safes, e);
    }
  });
  return safes;

}


export default importCSV;
