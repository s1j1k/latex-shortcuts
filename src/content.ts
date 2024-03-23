document.addEventListener("keyup", (event) => {
  return onKeyUp(event);
});

// TODO detect certain patterns
// save the last 4-5 characters and detect if they match any of the pattersn in the shortcuts

// let keyBuffer = "";
// const BUFFER_SIZE = 30; // Read 30 chars

// FIXME should we do with by checking inner HTML itself(?)

function onKeyUp(event: KeyboardEvent): void {
  // get the text which is just updated
  const el = document.activeElement;

  // if (!el) {
  //     return;
  // }

  // only act on space
  const keyName = event.key;
  console.log("keyName", keyName);

  if (keyName != " ") {
    return;
  }

  console.log("Detected a space");

  // get the text in that element
  if (!el) {
    console.log("Element is undefined, returning");
    return;
  }

  // just look at the last few chars
  const BUFFER = 50;
  const text = el.textContent;

  if (!text) {
    console.log("No text in active element, returning");
    return;
  }

  // slice the text length to fit within a smaller buffer
  const textBuffer =
    text.length > BUFFER ? text.slice(text.length - BUFFER) : text;

  console.log("text buffer: ", textBuffer);

  // TODO make sure the last key entered is the last letter of the shortcut
  console.log("Searching for shortcuts");
  for (const [key, value] of Object.entries(shortcuts)) {
    //console.log(`${key}: ${value}`);

    // find the last entry in text
    // TODO make this more efficient ? only look in the last few chars?
    const idx = textBuffer?.lastIndexOf(key);

    if (idx === -1) {
      console.log("Shortcut ", key, " not detected in buffer.");
    }

    // make sure it is the very last thing in the element
    if (idx !== -1 && key === textBuffer?.slice(idx).replace(" ", "")) {
      console.log("Shortcut ", key, " detected in buffer!");
      console.log("inserting text", value());
      // TODO replace with the shortcut value
      el.insertAdjacentText("beforeend", value());
    }
  }

  // get the most recent element which needs shortcutting

  // console.log("Active element tag name: ",el?.tagName)

  // insertAdjacentText("beforeend", textInput.value);

  // the whole notion page is being returned
  //console.log("Text in active element=", text)

  // make sure the active element is being updated

  // console.log(keyName);

  // // ignore special keys and only append single chars
  // if (keyName.length == 1) {
  //     keyBuffer += keyName;
  // }

  // if (keyName === " " || keyBuffer.length > BUFFER_SIZE ) {
  //     // clear the buffer after a space or too long an entry
  //     keyBuffer = ""
  // }

  // // check for shortcuts
  // if (keyBuffer in shortcuts) {
  //     // append the replacement code
  //     // TODO include code for changing cursor position

  // }
}

// shortcuts
const shortcuts = {
  "\beg": () => {
    // return the shortcut
    // TODO capture some of what the user is typing until they hit enter or tab or something
    // NOTE removed the \beg in \begin
    // TODO add the environment name
    return "in{} end{}";
  },
};
