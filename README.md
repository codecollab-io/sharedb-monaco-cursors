# sharedb-monaco-cursors

[![](https://img.shields.io/npm/v/sharedb-monaco-cursors)](https://github.com/codecollab-io/sharedb-monaco-cursors/blob/main/LICENSE)
[![](https://img.shields.io/github/license/codecollab-io/sharedb-monaco-cursors)](https://github.com/codecollab-io/sharedb-monaco-cursors/blob/main/LICENSE)

Collaborative Cursor and Selection support for [sharedb-monaco](https://github.com/codecollab-io/sharedb-monaco).

(If you're using your own ShareDB Monaco implementation, sharedb-monaco-cursors will work even without sharedb-monaco installed)

Developed for the [CodeCollab](https://codecollab.io) project.

Tested and works well with [monaco-react](https://github.com/suren-atoyan/monaco-react).

## Install
Using NPM:
```
$ npm install sharedb-monaco-cursors
```

## Usage

`sharedb-monaco-cursors` relies on the ShareDB Presence API to work. Before using this library, ensure that this API is enabled on the server as it is disabled by default.

To enable the Presence API on the server:
```javascript
let shareConfig = {
    db,
    presence: true  // This line enables Presence
}

const share = new ShareDB(shareConfig);
```

Sample usage of this library in action
```Javascript
import ShareDBMonaco from "sharedb-monaco";
import ShareDBMonacoCursors from "sharedb-monaco-cursors";
import monaco from "monaco-editor";

// Get a monaco editor (ICodeEditor) instance
let editor = monaco.editor.create(document.getElementById("editor"), {
    value: "print('Hello World!')",
    language: "python"
});

// Initialise sharedb-monaco
let binding = new ShareDBMonaco(options);
let model = binding.add(editor, attachOptions);

// Initialise sharedb-monaco-cursors
let cursors = new ShareDBMonacoCursors(cursorOptions);
```

### `new ShareDBMonacoCursors(options)`
* `options` **\<Object>**
    * `id` **\<string>** ID of the ShareDB document
    * `namespace` **\<string>** The namespace of document within ShareDB, to be equal to that on the server
    * `name` **\<string>** Name of this user, to be displayed to other connected users.
    * `editors` **\<monaco.editor.ICodeEditor[]>** Array of `ICodeEditor`s to bind cursors to.
    * `viewOnly` **\<boolean>** Should local cursor and selection events be listened and broadcasted. Default: `false`
    * `colors` **\<string[]>** Array of color codes to use for cursors. Defaults to `['BurlyWood', 'lightseagreen', 'Violet', 'Red', 'forestgreen', 'DarkViolet', 'OrangeRed', 'navy', 'darkviolet', 'maroon']`
    * `uid` **\<string>** Unique Identifier for each user's cursors. Important if you want to manage cursors across multiple `ShareDBMonacoCursors` instances and documents at the same time.

---

### `cursors.setViewOnly(viewOnly)`
Toggles the view-only state of the cursors.
* `viewOnly` **\<boolean>** Should this document ignore local cursor and selection events.

---

### `cursors.addEditor(editor)`
Add an editor to bind cursor and selection event listeners to
* `editor` **\<monaco.editor.ICodeEditor>** The editor to bind listeners to

---

### `cursors.removeEditor(id)`
Remove an editor from listening and receiving cursor and selection events
* `id` **\<string>** Id of the `ICodeEditor` instance from `ICodeEditor.getId()`

---

### `cursors.dispose()`
Closes all event listeners, removes all cursors and clean up.
Will also unsubscribe and destroy the presence.

---

## License
[MIT](https://github.com/codecollab-io/sharedb-monaco-cursors/blob/master/LICENSE)