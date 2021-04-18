/**
   * Pasting from DreamWidth seems to add 2 <br> tags per new line
   * instead of wrapping the line in <p> elements.
   * However, most of the functions work based on the assumption that each
   * line of text is wrapped in a <p> element
   * This helper function identifies new lines, moves them into <p> elements,
   * and adds them to the document body.
   * Possible case includes nested <p> tags but I haven't seen that yet,
   * so code assumes this input structure:
   * <body>
   *  <p>
   *    Line1
   *    <br><br>
   *    Line2
   *    <br><br>
   *    Line3
   *  </p>
   * </body>
   * And the desired output structure is:
   * <body>
   *  <p>Line1</p>
   *  <p>Line2</p>
   *  <p>Line3</p>
   * </body>
   * Function uses selection ranges: https://javascript.info/selection-range
   */

/**
 * Function to substitute \<br\> elements with paragraph elements, which can happen
 * if content is pasted in from Dreamwidth.
 * @param inputDom The CKEDitor content converted to a DOM object using convertToDom()
 * @return The edited CKEditor DOM with lines placed in \<p\> elements.
 */

export default function extractBr(inputDom) {
  // Assumes content with proper <p> formatting wouldn't have <br> tags
  const breaks = inputDom.querySelectorAll('br');
  if (breaks.length > 0) {
    // console.log('has br tags');
    const parent = breaks[0].parentNode; // the <p> element
    const insertInto = parent.parentNode; // the document.body
    for (let i = 0; i < breaks.length; i++) {
      const range = new Range();
      range.setStart(breaks[i].parentNode, 0); // set start to immediately after the opening <p> tag
      range.setEndBefore(breaks[i]); // set end to right before the <br> tag
      if (!range.collapsed) { // if there is text between the parent <p> and the <br>
        const newP = document.createElement(parent.tagName.toLowerCase());
        newP.append(range.extractContents());
        insertInto.insertBefore(newP, parent);
      }
      breaks[i].remove();
    }
    if (parent.innerHTML.length === 0) parent.remove();
  }
  return inputDom;
}