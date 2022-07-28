/**
 * @fileOverview
 * @name selection/manager.ts
 * @author Carl Voller <carlvoller8@gmail.com>
 * @license MIT
 */
import type { IPosition } from 'monaco-editor';
import Selection from './selection';
import type { ISelectionManagerOptions } from '../types';
declare class SelectionManager {
    private _nextClassId;
    private readonly _selections;
    private readonly _options;
    constructor(options: ISelectionManagerOptions);
    addSelection(id: string, color: string, label: string): Selection;
    removeSelection(id: string): void;
    setSelectionOffsets(id: string, start: number, end: number): void;
    setSelectionPositions(id: string, start: IPosition, end: IPosition): void;
    showSelection(id: string): void;
    hideSelection(id: string): void;
    private _getSelection;
    dispose(): void;
}
export default SelectionManager;
