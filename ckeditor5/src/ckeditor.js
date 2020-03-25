/**
 * @license Copyright (c) 2014-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import BalloonEditor from '@ckeditor/ckeditor5-editor-balloon/src/ballooneditor.js';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold.js';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic.js';
import Link from '@ckeditor/ckeditor5-link/src/link.js';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import FontBackgroundColor from '@ckeditor/ckeditor5-font/src/fontbackgroundcolor.js';
import FontColor from '@ckeditor/ckeditor5-font/src/fontcolor.js';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials.js';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph.js';
import Autosave from '@ckeditor/ckeditor5-autosave/src/autosave.js';
import List from '@ckeditor/ckeditor5-list/src/list.js';
import '../../styles/ck-styles.css';

export default class Editor extends BalloonEditor {}

// Plugins to include in the build.
Editor.builtinPlugins = [
	Bold,
	Italic,
	Link,
	PasteFromOffice,
	FontBackgroundColor,
	FontColor,
	Essentials,
	Paragraph,
	Autosave,
	List
];

BalloonEditor.defaultConfig = {
	language: 'en',
	licenseKey: '',
  };


  