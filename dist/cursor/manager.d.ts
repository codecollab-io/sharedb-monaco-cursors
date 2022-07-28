/**
 * @fileOverview
 * @name cursor/manager.ts
 * @author Carl Voller <carlvoller8@gmail.com>
 * @license MIT
 */
import type Monaco from 'monaco-editor';
import CursorWidget from './widget';
import type { ICursorManagerOptions } from '../types';
declare class CursorManager implements Monaco.IDisposable {
    private readonly _cursorWidgets;
    private readonly _options;
    private _nextWidgetId;
    constructor(opts: ICursorManagerOptions);
    addCursor(id: string, color: string, label: string): CursorWidget;
    removeCursor(id: string): void;
    setCursorPosition(id: string, position: any): void;
    setCursorOffset(id: string, offset: number): void;
    showCursor(id: string): void;
    hideCursor(id: string): void;
    private _getCursor;
    dispose(): void;
}
export default CursorManager;
