/**
 * sharedb-monaco-cursors
 * Real-time collaborative cursors for the sharedb-monaco package
 *
 * @name index.ts
 * @author Carl Ian Voller <carlvoller8@gmail.com>
 * @license MIT
 */
import type Monaco from 'monaco-editor';
import type { ShareDBMonacoCursorsOptions } from './types';
declare class ShareDBMonacoCursors implements Monaco.IDisposable {
    private prescenceId;
    private editors;
    private listeners;
    private prescence;
    private localPrescence;
    private viewOnly;
    private name;
    private cursors;
    private colors;
    constructor(opts: ShareDBMonacoCursorsOptions);
    private onDidChangeCursorPosition;
    private onDidChangeCursorSelection;
    private attachEventListeners;
    /**
     * Toggles the View-Only state of the cursors.
     * When set to true, this user's cursors will not be broadcasted.
     * @param {boolean} viewOnly - Set to true to set to View-Only mode
     */
    setViewOnly(viewOnly: boolean): void;
    /**
     * Add an editor
     * @param {Monaco.editor.ICodeEditor} editor - The ICodeEditor instance
     */
    addEditor(editor: Monaco.editor.ICodeEditor): void;
    /**
     * Disposes all cursors, selection from the editor
     * @param {string} id - The editor's ID from its .getId() method
     */
    removeEditor(id: string): void;
    /**
     * Close all cursors and clean up
     * Disposes all cursor and selection listeners and destroys the prescence.
     */
    dispose(): void;
}
export default ShareDBMonacoCursors;
