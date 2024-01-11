function listenEvent(elem, event, callback, ...args) {
  var unlisten = null;
  if (elem.addEventListener) {
    elem.addEventListener(event, callback, ...args);
    unlisten = function () {
      elem.removeEventListener(event, callback);
    };
  } else {
    // IE 9
    elem.attachEvent("on" + event);
    unlisten = function () {
      elem.detachEvent("on" + event, callback);
    };
  }
  return unlisten;
}

function nodeIndexOf(node) {
  var silibings = node.parentNode.children;
  for (var i = 0; i < silibings.length; i++) {
    if (node === silibings[i]) {
      return i;
    }
  }
  return -1;
}
