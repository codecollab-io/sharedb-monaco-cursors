/**
 * sharedb-monaco-cursors
 * Real-time collaborative cursors for the sharedb-monaco package
 *
 * @name index.ts
 * @author Carl Ian Voller <carlvoller8@gmail.com>
 * @license MIT
 */

import type Monaco from 'monaco-editor';
import type { Presence, LocalPresence } from 'sharedb/lib/client';
import CursorManager from './cursor/manager';
import SelectionManager from './selection/manager';
import type { Cursor, IPresenceReceiveUpdate, ShareDBMonacoCursorsOptions } from './types';

const styles = `
.sharedb-monaco-cursors-cursor {
    position: absolute;
    pointer-events: none;
    z-index: 4000;
    width: 2px;
}

.sharedb-monaco-cursors-cursor:before {
    content: "";
    width: 6px;
    height: 5px;
    display: block;
    margin-left: -2px;
    margin-top: 0;
    z-index: 4000;
    background: inherit;
}

.sharedb-monaco-cursors-tooltip {
    position: absolute;
    white-space: nowrap;
    color: #FFFFFF;
    text-shadow: 0 0 1px #000000;
    opacity: 1.0;
    font-size: 12px;
    padding: 3px 10px;
    font-family: sans-serif;
    z-index: 4000;
    letter-spacing: 1px;

    transition: opacity 0.5s ease-out;
    -webkit-transition: opacity 0.5s ease-out;
    -moz-transition: opacity 0.5s ease-out;
    -ms-transition: opacity 0.5s ease-out;
    -o-transition: opacity 0.5s ease-out;
}

.sharedb-monaco-cursors-selection {
    position: absolute;
    pointer-events: auto;
    opacity: 0.3;
    background: blue;
}
`;

class ShareDBMonacoCursors implements Monaco.IDisposable {

    private prescenceId = Date.now() + Math.floor(Math.random() * 1000000000).toString();

    private editors: Map<string, [
        Monaco.editor.ICodeEditor, CursorManager, SelectionManager
    ]> = new Map();

    private listeners: Array<Monaco.IDisposable> = [];

    private prescence: Presence;

    private localPrescence: LocalPresence;

    private viewOnly: boolean;

    private name: string;

    private cursors: Map<string, Cursor> = new Map();

    private fileID: string;

    private colors = ['BurlyWood', 'lightseagreen', 'Violet', 'Red', 'forestgreen', 'DarkViolet', 'OrangeRed', 'navy', 'darkviolet', 'maroon'];

    constructor(opts: ShareDBMonacoCursorsOptions) {

        const { connection, namespace, id, viewOnly, name, colors, editors, uid } = opts;

        this.viewOnly = viewOnly;
        this.prescence = connection.getPresence(namespace);
        this.prescence.subscribe();
        this.name = name;
        this.prescenceId = `${id}-${uid || this.prescenceId}-${name}`;
        this.fileID = id;
        if (colors) this.colors = colors;

        editors.forEach((editor) => this.editors.set(editor.getId(), [
            editor,
            new CursorManager({ editor, tooltips: true, tooltipDuration: 1 }),
            new SelectionManager({ editor }),
        ]));

        this.localPrescence = this.prescence.create(this.prescenceId);

        let style = document.getElementById('sharedb-monaco-cursors-styles');

        if (!style) {

            style = document.createElement('style');
            style.setAttribute('id', 'sharedb-monaco-cursors-styles');
            style.innerHTML = styles;
            document.getElementsByTagName('head')[0].appendChild(style);

        }

        this.attachEventListeners();

        this.onDidChangeCursorPosition = this.onDidChangeCursorPosition.bind(this);
        this.onDidChangeCursorSelection = this.onDidChangeCursorSelection.bind(this);
        this.onPresenceReceive = this.onPresenceReceive.bind(this);

    }

    private onDidChangeCursorPosition(event: Monaco.editor.ICursorPositionChangedEvent) {

        if (!this.viewOnly) this.localPrescence.submit({ p: event.position });

    }

    private onDidChangeCursorSelection(event: Monaco.editor.ICursorSelectionChangedEvent) {

        if (!this.viewOnly) this.localPrescence.submit({ s: event.selection });

    }

