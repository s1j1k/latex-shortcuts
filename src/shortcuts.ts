export const shortcuts = {
  "\\beg": (selection: Selection) => {
    // return the shortcut
    // TODO capture some of what the user is typing until they hit enter or tab or something
    // NOTE removed the \beg in \begin
    // TODO add the environment name
    // FIXME make it more careful to have the text in the right position
    console.log("text content", selection.anchorNode.textContent)
    // @ts-ignore
    selection.anchorNode.textContent = selection.anchorNode.textContent.replace(
      "\\beg",
      "\\begin{} \\end{}"
    );
    // move right a few characters
    // FIXME need to check thw whole anchorNode text conent
    for (let i = 0; i < "\\begin{".length; i++) {
      selection.modify("move", "right", "character");
    }
    // TODO get the environment name (maybe use STDIN(??))
    //return "\\begin{} \\end{}";
  },
};
