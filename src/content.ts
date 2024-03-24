import { shortcuts } from "./shortcuts";

// check for shortcut pattern after any key is released
document.addEventListener("keyup", (event) => {
  return onKeyUp(event);
});

// FIXME should we do with by checking inner HTML itself(?)

function onKeyUp(event: KeyboardEvent): void {
  // only act on space
  const keyName = event.key;
  if (keyName != " ") {
    return;
  }

  // analyse the text content
  const text = window.getSelection()?.anchorNode?.textContent ?? "";
  if (text === "") {
    return;
  }

  for (const [key, value] of Object.entries(shortcuts)) {
    const idx = text.lastIndexOf(key);

    if (idx === -1) {
      // FIXME delete
      console.log("Shortcut ", key, " not detected.");
    }
    //document.body.insertAdjacentText("beforeend", "Howdy partner");

    // make sure it is the very last thing in the element
    // FIXME delete
    console.log("Text buffer: ", text.slice(idx).replace(" ", ""));
    if (idx !== -1 && key === text?.slice(idx).replace(" ", "")) {
      // FIXME delete
      console.log("Shortcut ", key, " detected in buffer!");
      // FIXME delete
      console.log("inserting text", value());
      // TODO replace with the shortcut value
      //typeValue(activeElement, value());
      // TODO replace the shortcute key with the value
      // node.textContent =
      //   node.textContent?.replace(`/${key} */`, value()) ?? node.textContent;
      // replace the shortcut
      try {
        // @ts-ignore
          window.getSelection().anchorNode.textContent = text.replace(key, value());
        } catch {}
    }
  }
}

// TODO make it easy to turn the extension on/off for different sites