    private onPresenceReceive(id: string, update: IPresenceReceiveUpdate) {

        const { editors, colors } = this;

        const [fileID, uid, name] = id.split('-');

        // Cursor left
        if (!update || fileID !== this.fileID) {

            editors.forEach(([, cursorManager, selectionManager]) => {

                cursorManager.removeCursor(uid);
                selectionManager.removeSelection(uid);

            });

            this.cursors.delete(uid);

            return;

        }

        // New cursor
        if (!this.cursors.has(uid)) {

            editors.forEach(([, cursorManager, selectionManager]) => {

                const color = colors[Math.floor(Math.random() * colors.length)];
                cursorManager.addCursor(uid, color, name);
                selectionManager.addSelection(uid, color, name);

                this.cursors.set(uid, { color, name });

            });

        }

        // Selection occurred
        if ('s' in update) {

            const {
                startColumn, startLineNumber, endColumn, endLineNumber,
            }: Monaco.Selection = update.s;

            editors.forEach(([,, selectionManager]) => {

                const start = { lineNumber: startLineNumber, column: startColumn };
                const end = { lineNumber: endLineNumber, column: endColumn };
                selectionManager.setSelectionPositions(uid, start, end);

            });

        }

        // Cursor Pos Change occurred
        if ('p' in update) {

            const pos: Monaco.Position = update.p;
            editors.forEach(([, cursorManager]) => cursorManager.setCursorPosition(uid, pos));

        }

    }

    private attachEventListeners() {

        const { editors, listeners } = this;

        let {
            onDidChangeCursorPosition: onPos, onDidChangeCursorSelection: onSel, onPresenceReceive,
        } = this;

        onPos = onPos.bind(this);
        onSel = onSel.bind(this);
        onPresenceReceive = onPresenceReceive.bind(this);

        listeners.forEach((listener) => listener.dispose());
        this.listeners = [];

        editors.forEach(([editor]) => listeners.push(editor.onDidChangeCursorPosition(onPos)));
        editors.forEach(([editor]) => listeners.push(editor.onDidChangeCursorSelection(onSel)));

        this.prescence.removeListener('receive', onPresenceReceive);
        this.prescence.on('receive', onPresenceReceive);

    }

    /**
     * Toggles the View-Only state of the cursors.
     * When set to true, this user's cursors will not be broadcasted.
     * @param {boolean} viewOnly - Set to true to set to View-Only mode
     */
    setViewOnly(viewOnly: boolean) {

        this.viewOnly = viewOnly;

    }

    /**
     * Add an editor
     * @param {Monaco.editor.ICodeEditor} editor - The ICodeEditor instance
     */
    addEditor(editor: Monaco.editor.ICodeEditor) {

        const id = editor.getId();

        if (this.editors.size === 0) this.prescence.subscribe();
        if (this.editors.has(id)) return;

        const cursorManager = new CursorManager({ editor, tooltips: true, tooltipDuration: 1 });
        const selectionManager = new SelectionManager({ editor });

        this.cursors.forEach((cursor, cursorID) => {

            const { color, name } = cursor;
            cursorManager.addCursor(cursorID, color, name);
            selectionManager.addSelection(cursorID, color, name);

        });

        this.editors.set(id, [editor, cursorManager, selectionManager]);

        this.attachEventListeners();

    }

    /**
     * Disposes all cursors, selection from the editor
     * @param {string} id - The editor's ID from its .getId() method
     */
    removeEditor(id: string) {

        if (!this.editors.has(id)) return;

        const [, cursorManager, selectionManager] = this.editors.get(id)!;

        cursorManager.dispose();
        selectionManager.dispose();

        this.editors.delete(id);

        if (this.editors.size === 0) this.prescence.unsubscribe();

        this.attachEventListeners();

    }

    /**
     * Close all cursors and clean up
     * Disposes all cursor and selection listeners and destroys the prescence.
     */
    dispose() {

        const { editors } = this;

        editors.forEach(([, cursorManager, selectionManager]) => {

            cursorManager.dispose();
            selectionManager.dispose();

        });

        this.prescence.unsubscribe(() => this.prescence.destroy());
        this.listeners.forEach((listener) => listener.dispose());

    }

}

export default ShareDBMonacoCursors;
