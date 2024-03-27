import { shortcuts } from "./shortcuts";

// check for shortcut pattern after any key is released
document.addEventListener("keyup", (event) => {
  return onKeyUp(event);
});

// FIXME should we do with by checking inner HTML itself(?)

// allow the last inserted to be typed again
// TODO checking that it's also the same node (state tracking of last node)
let lastInserted: string | undefined; 

function onKeyUp(event: KeyboardEvent): void {
  // only act on space
  // const keyName = event.key;
  // if (keyName != " ") {
  //   return;
  // }
  // TODO confirm we are in a latex block

  // analyse the text content
  const text = window.getSelection()?.anchorNode?.textContent ?? "";
  if (text === "") {
    return;
  }

  // if we type a single key we just inserted, delete it
  // TODO allow re typing the whole word (type over with no effect)
  if (lastInserted && lastInserted.length === 1 && event.key === lastInserted) {
    let node = window.getSelection()?.anchorNode;
    let idx = text.lastIndexOf(lastInserted);
    if (idx === -1) {
      node = window.getSelection()?.anchorNode?.previousSibling;
      idx = node?.textContent?.lastIndexOf(lastInserted) ?? -1;
    }

    // allow } to be typed again after it gets inserted
    const re = RegExp(lastInserted+"(.*)")
    node!.textContent = node?.textContent?.replace(re, lastInserted) ?? String(node?.textContent);

    lastInserted = undefined;

  }

  for (const [key, value] of Object.entries(shortcuts)) {
    let node = window.getSelection()?.anchorNode;
    let idx = text.lastIndexOf(key);

    //const node = window.getSelection()?.anchorNode;

    if (idx === -1) {
      // try the previous sibling
      console.log("Not found in selected anchor node, check previous sibling")
      node = window.getSelection()?.anchorNode?.previousSibling;
      idx = node?.textContent?.lastIndexOf(key) ?? -1;
      if (idx === -1) {
        continue;
      }
    }

    // make sure the shortcut is the very last part of the text content
    if (node?.textContent?.slice(idx) === key)
      // FIXME delete
      console.log("Shortcut ", key, " detected in buffer!");
      console.log(node?.textContent)
      console.log(node)
    try {
      // @ts-ignore
      lastInserted = value(node);
      // apply one shortcut at a time
      break;
      //window.getSelection().anchorNode.textContent = text.replace(key, value());
    } catch {}
  }
}

// TODO test more scenarios in Notion

// TODO make it easy to turn the extension on/off for different sites
