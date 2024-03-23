document.addEventListener("keyup", (event) => {return onKeyUp(event);});

// TODO detect certain patterns
// save the last 4-5 characters and detect if they match any of the pattersn in the shortcuts

let keyBuffer = "";

function onKeyUp(event: KeyboardEvent) {
    const keyName = event.key;
    console.log(keyName);

    keyBuffer += keyName;

    // TODO check Apple keyboard
    if (keyName === "Ctrl")

}


// shortcuts
const shortcuts = {
    "\beg": () => {
        // return the shortcut 
        // todo capture some of what the user is typing until they hit enter or tab or something
        return "\begin{} \end{}"
    }
};