/**
 * @fileOverview
 * @name cursor/manager.ts
 * @author Carl Voller <carlvoller8@gmail.com>
 * @license MIT
 */

import type Monaco from 'monaco-editor';
import CursorWidget from './widget';
import type { ICursorManagerOptions } from '../types';

class CursorManager implements Monaco.IDisposable {

    private readonly _cursorWidgets: Map<string, CursorWidget>;

    private readonly _options: ICursorManagerOptions;

    private _nextWidgetId: number;

    constructor(opts: ICursorManagerOptions) {

        this._cursorWidgets = new Map<string, CursorWidget>();
        this._options = opts;
        this._nextWidgetId = 0;

    }

    addCursor(id: string, color: string, label: string): CursorWidget {

        if (typeof id !== 'string' || typeof color !== 'string' || typeof label !== 'string') throw new Error('one or more params are empty or not strings');

        this._nextWidgetId += 1;
        const widgetId = this._nextWidgetId.toString();
        const tooltipDurationMs = this._options.tooltipDuration * 1000;
        const cursorWidget = new CursorWidget({
            editor: this._options.editor,
            widgetId,
            color,
            label,
            tooltipEnabled: this._options.tooltips,
            tooltipDuration: tooltipDurationMs,
            onDisposed: () => this.removeCursor(id),
        });

        this._cursorWidgets.set(id, cursorWidget);

        return cursorWidget;

    }

    removeCursor(id: string) {

        if (typeof id !== 'string') throw new Error("'id' must be a string");

        try {

            const cursorWidget = this._getCursor(id);
            if (!cursorWidget.isDisposed()) cursorWidget.dispose();
            this._cursorWidgets.delete(id);

        } catch {

            console.warn('Cursor already removed.');

        }

    }

    setCursorPosition(id: string, position: any) {

        if (typeof id !== 'string') throw new Error("'id' must be a string");

        const cursorWidget = this._getCursor(id);
        cursorWidget.setPosition(position);

    }

    setCursorOffset(id: string, offset: number) {

        if (typeof id !== 'string') throw new Error("'id' must be a string");

        const cursorWidget = this._getCursor(id);
        cursorWidget.setOffset(offset);

    }

    showCursor(id: string) {

        if (typeof id !== 'string') throw new Error("'id' must be a string");

        const cursorWidget = this._getCursor(id);
        cursorWidget.show();

    }

    hideCursor(id: string) {

        if (typeof id !== 'string') throw new Error("'id' must be a string");

        const cursorWidget = this._getCursor(id);
        cursorWidget.hide();

    }

    private _getCursor(id: string): CursorWidget {

        if (!this._cursorWidgets.has(id)) throw new Error(`No such cursor: ${id}`);

        return this._cursorWidgets.get(id)!;

    }

    dispose() {

        this._cursorWidgets.forEach((cursor) => cursor.dispose());
        this._cursorWidgets.clear();

    }

}

export default CursorManager;
