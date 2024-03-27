// TODO make a modular shortcut that accepts arguments like ** to
// e.g. \begin{**}*\end{}
//and put \end{**} where **=any value *=wildcard anything regex
export const shortcuts = {
  "\\beg": (node: Node) => {
    // return the shortcut
    // TODO capture some of what the user is typing until they hit enter or tab or something
    // NOTE removed the \beg in \begin
    // TODO add the environment name
    // FIXME make it more careful to have the text in the right position
    //console.log("text content", selection.anchorNode.textContent)
    // @ts-ignore

    node.textContent =
      node.textContent?.replace("\\beg", "\\begin{} \\end{}") ??
      node.textContent;

    // TODO move the selection to right where the shortcut starts
    // move right a few characters
    // FIXME need to check thw whole anchorNode text conent
    window.getSelection()?.selectAllChildren(node);
    for (let i = 0; i < "\\begin{".length; i++) {
      window.getSelection()?.modify("move", "right", "character");
    }

    while (node.textContent?.indexOf("\\begin") !== -1) {
      // find what is in the begin environment
      const idx = node.textContent?.lastIndexOf("\\begin")
      // use regex to replace the last \end{*}
      // with envName from \begin{*}
      const re = /\\begin{([a-z]*)}(.*)\\end{([a-z]*)}/i;
      // replace 2nd group with first group
      const text = node.textContent?.slice(idx);
      const newText = text?.replace(re, "\\begin{$3}$2\\end{$1}");
      node.textContent = newText ? node.textContent?.substring(0, idx) + newText : node.textContent;
    }
  },
  // FIXME use regex?
  "{": (node: Node) => {
    // add a closing bracket
    node.textContent = node.textContent + "}";
    // move the cursor back one
    // wait some time so the user can see what's going on
    setTimeout(() => {
      window.getSelection()?.modify("move", "right", "character");
    }, 10);

    // TODO allow typing another right bracket
    // FIXME more elegant solution than while loop
    // FIXME have a tracking of state, what was the last shortcut
    // while()
    // if you get another }, ignore it 
    // note we only want to do this after we just inserted a }
    return "}"

    // TOOO modularize the movement of the cursor
  },
};
