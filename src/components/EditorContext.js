import { createContext } from 'react';

// create a React context so that child components of Main component 
// will have access to CKEditors
const EditorContext = createContext();

export default EditorContext;