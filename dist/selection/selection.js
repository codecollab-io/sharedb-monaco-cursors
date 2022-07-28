"use strict";
/**
 * @fileOverview
 * @name selection/selection.ts
 * @author Carl Voller <carlvoller8@gmail.com>
 * @license MIT
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var api_1 = require("../api");
var Selection = /** @class */ (function () {
    function Selection(opts) {
        var uniqueClassId = "selection-".concat(opts.classId);
        this._editor = opts.monaco;
        this._id = opts.id;
        this._className = "sharedb-monaco-cursors-selection ".concat(uniqueClassId);
        this._styleElement = Selection._addDynamicStyleElement(uniqueClassId, opts.color);
        this._label = opts.label;
        this._decorations = [];
        this._onDisposed = opts.onDisposed;
        this._startPosition = { lineNumber: 1, column: 1 };
        this._endPosition = { lineNumber: 1, column: 1 };
        this._disposed = false;
    }
    Selection._addDynamicStyleElement = function (className, color) {
        if (typeof className !== 'string' || typeof color !== 'string')
            throw new Error("'classname' and 'color' have to be strings");
        var css = ".".concat(className, " {\n             background-color: ").concat(color, ";\n        }").trim();
        var styleElement = document.createElement('style');
        styleElement.innerText = css;
        document.head.appendChild(styleElement);
        return styleElement;
    };
    Selection._swapIfNeeded = function (start, end) {
        return (start.lineNumber < end.lineNumber
            || (start.lineNumber === end.lineNumber
                && start.column <= end.column)) ? { start: start, end: end } : { start: end, end: start };
    };
    Selection.prototype.getId = function () { return this._id; };
    Selection.prototype.getStartPosition = function () { return __assign({}, this._startPosition); };
    Selection.prototype.getEndPosition = function () { return __assign({}, this._endPosition); };
    Selection.prototype.setOffsets = function (start, end) {
        var startPosition = this._editor.getModel().getPositionAt(start);
        var endPosition = this._editor.getModel().getPositionAt(end);
        this.setPositions(startPosition, endPosition);
    };
    Selection.prototype.setPositions = function (start, end) {
        // this._decorations = this._editor.deltaDecorations(this._decorations, []);
        var ordered = Selection._swapIfNeeded(start, end);
        this._startPosition = ordered.start;
        this._endPosition = ordered.end;
        this._render();
    };
    Selection.prototype.show = function () { this._render(); };
    Selection.prototype.hide = function () { this._decorations = this._editor.deltaDecorations(this._decorations, []); };
    Selection.prototype.isDisposed = function () { return this._disposed; };
    Selection.prototype.dispose = function () {
        if (!this._disposed) {
            this._styleElement.parentElement.removeChild(this._styleElement);
            this.hide();
            this._disposed = true;
            this._onDisposed();
        }
    };
    Selection.prototype._render = function () {
        this._decorations = this._editor.deltaDecorations(this._decorations, [{
                range: new api_1.Range(this._startPosition.lineNumber, this._startPosition.column, this._endPosition.lineNumber, this._endPosition.column),
                options: {
                    className: this._className,
                    hoverMessage: this._label != null ? {
                        value: this._label,
                    } : null,
                },
            }]);
    };
    return Selection;
}());
exports.default = Selection;
