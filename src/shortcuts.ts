import {Token} from './types'
import {insertString, deleteString} from './common'


// helpers for \begin{**} \end{**} shortcut
const re1 = /\\begin{([a-z]*)}(.*)\\end{}/i;
const re2 = /\\begin{([a-z]*)}(.*)\\end{([a-z]*)}/i;
const re3 = /\\begin{}(.*)\\end{([a-z]*)}/i;


// check for shortcut pattern after any key is released
document.addEventListener("keydown", (event) => {
  try {
    onKeyDown(event);
  } catch {
    // do nothing
  }
});

/**
 * 
 * Main function, event handler for when a key is pressed, apply the shortcuts
 * @param event 
 * @returns 
 */
function onKeyDown(event: KeyboardEvent): void {
  // only act on letters or Backspace
  if (event.key.length > 1 && event.key !== "Backspace") {
    return;
  }

  const selection = window.getSelection();
  if (!selection) {
    return;
  }

  // Consider the caret position after the current key is typed
  const offset = selection.focusOffset + 1;
  const node = selection.focusNode;

  if (node === undefined || node === null || (!offset && offset !== 0)) {
    return;
  }

  // FIXME caret position in the block equation when first opening is not working

  // Autocomplete {}
  if (event.key === "{") {
    insertString(node, offset, "}");
    selection.setPosition(node, offset);
    return;
  }

  // Allow typing } after autocompleting {}
  if (event.key === "}") {
    deleteString(node, offset+1, "}");
    selection.setPosition(node, offset);
    return;
  }

  // look for shortcut \beg
  const shortcut = "\\beg";
  if (
    event.key == "g" &&
    node.textContent?.substring(offset - shortcut.length, offset) === shortcut
  ) {
    insertString(node, offset, "in{} \\end{}");
    selection.setPosition(node, offset + 3);
    return;
  }

  // TODO convert $$ to inline math mode instantly
  // OR move cursor inside and convert automatically?

  /**
   *
   * Check if inside a Notion block equation for \begin{**} & \end{**}
   *
   */
  if (node.parentElement?.className === Token.keyword) {
    const blockNode = node.parentNode?.parentNode;
    const text = blockNode?.textContent;

    if (text?.match(re1) || text?.match(re2) || text?.match(re3)) {
      const childNodes = [...blockNode!.childNodes!];

      // @ts-ignore get the "token keyword" node
      const indexEnvName = childNodes.indexOf(node.parentNode);
      // make sure it's a begin
      // @ts-ignore
      const isBegin =
        (childNodes[indexEnvName - 2] as Element).className === Token.functionSelector &&
        childNodes[indexEnvName - 2].textContent === "\\begin";

      if (isBegin) {
        const envName = node.textContent ?? node.parentNode?.textContent;
        const envNodeCopy = node.cloneNode();
        // find the next "token function selector" that doesn't already have a matching closer
        // const childNodesAfterBegin = childNodes.slice(idx);
        // remove matching closers
        const indexEnd = childNodes.findIndex((value, index, object) => {
          return (
            index > indexEnvName &&
            (value as Element).className === Token.functionSelector &&
            value.textContent === "\\end" &&
            (object[index + 1] as Element).className === Token.punctuation &&
            ((object[index + 2] as Element).className === Token.keyword ||
              (object[index + 2] as Element).className === Token.punctuation) &&
            !(
              (object[index + 2] as Element).className === Token.keyword &&
              childNodes
                .slice(indexEnvName, index + 2)
                .map((node) => node.textContent)
                .join("")
                .includes(
                  `\\begin{${(object[index + 2] as Element).textContent}}`
                )
            )
          );
        });

        // check if the next thing is {} or {envName}
        if (childNodes[indexEnd]) {
        }
      }
    }
    //   // empty \end{}
    //   // @ts-ignore
    //   // FIXME  'token function selector' will be end
    //   // add a textNode in the middle of "token punctuation"
    //   return childNodes.slice(idx + 1).find((childNode) => {childNode.className === "token keyword"})
    // }
    // const endNode = inBlockEqKeyword ? getEndNode() : undefined;
    // const envName = inBlockEqKeyword ? node.textContent! : undefined;
  }

  // TODO check inline math mode!
  /**
   *  replace latex env name for \begin{**} -> \end{**}
   */
  if (node.textContent?.slice(0, offset).match(/\\begin{[a-z]*$/i)) {
    const text = node?.textContent;
    if (text) {
      if (text.match(re1)) {
        // \begin{**} \end{} -> fill up \end{}
        node.textContent = text?.replace(re1, "\\begin{$1}$2\\end{$1}");
      } else if (text.match(re2)) {
        // \begin{**} \end{**} -> make \end{} match
        node.textContent = text?.replace(re2, "\\begin{$1}$2\\end{$1}");
      } else if (text.match(re3)) {
        // \begin{} \end{**} -> empty the end tag fully
        // FIXME does this work
        node.textContent = text?.replace(re2, "\\begin{}$2\\end{}");
      }
    }
    selection.setPosition(node, offset);

    return;
  }
}
