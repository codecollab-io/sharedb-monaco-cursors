/**
 * @fileOverview
 * @name selection/selection.ts
 * @author Carl Voller <carlvoller8@gmail.com>
 * @license MIT
 */

import type { editor, IPosition } from 'monaco-editor';
import { Range } from '../api';
import type { ISelectionOptions } from '../types';

class Selection {

    private static _addDynamicStyleElement(className: string, color: string): HTMLStyleElement {

        if (typeof className !== 'string' || typeof color !== 'string') throw new Error("'classname' and 'color' have to be strings");

        const css = `.${className} {
             background-color: ${color};
        }`.trim();

        const styleElement = document.createElement('style');
        styleElement.innerText = css;
        document.head.appendChild(styleElement);

        return styleElement;

    }

    private static _swapIfNeeded(start: IPosition, end: IPosition) {

        return (start.lineNumber < end.lineNumber
            || (start.lineNumber === end.lineNumber
                && start.column <= end.column)) ? { start, end } : { start: end, end: start };

    }

    private readonly _id: string;

    private readonly _className: string;

    private readonly _styleElement: HTMLStyleElement;

    private readonly _label: string;

    private readonly _editor: editor.ICodeEditor;

    private readonly _onDisposed: () => void;

    private _startPosition: IPosition;

    private _endPosition: IPosition;

    private _decorations: string[];

    private _disposed: boolean;

    constructor(opts: ISelectionOptions) {

        const uniqueClassId = `selection-${opts.classId}`;
        this._editor = opts.monaco;
        this._id = opts.id;
        this._className = `sharedb-monaco-cursors-selection ${uniqueClassId}`;
        this._styleElement = Selection._addDynamicStyleElement(uniqueClassId, opts.color);
        this._label = opts.label;
        this._decorations = [];
        this._onDisposed = opts.onDisposed;
        this._startPosition = { lineNumber: 1, column: 1 };
        this._endPosition = { lineNumber: 1, column: 1 };
        this._disposed = false;

    }

    public getId(): string { return this._id; }

    public getStartPosition(): IPosition { return { ...this._startPosition }; }

    public getEndPosition(): IPosition { return { ...this._endPosition }; }

    public setOffsets(start: number, end: number) {

        const startPosition = this._editor.getModel()!.getPositionAt(start);
        const endPosition = this._editor.getModel()!.getPositionAt(end);

        this.setPositions(startPosition, endPosition);

    }

    public setPositions(start: IPosition, end: IPosition) {

        // this._decorations = this._editor.deltaDecorations(this._decorations, []);
        const ordered = Selection._swapIfNeeded(start, end);
        this._startPosition = ordered.start;
        this._endPosition = ordered.end;
        this._render();

    }

    public show() { this._render(); }

    public hide() { this._decorations = this._editor.deltaDecorations(this._decorations, []); }

    public isDisposed(): boolean { return this._disposed; }

    public dispose() {

        if (!this._disposed) {

            this._styleElement.parentElement!.removeChild(this._styleElement);
            this.hide();
            this._disposed = true;
            this._onDisposed();

        }

    }

    private _render() {

        this._decorations = this._editor.deltaDecorations(
            this._decorations,
            [{
                range: new Range(
                    this._startPosition.lineNumber,
                    this._startPosition.column,
                    this._endPosition.lineNumber,
                    this._endPosition.column,
                ),
                options: {
                    className: this._className,
                    hoverMessage: this._label != null ? {
                        value: this._label,
                    } : null,
                },
            }],
        );

    }

}

export default Selection;
