import { shortcuts } from "./shortcuts";
import insertTextAtCursor from 'insert-text-at-cursor';


// check for shortcut pattern after any key is released
document.addEventListener("keyup", (event) => {
  return onKeyUp(event);
});

// FIXME should we do with by checking inner HTML itself(?)

function onKeyUp(event: KeyboardEvent): void {
  // get the text which is just updated
  // FIXME activeElement is readonly -> Need to edit document different way
  const activeElement = document.activeElement;

  //const el = document.body;

  // if (!el) {
  //     return;
  // }

  // only act on space
  const keyName = event.key;

  if (keyName != " ") {
    return;
  }

  // FIXME delete, for debugging only
  console.log("Detected a space");

  // get the text in that element
  if (!activeElement) {
    // FIXME delete
    console.log("Element is undefined, returning");
    return;
  }

  // just look at the last few chars
  const BUFFER = 50;
  const text = activeElement.textContent;

  if (!text) {
    // FIXME delete
    console.log("No text in active element, returning");
    return;
  }

  // slice the text length to fit within a smaller buffer
  const textBuffer =
    text.length > BUFFER ? text.slice(text.length - BUFFER) : text;

  // FIXME delete
  console.log("text buffer: ", textBuffer);

  // TODO make sure the last key entered is the last letter of the shortcut
  // FIXME delete
  console.log("Searching for shortcuts");
  for (const [key, value] of Object.entries(shortcuts)) {
    //console.log(`${key}: ${value}`);

    // find the last entry in text
    // TODO make this more efficient ? only look in the last few chars?
    const idx = textBuffer?.lastIndexOf(key);

    if (idx === -1) {
      // FIXME delete
      console.log("Shortcut ", key, " not detected in buffer.");
    }

    // FIXME delete
    console.log("Testing adding text to the body anyway");
    typeValue(activeElement, "VALUE")
    insertTextAtCursor(textField, 'Coding Beauty');

    //document.body.insertAdjacentText("beforeend", "Howdy partner");

    // make sure it is the very last thing in the element
    // FIXME delete
    console.log("Text buffer: ", textBuffer?.slice(idx).replace(" ", ""));
    if (idx !== -1 && key === textBuffer?.slice(idx).replace(" ", "")) {
      // FIXME delete
      console.log("Shortcut ", key, " detected in buffer!");
      // FIXME delete
      console.log("inserting text", value());
      // TODO replace with the shortcut value
      typeValue(activeElement, value());
    }
  }
}
// TODO make it easy to turn the extension on/off for different sites

function typeValue(el: Element, value: string) {
  for (let i = 0; i < value.length; i++) {
    simulateKeyPress(el, value[i]);
  }
}

function simulateKeyPress(el: Element, key: string) {
  const event = new KeyboardEvent("keydown", { key });
  document.dispatchEvent(event);
}
