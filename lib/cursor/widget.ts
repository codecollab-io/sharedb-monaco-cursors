/**
 * @fileOverview
 * @name cursor/widget.ts
 * @author Carl Voller <carlvoller8@gmail.com>
 * @license MIT
 */

import type Monaco from 'monaco-editor';
import type { CursorWidgetOptions } from '../types';

class CursorWidget implements Monaco.editor.IContentWidget, Monaco.IDisposable {

    private readonly _id: string;

    private readonly _editor: Monaco.editor.ICodeEditor;

    private readonly _domNode: HTMLDivElement;

    private readonly _tooltipNode: HTMLDivElement | null;

    private readonly _tooltipDuration: number;

    private readonly _scrollListener: Monaco.IDisposable | null;

    private readonly _onDisposed: () => void;

    private _position: Monaco.editor.IContentWidgetPosition | null = null;

    private _offset: number;

    private _hideTimer: any;

    private _disposed: boolean;

    constructor(opts: CursorWidgetOptions) {

        const {
            editor, tooltipDuration, widgetId, onDisposed, color, tooltipEnabled, label,
        } = opts;

        this._editor = editor;
        this._tooltipDuration = tooltipDuration;
        this._id = `cursor-${widgetId}`;
        this._onDisposed = onDisposed;

        const lineHeight = editor.getRawOptions().lineHeight || 23;
        this._domNode = document.createElement('div');
        this._domNode.className = 'sharedb-monaco-cursors-cursor';
        this._domNode.style.background = color;
        this._domNode.style.height = `${lineHeight}px`;

        if (tooltipEnabled) {

            this._tooltipNode = document.createElement('div');
            this._tooltipNode.className = 'sharedb-monaco-cursors-tooltip';
            this._tooltipNode.style.background = color;
            this._tooltipNode.innerHTML = label;
            this._domNode.appendChild(this._tooltipNode);

            // we only need to listen to scroll positions to update the
            // tooltip location on scrolling.
            this._scrollListener = editor.onDidScrollChange(() => this._updateTooltipPosition());

        } else {

            this._tooltipNode = null;
            this._scrollListener = null;

        }

        this._hideTimer = null;
        this._editor.addContentWidget(this);

        this._offset = -1;

        this._disposed = false;

    }

    hide() { this._domNode.style.display = 'none'; }

    show() { this._domNode.style.display = 'inherit'; }

    setOffset(offset: number) {

        if (typeof offset !== 'number') return;

        const position = this._editor.getModel()!.getPositionAt(offset);
        this.setPosition(position);

    }

    setPosition(pos: Monaco.IPosition) {

        if (typeof pos.lineNumber !== 'number' || typeof pos.column !== 'number') return;

        this._updatePosition(pos);

        if (this._tooltipNode !== null) setTimeout(() => this._showTooltip(), 0);

    }

    isDisposed(): boolean { return this._disposed; }

    dispose(): void {

        if (this._disposed) return;

        this._editor.removeContentWidget(this);
        this._editor.render(true);
        if (this._scrollListener !== null) this._scrollListener.dispose();

        this._disposed = true;

        this._onDisposed();

    }

    getId(): string { return this._id; }

    getDomNode(): HTMLElement { return this._domNode; }

    getPosition(): Monaco.editor.IContentWidgetPosition | null { return this._position; }

    private _updatePosition(position: Monaco.IPosition): void {

        this._position = {
            position: { ...position },
            preference: [0],
        };

        this._offset = this._editor.getModel()?.getOffsetAt(position) ?? 0;

        this._editor.layoutContentWidget(this);

    }

    private _showTooltip(): void {

        this._updateTooltipPosition();

        if (this._hideTimer !== null) clearTimeout(this._hideTimer);
        else this._setTooltipVisible(true);

        this._hideTimer = setTimeout(() => {

            this._setTooltipVisible(false);
            this._hideTimer = null;

        }, this._tooltipDuration);

    }

    private _updateTooltipPosition(): void {

        if (!this._tooltipNode) return;

        const distanceFromTop = this._domNode.offsetTop - this._editor.getScrollTop();

        if (distanceFromTop - this._tooltipNode.offsetHeight < 5) this._tooltipNode.style.top = `${this._tooltipNode.offsetHeight + 2}px`;
        else this._tooltipNode.style.top = `-${this._tooltipNode.offsetHeight}px`;

        this._tooltipNode.style.left = '0';

    }

    private _setTooltipVisible(visible: boolean): void {

        if (!this._tooltipNode) return;
        if (visible) this._tooltipNode.style.opacity = '1.0';
        else this._tooltipNode.style.opacity = '0';

    }

}

export default CursorWidget;
