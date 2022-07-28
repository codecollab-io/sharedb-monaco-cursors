// Type definitions for sharedb-monaco
// Project: https://github.com/codecollab-io/sharedb-monaco-cursors
// Definitions by: Carl Voller <https://github.com/Portatolova>
// TypeScript Version: 4.7

import type Monaco from 'monaco-editor';
import type { Connection } from 'sharedb/lib/client';

export type Cursor = {
    name: string;
    color: string;
}

export type ShareDBMonacoCursorsOptions = {
    monaco: typeof Monaco;
    connection: Connection;
    namespace: string;
    id: string;
    viewOnly: boolean;
    name: string;
    colors?: string[];
    editors: Monaco.editor.ICodeEditor[];
}

export type ISelectionManagerOptions = {
    editor: Monaco.editor.ICodeEditor;
}

export type ISelectionOptions = {
    monaco: Monaco.editor.ICodeEditor,
    id: string,
    classId: number,
    color: string,
    label: string,
    onDisposed: () => void;
}

export type ICursorManagerOptions = {
    editor: Monaco.editor.ICodeEditor;
    tooltips: boolean;
    tooltipDuration: number;
}

export type CursorWidgetOptions = {
    editor: Monaco.editor.ICodeEditor;
    widgetId: string;
    color: string;
    label: string;
    tooltipEnabled: boolean;
    tooltipDuration: number;
    onDisposed: () => void;
}
