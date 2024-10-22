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

  if (oldNode.$tent == null || newNode.$tent == null) {
    oldNode.replaceWith(newNode);

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

  if (oc.length === 0 && nc.length === 0) return;
  if (oldNode.$tent.attributes.keep) return;
  if (oldNode.$tent.isComponent) return;

  if (oc.length < nc.length) {
    for (let i = 0; i < nc.length; i++) {
      if (oc[i] == null) {
        oldNode.append(nc[i]);
      }
    }
  }

  if (oc.length > nc.length) {
    for (let i = 0; i < oc.length; i++) {
      if (nc[i] == null) {
        oc[i].remove();
      }
    }
  }

  for (let i = 0; i < oc.length; i++) {
    const oChild = oc[i];
    const nChild = nc[i];

    if (nChild == null) continue;

    if (oChild.tagName !== nChild.tagName) {
      oChild.replaceWith(nChild);
    }

    walker(oChild, nChild);
  }
}

export { walker };
