import { shortcuts } from "./shortcuts";

// check for shortcut pattern after any key is released
document.addEventListener("keyup", (event) => {
  return onKeyUp(event);
});

// FIXME should we do with by checking inner HTML itself(?)

function onKeyUp(event: KeyboardEvent): void {
  // get the text which is just updated
  // FIXME activeElement is readonly -> Need to edit document different way
  //const el = document.activeElement;

  const el = document.body;

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
  if (!el) {
    // FIXME delete
    console.log("Element is undefined, returning");
    return;
  }

  // just look at the last few chars
  const BUFFER = 50;
  const text = el.textContent;

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

    // make sure it is the very last thing in the element
    if (idx !== -1 && key === textBuffer?.slice(idx).replace(" ", "")) {
      // FIXME delete
      console.log("Shortcut ", key, " detected in buffer!");
      // FIXME delete
      console.log("inserting text", value());
      // TODO replace with the shortcut value
      el.insertAdjacentText("beforeend", value());
      // el.innerHTML = el.innerHTML + 'TEST'
      //   }
    }
  }
}
// TODO make it easy to turn the extension on/off for different sites
