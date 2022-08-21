"use strict";
/**
 * sharedb-monaco-cursors
 * Real-time collaborative cursors for the sharedb-monaco package
 *
 * @name index.ts
 * @author Carl Ian Voller <carlvoller8@gmail.com>
 * @license MIT
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
        var connection = opts.connection, namespace = opts.namespace, id = opts.id, _a = opts.viewOnly, viewOnly = _a === void 0 ? false : _a, name = opts.name, colors = opts.colors, editors = opts.editors, uid = opts.uid;
        this.viewOnly = viewOnly;
        this.prescence = connection.getPresence(namespace);
        this.prescence.subscribe();
        this.name = name;
        this.prescenceId = "".concat(id, "-").concat(uid || this.prescenceId, "-").concat(name);
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
        this.onDidChangeCursorPosition = this.onDidChangeCursorPosition.bind(this);
        this.onDidChangeCursorSelection = this.onDidChangeCursorSelection.bind(this);
        this.boundOnPresenceReceive = function (pid, update) { return _this.onPresenceReceive(pid, update); };
        this.onPresenceReceive = this.onPresenceReceive.bind(this);
        this.attachEventListeners();
    }
    ShareDBMonacoCursors.prototype.onDidChangeCursorPosition = function (event) {
        if (!this.viewOnly)
            this.localPrescence.submit({ p: event.position });
    };
    ShareDBMonacoCursors.prototype.onDidChangeCursorSelection = function (event) {
        if (!this.viewOnly)
            this.localPrescence.submit({ s: event.selection });
    };
    ShareDBMonacoCursors.sleep = function (seconds) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, seconds * 1000); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ShareDBMonacoCursors.prototype.onPresenceReceive = function (id, update) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, editors, colors, _b, fileID, uid, name, _c, startColumn_1, startLineNumber_1, endColumn_1, endLineNumber_1, pos_1;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = this, editors = _a.editors, colors = _a.colors;
                        _b = id.split('-'), fileID = _b[0], uid = _b[1], name = _b[2];
                        // Cursor left
                        if (!update || fileID !== this.fileID) {
                            editors.forEach(function (_a) {
                                var cursorManager = _a[1], selectionManager = _a[2];
                                cursorManager.removeCursor(uid);
                                selectionManager.removeSelection(uid);
                            });
                            this.cursors.delete(uid);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, ShareDBMonacoCursors.sleep(0.2)];
                    case 1:
                        _d.sent();
                        // New cursor
                        if (!this.cursors.has(uid)) {
                            editors.forEach(function (_a) {
                                var cursorManager = _a[1], selectionManager = _a[2];
                                var color = colors[Math.floor(Math.random() * colors.length)];
                                cursorManager.addCursor(uid, color, name);
                                selectionManager.addSelection(uid, color, name);
                                _this.cursors.set(uid, { color: color, name: name });
                            });
                        }
                        // Selection occurred
                        if ('s' in update) {
                            _c = update.s, startColumn_1 = _c.startColumn, startLineNumber_1 = _c.startLineNumber, endColumn_1 = _c.endColumn, endLineNumber_1 = _c.endLineNumber;
                            editors.forEach(function (_a) {
                                var selectionManager = _a[2];
                                var start = { lineNumber: startLineNumber_1, column: startColumn_1 };
                                var end = { lineNumber: endLineNumber_1, column: endColumn_1 };
                                selectionManager.setSelectionPositions(uid, start, end);
                            });
                        }
                        // Cursor Pos Change occurred
                        if ('p' in update) {
                            pos_1 = update.p;
                            editors.forEach(function (_a) {
                                var cursorManager = _a[1];
                                return cursorManager.setCursorPosition(uid, pos_1);
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ShareDBMonacoCursors.prototype.attachEventListeners = function () {
        var _a = this, editors = _a.editors, listeners = _a.listeners;
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
        this.prescence.removeListener('receive', this.boundOnPresenceReceive);
        this.prescence.on('receive', this.boundOnPresenceReceive);
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
        if (this.editors.size === 0) {
            this.listeners.forEach(function (listener) { return listener.dispose(); });
            this.listeners = [];
            this.prescence.removeListener('receive', this.boundOnPresenceReceive);
            this.prescence.unsubscribe();
            return;
        }
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
