let theItem = null;

let timer = null;

function peekCopyBuffer() {
  return theItem;
}

function isCopyBufferEmpty() {
  return theItem === null;
}

function popCopyBuffer() {
  const result = theItem;
  theItem = null;
  return result;
}

function putCopyBuffer(item) {
  theItem = item;
  if(timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(300*1000, function () {timer = null; theItem = null;})
}

export {
  peekCopyBuffer,
  isCopyBufferEmpty,
  popCopyBuffer,
  putCopyBuffer
};


