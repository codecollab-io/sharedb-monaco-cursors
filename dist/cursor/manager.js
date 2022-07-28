"use strict";
/**
 * @fileOverview
 * @name cursor/manager.ts
 * @author Carl Voller <carlvoller8@gmail.com>
 * @license MIT
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var widget_1 = __importDefault(require("./widget"));
var CursorManager = /** @class */ (function () {
    function CursorManager(opts) {
        this._cursorWidgets = new Map();
        this._options = opts;
        this._nextWidgetId = 0;
    }
    CursorManager.prototype.addCursor = function (id, color, label) {
        var _this = this;
        if (typeof id !== 'string' || typeof color !== 'string' || typeof label !== 'string')
            throw new Error('one or more params are empty or not strings');
        this._nextWidgetId += 1;
        var widgetId = this._nextWidgetId.toString();
        var tooltipDurationMs = this._options.tooltipDuration * 1000;
        var cursorWidget = new widget_1.default({
            editor: this._options.editor,
            widgetId: widgetId,
            color: color,
            label: label,
            tooltipEnabled: this._options.tooltips,
            tooltipDuration: tooltipDurationMs,
            onDisposed: function () { return _this.removeCursor(id); },
        });
        this._cursorWidgets.set(id, cursorWidget);
        return cursorWidget;
    };
    CursorManager.prototype.removeCursor = function (id) {
        if (typeof id !== 'string')
            throw new Error("'id' must be a string");
        var cursorWidget = this._getCursor(id);
        if (!cursorWidget.isDisposed())
            cursorWidget.dispose();
        this._cursorWidgets.delete(id);
    };
    CursorManager.prototype.setCursorPosition = function (id, position) {
        if (typeof id !== 'string')
            throw new Error("'id' must be a string");
        var cursorWidget = this._getCursor(id);
        cursorWidget.setPosition(position);
    };
    CursorManager.prototype.setCursorOffset = function (id, offset) {
        if (typeof id !== 'string')
            throw new Error("'id' must be a string");
        var cursorWidget = this._getCursor(id);
        cursorWidget.setOffset(offset);
    };
    CursorManager.prototype.showCursor = function (id) {
        if (typeof id !== 'string')
            throw new Error("'id' must be a string");
        var cursorWidget = this._getCursor(id);
        cursorWidget.show();
    };
    CursorManager.prototype.hideCursor = function (id) {
        if (typeof id !== 'string')
            throw new Error("'id' must be a string");
        var cursorWidget = this._getCursor(id);
        cursorWidget.hide();
    };
    CursorManager.prototype._getCursor = function (id) {
        if (!this._cursorWidgets.has(id))
            throw new Error("No such cursor: ".concat(id));
        return this._cursorWidgets.get(id);
    };
    CursorManager.prototype.dispose = function () {
        this._cursorWidgets.forEach(function (cursor) { return cursor.dispose(); });
        this._cursorWidgets.clear();
    };
    return CursorManager;
}());
exports.default = CursorManager;
