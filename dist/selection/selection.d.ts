/**
 * @fileOverview
 * @name selection/selection.ts
 * @author Carl Voller <carlvoller8@gmail.com>
 * @license MIT
 */
import type { IPosition } from 'monaco-editor';
import type { ISelectionOptions } from '../types';
declare class Selection {
    private static _addDynamicStyleElement;
    private static _swapIfNeeded;
    private readonly _id;
    private readonly _className;
    private readonly _styleElement;
    private readonly _label;
    private readonly _editor;
    private readonly _onDisposed;
    private _startPosition;
    private _endPosition;
    private _decorations;
    private _disposed;
    constructor(opts: ISelectionOptions);
    getId(): string;
    getStartPosition(): IPosition;
    getEndPosition(): IPosition;
    setOffsets(start: number, end: number): void;
    setPositions(start: IPosition, end: IPosition): void;
    show(): void;
    hide(): void;
    isDisposed(): boolean;
    dispose(): void;
    private _render;
}
export default Selection;
