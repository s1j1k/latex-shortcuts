// helpers for \begin{**} \end{**} shortcut
const re1 = /\\begin{([a-z]*)}(.*)\\end{}/i;
const re2 = /\\begin{([a-z]*)}(.*)\\end{([a-z]*)}/i;
const re3 = /\\begin{}(.*)\\end{([a-z]*)}/i;

// class names inside notion math block equation
enum Token {
  keyword = "token keyword",
  functionSelector = "token function selector",
  punctuation = "token punctuation"
}

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
  if (event.key.length > 1 && event.key !== "Backspace") {
    return;
  }

  const selection = window.getSelection();
  if (!selection) {
    return;
  }

  const offset = selection.focusOffset;
  const node = selection.focusNode;

  if (node === undefined || node === null || (!offset && offset !== 0)) {
    return;
  }

  // FIXME caret position in the block equation when first opening is not working

  /**
   * if we insert a "{", insert a subsequent "}" -> done
   * allow nested -> done
   * allow to type over -> pending
   */
  if (event.key === "{") {
    insertString(node, offset, "}");
    // note the caret resets to the start of the node when we set the text content
    // move the caret over
    selection.setPosition(node, offset);
    return;
    // TODO allow to type over - handle block eq as well
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
      const isBegin = childNodes[indexEnvName-2].className === Token.functionSelector && childNodes[indexEnvName-2].textContent === "\\begin";

      if (isBegin) {
        const envName = node.textContent ?? node.parentNode?.textContent;
        const envNodeCopy = node.cloneNode();
        // find the next "token function selector" that doesn't already have a matching closer
        // const childNodesAfterBegin = childNodes.slice(idx);
        // remove matching closers 
        const indexEnd = childNodes.findIndex((value, index, object) => {
          return
          // make sure it occurs after the \begin class 
          index > indexBegin &&
          // it starts with "\end"
          // @ts-ignore
          value.className === Token.functionSelector && value.textContent === "\\end" &&
          // the next thing is "{"
          // @ts-ignore
          (object[index+1].className === Token.punctuation) &&
          // followed by either envName} or {}
          // @ts-ignore
          ((object[index+2].className === Token.keyword) || object[index+2].className === Token.punctuation)) &&
          // ignore it if it already has a matching begin tag which comes after the current begin tag and before current end tag
          // 
          !( (object[index+2].className === Token.keyword)  &&  
          // join the whole thing as a string
          childNodes.slice(indexBegin, index+2).map((node) => node.textContent).join("").includes(`\\begin{${object[index+2].textContent}}`)
          )
        }
  
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
  if (
    node.textContent?.slice(0, offset).match(/\\begin{[a-z]*$/i)
  ) {
    
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
