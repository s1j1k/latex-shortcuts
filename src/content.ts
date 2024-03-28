// helpers for \begin{**} \end{**} shortcut
const re1 = /\\begin{([a-z]*)}(.*)\\end{}/i;
const re2 = /\\begin{([a-z]*)}(.*)\\end{([a-z]*)}/i;
const re3 = /\\begin{}(.*)\\end{([a-z]*)}/i;

// check for shortcut pattern after any key is released
document.addEventListener("keyup", (event) => {
  try {
    onKeyUp(event);
  } catch {
    // do nothing
  }
});

function insertString(node: Node, offset: number, str: string): void {
  node.textContent =
    node.textContent?.substring(0, offset) +
    str +
    node.textContent?.substring(offset!);
}

function onKeyUp(event: KeyboardEvent): void {
  // only act on standard keys
  if (event.key.length > 1 && event.key !== "Backspace") {
    return;
  }

  const selection = window.getSelection();
  if (!selection) {
    return;
  }

  const offset = selection.focusOffset;
  const node = selection.focusNode;

  if (node === undefined || node === null || (!offset && offset !== 0)) {
    return;
  }

  // FIXME caret position in the block equation when first opening is not working

  /**
   * if we insert a "{", insert a subsequent "}" -> done
   * allow nested -> done
   * allow to type over -> pending
   */
  if (event.key === "{") {
    insertString(node, offset, "}");
    // note the caret resets to the start of the node when we set the text content
    // move the caret over
    selection.setPosition(node, offset);
    return;
    // TODO allow to type over - handle block eq as well
  }

  // look for shortcut \beg
  const shortcut = "\\beg";
  if (
    event.key == "g" &&
    node.textContent?.substring(offset - shortcut.length, offset) === shortcut
  ) {
    insertString(node, offset, "in{} \\end{}");
    selection.setPosition(node, offset + 3);
    return;
  }

  // check if inside a Notion block equation \begin{**} or \end{**}
  const inBlockEqKeyword = node.parentElement?.className === "token keyword";

  // replace latex env name for \begin{**} -> \end{**}
  if (
    node.textContent?.slice(0, offset).match(/\\begin{[a-z]*$/i) ||
    inBlockEqKeyword
  ) {
    
    const editingNode = inBlockEqKeyword ? node.parentNode?.parentNode : node;
    const text = editingNode?.textContent;

    const getEndNode = () => {
      const childNodes = [...editingNode?.childNodes!];
      // @ts-ignore
      const idx = [childNodes].indexOf(node);
      // @ts-ignore
      return childNodes.slice(idx + 1).find((childNode) => {childNode.className === "token keyword"})
    }
    const endNode = inBlockEqKeyword ? getEndNode() : undefined;
    const envName = inBlockEqKeyword ? node.textContent! : undefined;


    if (text && editingNode) {
      if (text.match(re1)) {
        // \begin{**} \end{} -> fill up \end{}
        // FIXME for block equation find the nearest "token keyword" and replace it there
        // don't edit the parent node directly to preserve caret position logic 
        if (inBlockEqKeyword) {
          // FIXME does this work?
          endNode!.textContent = envName!;
        } else {
          editingNode.textContent = text?.replace(re1, "\\begin{$1}$2\\end{$1}");
        }
      } else if (text.match(re2)) {
        // \begin{**} \end{**} -> make \end{} match
        if (inBlockEqKeyword) {
          endNode!.textContent = envName!;
        } else {
        editingNode.textContent = text?.replace(re2, "\\begin{$1}$2\\end{$1}");
        }
      } else if (text.match(re3)) {
        // \begin{} \end{**} -> empty the end tag fully
        // FIXME does this work
        if (inBlockEqKeyword) {
          endNode!.textContent = envName!;
        } else {
        editingNode.textContent = text?.replace(re2, "\\begin{}$2\\end{}");
        }
      }
    }
    // FIXME caret position in block equation is wrong 
    // move the caret position back
    // note for block equation original node has been deleted, use node & offset 
    // to find a search string & move the caret there
    selection.setPosition(node, offset);

    return;
  }
}
