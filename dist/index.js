"use strict";
/**
 * sharedb-monaco-cursors
 * Real-time collaborative cursors for the sharedb-monaco package
 *
 * @name index.ts
 * @author Carl Ian Voller <carlvoller8@gmail.com>
 * @license MIT
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var manager_1 = __importDefault(require("./cursor/manager"));
var manager_2 = __importDefault(require("./selection/manager"));
var styles = "\n.sharedb-monaco-cursors-cursor {\n    position: absolute;\n    pointer-events: none;\n    z-index: 4000;\n    width: 2px;\n}\n\n.sharedb-monaco-cursors-cursor:before {\n    content: \"\";\n    width: 6px;\n    height: 5px;\n    display: block;\n    margin-left: -2px;\n    margin-top: 0;\n    z-index: 4000;\n    background: inherit;\n}\n\n.sharedb-monaco-cursors-tooltip {\n    position: absolute;\n    white-space: nowrap;\n    color: #FFFFFF;\n    text-shadow: 0 0 1px #000000;\n    opacity: 1.0;\n    font-size: 12px;\n    padding: 3px 10px;\n    font-family: sans-serif;\n    z-index: 4000;\n    letter-spacing: 1px;\n\n    transition: opacity 0.5s ease-out;\n    -webkit-transition: opacity 0.5s ease-out;\n    -moz-transition: opacity 0.5s ease-out;\n    -ms-transition: opacity 0.5s ease-out;\n    -o-transition: opacity 0.5s ease-out;\n}\n\n.sharedb-monaco-cursors-selection {\n    position: absolute;\n    pointer-events: auto;\n    opacity: 0.3;\n    background: blue;\n}\n";
var ShareDBMonacoCursors = /** @class */ (function () {
    function ShareDBMonacoCursors(opts) {
        var _this = this;
        this.prescenceId = Date.now() + Math.floor(Math.random() * 1000000000).toString();
        this.editors = new Map();
        this.listeners = [];
        this.cursors = new Map();
        this.colors = ['BurlyWood', 'lightseagreen', 'Violet', 'Red', 'forestgreen', 'DarkViolet', 'OrangeRed', 'navy', 'darkviolet', 'maroon'];
        var connection = opts.connection, namespace = opts.namespace, id = opts.id, viewOnly = opts.viewOnly, name = opts.name, colors = opts.colors, editors = opts.editors;
        this.viewOnly = viewOnly;
        this.prescence = connection.getPresence(namespace);
        this.prescence.subscribe();
        this.name = name;
        this.prescenceId = "".concat(id, "-").concat(this.prescenceId, "-").concat(name);
        this.fileID = id;
        if (colors)
            this.colors = colors;
        editors.forEach(function (editor) { return _this.editors.set(editor.getId(), [
            editor,
            new manager_1.default({ editor: editor, tooltips: true, tooltipDuration: 1 }),
            new manager_2.default({ editor: editor }),
        ]); });
        this.localPrescence = this.prescence.create(this.prescenceId);
        var style = document.getElementById('sharedb-monaco-cursors-styles');
        if (!style) {
            style = document.createElement('style');
            style.setAttribute('id', 'sharedb-monaco-cursors-styles');
            style.innerHTML = styles;
            document.getElementsByTagName('head')[0].appendChild(style);
        }
        this.attachEventListeners();
        this.onDidChangeCursorPosition = this.onDidChangeCursorPosition.bind(this);
        this.onDidChangeCursorSelection = this.onDidChangeCursorSelection.bind(this);
    }
    ShareDBMonacoCursors.prototype.onDidChangeCursorPosition = function (event) {
        if (!this.viewOnly)
            this.localPrescence.submit({ p: event.position });
    };
    ShareDBMonacoCursors.prototype.onDidChangeCursorSelection = function (event) {
        if (!this.viewOnly)
            this.localPrescence.submit({ s: event.selection });
    };
    ShareDBMonacoCursors.prototype.attachEventListeners = function () {
        var _this = this;
        var _a = this, editors = _a.editors, listeners = _a.listeners, colors = _a.colors;
        var _b = this, onPos = _b.onDidChangeCursorPosition, onSel = _b.onDidChangeCursorSelection;
        onPos = onPos.bind(this);
        onSel = onSel.bind(this);
        listeners.forEach(function (listener) { return listener.dispose(); });
        this.listeners = [];
        editors.forEach(function (_a) {
            var editor = _a[0];
            return listeners.push(editor.onDidChangeCursorPosition(onPos));
        });
        editors.forEach(function (_a) {
            var editor = _a[0];
            return listeners.push(editor.onDidChangeCursorSelection(onSel));
        });
        this.prescence.removeAllListeners('receive');
        this.prescence.on('receive', function (id, update) {
            var _a = id.split('-'), fileID = _a[0], prescenceId = _a[1], name = _a[2];
            var curID = "".concat(prescenceId, "-").concat(name);
            // Cursor left
            console.log(fileID, _this.fileID);
            if ((!update || fileID !== _this.fileID) && _this.cursors.has(curID)) {
                editors.forEach(function (_a) {
                    var cursorManager = _a[1], selectionManager = _a[2];
                    cursorManager.removeCursor(curID);
                    selectionManager.removeSelection(curID);
                });
                _this.cursors.delete(curID);
                return;
            }
            // New cursor
            if (!_this.cursors.has(curID)) {
                editors.forEach(function (_a) {
                    var cursorManager = _a[1], selectionManager = _a[2];
                    var color = colors[Math.floor(Math.random() * colors.length)];
                    cursorManager.addCursor(curID, color, name);
                    selectionManager.addSelection(curID, color, name);
                    _this.cursors.set(curID, { color: color, name: name });
                });
            }
            // Selection occurred
            if ('s' in update) {
                var _b = update.s, startColumn_1 = _b.startColumn, startLineNumber_1 = _b.startLineNumber, endColumn_1 = _b.endColumn, endLineNumber_1 = _b.endLineNumber;
                editors.forEach(function (_a) {
                    var selectionManager = _a[2];
                    var start = { lineNumber: startLineNumber_1, column: startColumn_1 };
                    var end = { lineNumber: endLineNumber_1, column: endColumn_1 };
                    selectionManager.setSelectionPositions(curID, start, end);
                });
            }
            // Cursor Pos Change occurred
            if ('p' in update) {
                var pos_1 = update.p;
                editors.forEach(function (_a) {
                    var cursorManager = _a[1];
                    return cursorManager.setCursorPosition(curID, pos_1);
                });
            }
        });
    };
    /**
     * Toggles the View-Only state of the cursors.
     * When set to true, this user's cursors will not be broadcasted.
     * @param {boolean} viewOnly - Set to true to set to View-Only mode
     */
    ShareDBMonacoCursors.prototype.setViewOnly = function (viewOnly) {
        this.viewOnly = viewOnly;
    };
    /**
     * Add an editor
     * @param {Monaco.editor.ICodeEditor} editor - The ICodeEditor instance
     */
    ShareDBMonacoCursors.prototype.addEditor = function (editor) {
        var id = editor.getId();
        if (this.editors.size === 0)
            this.prescence.subscribe();
        if (this.editors.has(id))
            return;
        var cursorManager = new manager_1.default({ editor: editor, tooltips: true, tooltipDuration: 1 });
        var selectionManager = new manager_2.default({ editor: editor });
        this.cursors.forEach(function (cursor, cursorID) {
            var color = cursor.color, name = cursor.name;
            cursorManager.addCursor(cursorID, color, name);
            selectionManager.addSelection(cursorID, color, name);
        });
        this.editors.set(id, [editor, cursorManager, selectionManager]);
        this.attachEventListeners();
    };
    /**
     * Disposes all cursors, selection from the editor
     * @param {string} id - The editor's ID from its .getId() method
     */
    ShareDBMonacoCursors.prototype.removeEditor = function (id) {
        if (!this.editors.has(id))
            return;
        var _a = this.editors.get(id), cursorManager = _a[1], selectionManager = _a[2];
        cursorManager.dispose();
        selectionManager.dispose();
        this.editors.delete(id);
        if (this.editors.size === 0)
            this.prescence.unsubscribe();
        this.attachEventListeners();
    };
    /**
     * Close all cursors and clean up
     * Disposes all cursor and selection listeners and destroys the prescence.
     */
    ShareDBMonacoCursors.prototype.dispose = function () {
        var _this = this;
        var editors = this.editors;
        editors.forEach(function (_a) {
            var cursorManager = _a[1], selectionManager = _a[2];
            cursorManager.dispose();
            selectionManager.dispose();
        });
        this.prescence.unsubscribe(function () { return _this.prescence.destroy(); });
        this.listeners.forEach(function (listener) { return listener.dispose(); });
    };
    return ShareDBMonacoCursors;
}());
exports.default = ShareDBMonacoCursors;
