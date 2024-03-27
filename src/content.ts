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

  // if we insert a "{", insert a subsequent "}"
  // allow nested
  // allow to type over
  if (event.key === "{") {
    insertString(node, offset, "}");
    // note the caret resets to the start of the node when we set the text content
    // move the caret over
    selection.setPosition(node, offset);
    return;
  }

  // TODO modularize
  // look for shortcut \beg
  const shortcut = "\\beg";
  if (
    node.textContent?.substring(offset - shortcut.length, offset) === shortcut
  ) {
    insertString(node, offset, "in{} \\end{}");
    selection.setPosition(node, offset + 3);
    return;
  }

  // replace latex env name for \begin{**} -> \end{**}
  if (
    node.textContent?.slice(0,offset).match(/\\begin{[a-z]+$/i)
    // TODO check that the next character after the caret is } ??
  ) {
    // find the begin just before the caret position
    const idx = node.textContent?.lastIndexOf("\\begin", offset);
    const text = node.textContent?.slice(idx);

    // if \end{} is empty just fill it with \begin{*}
    const re1 = /\\begin{([a-z]*)}(.*)\\end{}/i;
    if (text.match(re1)) {
      // use first group match to fill out the end tag
      const newText = text?.replace(re1, "\\begin{$1}$2\\end{$1}");
      node.textContent = node.textContent.substring(0, idx) + newText;
    } else {
      // use regex to replace the \end{*} with envName from \begin{*}
      const re = /\\begin{([a-z]*)}(.*)\\end{([a-z]*)}/i;
      // replace 3rd group with first group
      const newText = text?.replace(re, "\\begin{$1}$2\\end{$1}");
      node.textContent = node.textContent.substring(0, idx) + newText;
      // TODO check what happens when there's multiple (?)
    }
    // move the caret back
    selection.setPosition(node, offset);
    // TODO return here?
  }

  // TODO replace the environment name if the contents of \begin{*} and \end{*} change
  // TODO modularize that
}
