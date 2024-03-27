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

/**
 * Helper function to move the caret position right by n spaces
 * @param n
 */
function shiftCaretRight(n: number): void {
  for (let i = 0; i < n; i++) {
    window.getSelection()?.modify("move", "right", "character");
  }
}

function onKeyUp(event: KeyboardEvent): void {
  // only act on standard keys
  if (event.key.length > 1) {
    return;
  }

  // for a single symbol
  // check the last inserted only once, then clear it 
  // (you only get one chance to type over top of it)
  const currentLastInserted = lastInserted;
  if (lastInserted && lastInserted.length === 1) {
    lastInserted = undefined;
  }

  // analyse the text content

  // if we type a single key we just inserted, delete it and move the caret forward
  // TODO allow re typing the whole word (type over with no effect)

  // allow typing the just inserted symbol 2 times
  if (currentLastInserted && currentLastInserted.length === 1 && event.key === currentLastInserted) {
    const { node, idx } = findNodeWithString(currentLastInserted);
    if (node) {
      console.log(
        "Remove any additional entry for last inserted shortcut: ",
        lastInserted
      );
      // make sure it's the very last thing entered
      node?.textContent?.slice(idx) === currentLastInserted + currentLastInserted;
      // change to just one entry
      node.textContent = node.textContent?.substring(0, idx) + currentLastInserted;
      // TODO move the caret two points to the right (or more?)
      //shiftCaretRight(2);
      shiftCaretRight(node.textContent.length);
      // FIXME more elegant solution
      // don't track this symbol again
      // lastInserted = undefined;
      return;
    }
  }

  if (lastInserted === "\\begin") {
    const { node, idx } = findNodeWithString(lastInserted);
    if (node) {
      // act if one has been changed
      if (
        node.textContent?.match("\\begin{([a-z]+)}") ||
        node.textContent?.match("\\end{([a-z]+)}")
      ) {
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
        // TODO move caret to where it was
        shiftCaretRight(node.textContent?.length ?? 0);
      }

      // FIXME restrict further where this acts as needed
      return; // don't proceed further
    }
    // TODO check if we are currently typing inside brackets before proceeding
    // TODO check the current caret position
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
