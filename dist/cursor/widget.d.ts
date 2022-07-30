/**
 * @fileOverview
 * @name cursor/widget.ts
 * @author Carl Voller <carlvoller8@gmail.com>
 * @license MIT
 */
import Monaco from 'monaco-editor';
import type { CursorWidgetOptions } from '../types';
declare class CursorWidget implements Monaco.editor.IContentWidget, Monaco.IDisposable {
    private readonly _id;
    private readonly _editor;
    private readonly _domNode;
    private readonly _tooltipNode;
    private readonly _tooltipDuration;
    private readonly _scrollListener;
    private readonly _onDisposed;
    private _position;
    private _offset;
    private _hideTimer;
    private _disposed;
    constructor(opts: CursorWidgetOptions);
    hide(): void;
    show(): void;
    setOffset(offset: number): void;
    setPosition(pos: Monaco.IPosition): void;
    isDisposed(): boolean;
    dispose(): void;
    getId(): string;
    getDomNode(): HTMLElement;
    getPosition(): Monaco.editor.IContentWidgetPosition | null;
    private _updatePosition;
    private _showTooltip;
    private _updateTooltipPosition;
    private _setTooltipVisible;
}
export default CursorWidget;
