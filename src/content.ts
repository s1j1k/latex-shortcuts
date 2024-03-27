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
  if (event.key.length > 1) {
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

  // replace env name for \begin{} \end{}
  // shortcut will be
  // \begin{
  // or
  // \end{
  // and having both \begin{} and \end{} in the node

  // act if one has been changed to replace env name
  if (
    node.textContent?.match("\\begin{([a-z]+)}") ||
    node.textContent?.match("\\end{([a-z]+)}")
  ) {
    // find the begin just before the caret position
    const idx = node.textContent?.substring(0,offset).lastIndexOf("\\begin");
    // use regex to replace the last \end{*}
    // with envName from \begin{*}
    const re = /\\begin{([a-z]*)}(.*)\\end{([a-z]*)}/i;
    // analyze from after the \begin before the caret
    const text = node.textContent?.slice(idx);
    // replace 2nd group with first group
    const newText = text?.replace(re, "\\begin{$1}$2\\end{$1}");
    node.textContent = node.textContent.substring(0,idx) + newText
  }        
     

  // TODO replace the environment name if the contents of \begin{*} and \end{*} change
  // TODO modularize that
}
