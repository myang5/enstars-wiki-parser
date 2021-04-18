/**
 * Helper function to convert the data returned as a String
 * from CKEditor into a DOM Object
 * @param {String} data The CKEditor data as a string (returned from CKEditor.getData())
 * @return The result of parsing the data into a DOM object
 */

export default function convertEditorDataToDom(data) {
  return new DOMParser().parseFromString(data, 'text/html');
}
