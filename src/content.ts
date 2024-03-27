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
    return
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
  }

  // TODO modularize
  // look for shortcut \beg
  const shortcut = "\\beg";
  console.log(
    "looking for \\beg in substring: ",
    node.textContent?.substring(offset - shortcut.length, offset)
  );
  if (
    node.textContent?.substring(offset - shortcut.length, offset) === shortcut
  ) {
    console.log("found it");
    insertString(node, offset, "in{} \end{}")
    selection.setPosition(node, offset+2);
  }

  // TODO replace the environment name if the contents of \begin{*} and \end{*} change
  // TODO modularize that 
}
