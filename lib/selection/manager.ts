/**
 * @fileOverview
 * @name selection/manager.ts
 * @author Carl Voller <carlvoller8@gmail.com>
 * @license MIT
 */

import type { IPosition } from 'monaco-editor';
import Selection from './selection';
import type { ISelectionManagerOptions } from '../types';

class SelectionManager {

    private _nextClassId: number;

    private readonly _selections: Map<string, Selection>;

    private readonly _options: ISelectionManagerOptions;

    constructor(options: ISelectionManagerOptions) {

        this._selections = new Map<string, Selection>();
        this._options = options;
        this._nextClassId = 0;

    }

    addSelection(id: string, color: string, label: string): Selection {

        const onDisposed = () => this.removeSelection(id);

        this._nextClassId += 1;

        const selection = new Selection({
            monaco: this._options.editor,
            id,
            classId: this._nextClassId,
            color,
            label,
            onDisposed,
        });

        this._selections.set(id, selection);
        return selection;

    }

    removeSelection(id: string) {

        try {

            const selection = this._getSelection(id);
            if (!selection.isDisposed()) selection.dispose();

        } catch {

            console.warn('Selection is already removed.');

        }

    }

    setSelectionOffsets(id: string, start: number, end: number) {

        const selection = this._getSelection(id);
        selection.setOffsets(start, end);

    }

    setSelectionPositions(id: string, start: IPosition, end: IPosition) {

        const selection = this._getSelection(id);
        selection.setPositions(start, end);

    }

    showSelection(id: string) {

        const selection = this._getSelection(id);
        selection.show();

    }

    hideSelection(id: string) {

        const selection = this._getSelection(id);
        selection.hide();

    }

    private _getSelection(id: string): Selection {

        if (!this._selections.has(id)) throw new Error(`No such selection: ${id}`);

        return this._selections.get(id)!;

    }

    dispose() {

        this._selections.forEach((selection) => selection.dispose());
        this._selections.clear();

    }

}

export default SelectionManager;
