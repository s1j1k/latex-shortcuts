/**
 * 
 * Insert a string directly after the caret offset.
 * @param node 
 * @param offset 
 * @param str 
 */
export function insertString(node: Node, offset: number, str: string): void {
    // Offset after the curren key is typed
    const offsetKey = offset;
    node.textContent =
      node.textContent?.substring(0, offsetKey) +
      str +
      node.textContent?.substring(offsetKey!);
  }
  
  /**
   * 
   * Delete a string before the caret offset.
   * @param node 
   * @param offset 
   * @param str 
   */
  export function deleteString(node: Node, offset: number, str: string): void {
    const numChars = str.length;
    if (node.textContent?.substring(offset-numChars,offset) === str) {
      node.textContent =
      node.textContent?.substring(0, offset-numChars) +
      node.textContent?.substring(offset);
    }
  }