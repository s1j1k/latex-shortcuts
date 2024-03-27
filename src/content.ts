import { shortcuts } from "./shortcuts";

// check for shortcut pattern after any key is released
document.addEventListener("keyup", (event) => {
  return onKeyUp(event);
});

// FIXME should we do with by checking inner HTML itself(?)

// allow the last inserted to be typed again
// TODO checking that it's also the same node (state tracking of last node)
export let lastInserted: string | undefined;

/**
 * Helper function to find the node which has that string in it
 * Return the node where the string is or null
 * @param searchString
 */
function findNodeWithString(searchString: string): {
  node: Node | null | undefined;
  idx: number;
} {
  let node = window.getSelection()?.anchorNode;
  let idx = node?.textContent?.lastIndexOf(searchString) ?? -1;
  if (idx === -1) {
    node = window.getSelection()?.anchorNode?.parentNode;
    idx = node?.textContent?.lastIndexOf(searchString) ?? -1;
  }
  return { node: node, idx: idx };
}

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
    const { node, idx } = findNodeWithString(lastInserted);
    if (node) {
      // allow } to be typed again after it gets inserted
      const re = RegExp(lastInserted + "(.*)");
      node.textContent =
        node.textContent?.replace(re, lastInserted) ?? String(node.textContent);
      // TODO move the caret two points to the right
      for (let i = 0; i < 2; i++) {
        window.getSelection()?.modify("move", "right", "character");
      }
      // FIXME more elegant solution
      lastInserted = undefined;
      return;
    }
  }

  if (lastInserted === "\\begin") {
    const { node, idx } = findNodeWithString(lastInserted);
    if (node) {
      // don't act if there's no change to the begin/end 
      if (node.textContent?.includes("\\begin{}") && node.textContent.includes("\\end{}")) {
        return;
      }
      // TODO check if we are currently typing inside brackets before proceeding 
      // TODO check the current caret position
      const anchorOffset = 
      if (node.textContent?.slice(idx).startsWith("\\begin{") || 
      node.textContent.anchorOffset

      // find what is in the begin environment
      const idx = node.textContent?.lastIndexOf("\\begin");
      // use regex to replace the last \end{*}
      // with envName from \begin{*}
      const re = /\\begin{([a-z]*)}(.*)\\end{([a-z]*)}/i;
      // replace 2nd group with first group
      const text = node.textContent?.slice(idx);
      const newText = text?.replace(re, "\\begin{$1}$2\\end{$1}");
      node.textContent = newText
        ? node.textContent?.substring(0, idx) + newText
        : node.textContent;
    }
    
    // FIXME restrict further where this acts
    // \begin{} \end{t}
    return; // don't proceed further 
  }

  for (const [key, value] of Object.entries(shortcuts)) {
    const { node, idx } = findNodeWithString(key);

    if (!node || idx === -1) {
      continue;
    }

    // make sure the shortcut is the very last part of the text content
    if (node?.textContent?.slice(idx) === key) {
      try {
        lastInserted = value(node);
        // apply one shortcut at a time
        break;
      } catch {}
    }
  }
}

// TODO test more scenarios in Notion
// TODO make it easy to turn the extension on/off for different sites
