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
    private monaco;
    private prescenceId;
    private editors;
    private listeners;
    private connection;
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
    dispose(): void;
}
export default ShareDBMonacoCursors;
