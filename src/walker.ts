import { addAttribute } from './attributes';
import { type Attrs, type TentNode } from './types';

function walker<A extends Attrs>(oldNode: TentNode<A>, newNode: TentNode<A>) {
  if (oldNode.tagName !== newNode.tagName) {
    oldNode.replaceWith(newNode);

    return;
  }

  const nc = Array.from(newNode.childNodes, (n) => n as TentNode<A>);
  const oc = Array.from(oldNode.childNodes, (n) => n as TentNode<A>);

  if (oldNode.nodeType === Node.TEXT_NODE) {
    if (oldNode.nodeValue !== newNode.nodeValue) {
      oldNode.nodeValue = newNode.nodeValue;
    }

    return;
  }

  // Remove attributes that are not present in the new node
  for (const key in oldNode.$tent.attributes) {
    if (newNode.$tent.attributes[key] == null) {
      delete oldNode.$tent.attributes[key];
      if (oldNode.hasAttribute(key)) {
        oldNode.removeAttribute(key);
      }
    }
  }

  // Add attributes that are not present in the old node
  const attrs = {
    ...oldNode.$tent.attributes,
    ...newNode.$tent.attributes,
  };

  for (const key in attrs) {
    addAttribute(oldNode, key, attrs[key]);
  }

  if (oc.length === 0 && nc.length === 0) {
    return;
  }

  if (oc.length < nc.length) {
    nc.forEach((x, index) => {
      if (oc[index] == null) {
        oldNode.append(x);
      }
    });
  }

  if (oc.length > nc.length) {
    oc.forEach((c, i) => {
      if (nc[i] == null) {
        c.remove();
      }
    });
  }

  oc.forEach((oChild, index) => {
    const nChild = nc[index];

    if (nChild == null) {
      return;
    }

    if (oChild.tagName !== nChild.tagName) {
      oChild.replaceWith(nChild);
    }

    walker(oChild, nChild);
  });
}

export { walker };
