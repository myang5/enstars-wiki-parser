/**
 * Replaces <strong>, <i>, and <a> tags with the wiki code equivalent
 * @param {Document} editorDom
 * @return the editorDom with styling tags replaced
 */

export default function formatStyling(editorDom) {
  editorDom.querySelectorAll('strong').forEach(strong => {
    strong.replaceWith(`'''${strong.textContent}'''`);
  });
  editorDom.querySelectorAll('i').forEach(italic => {
    italic.replaceWith(`''${italic.textContent}''`);
  });
  editorDom.querySelectorAll('a').forEach(link => {
    link.replaceWith(`[${link.href} ${link.textContent}]`);
  });
  return editorDom;
}