function buildDom(root) {
  if (Array.isArray(root)) {
    return root.map(elem => buildDom(elem));
  }
  const rootElem = document.createElement(root.tagName);
  for (const key in root) {
    switch (key) {
      case "tagName":
        // this case is handled above
        break;
      case "alt":
        rootElem[key] = root[key] || " ";
        break;
      default:
        if (root[key] !== "") {
          rootElem[key] = root[key];
        }
        break;
    }
  }
  if (root.children) {
    rootElem.append(...root.children.map(n => buildDom(n)));
  }
  return rootElem;
}