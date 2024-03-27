// check for shortcut pattern after any key is released
document.addEventListener("keyup", (event) => {
  try {
    onKeyUp(event);
  } catch {
    // do nothing
  }
});

function onKeyUp(event: KeyboardEvent): void {
  // only act on standard keys
  if (event.key.length > 1) {
    return;
  }

  // if we insert a "{", insert a subsequent "}"
  // allow nested
  // allow to type over
  if (event.key === "{") {
    // insert }
    // TODO Just handle simpel case (add parent node later for inline math func)
    // try to dispatch keyboard event?

    // TODO check if the text content includes {, or switch the focus to the parent (?)

    // just find the offset
    const offset = window.getSelection()?.focusOffset;
    // insert at that offset
    const node = window.getSelection()?.focusNode;
    // FIXME more elegant than substring?
    node!.textContent =
      node?.textContent?.substring(0, offset) +
      "}" +
      node?.textContent?.substring(offset!);

    // note the caret resets to the start of the node when we set the text content
    // move the caret over
    window.getSelection()?.setPosition(node!, offset!);
  }
}
