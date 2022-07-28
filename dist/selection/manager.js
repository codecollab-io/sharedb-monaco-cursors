"use strict";
/**
 * @fileOverview
 * @name selection/manager.ts
 * @author Carl Voller <carlvoller8@gmail.com>
 * @license MIT
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var selection_1 = __importDefault(require("./selection"));
var SelectionManager = /** @class */ (function () {
    function SelectionManager(options) {
        this._selections = new Map();
        this._options = options;
        this._nextClassId = 0;
    }
    SelectionManager.prototype.addSelection = function (id, color, label) {
        var _this = this;
        var onDisposed = function () { return _this.removeSelection(id); };
        this._nextClassId += 1;
        var selection = new selection_1.default({
            monaco: this._options.editor,
            id: id,
            classId: this._nextClassId,
            color: color,
            label: label,
            onDisposed: onDisposed,
        });
        this._selections.set(id, selection);
        return selection;
    };
    SelectionManager.prototype.removeSelection = function (id) {
        var selection = this._getSelection(id);
        if (!selection.isDisposed())
            selection.dispose();
    };
    SelectionManager.prototype.setSelectionOffsets = function (id, start, end) {
        var selection = this._getSelection(id);
        selection.setOffsets(start, end);
    };
    SelectionManager.prototype.setSelectionPositions = function (id, start, end) {
        var selection = this._getSelection(id);
        selection.setPositions(start, end);
    };
    SelectionManager.prototype.showSelection = function (id) {
        var selection = this._getSelection(id);
        selection.show();
    };
    SelectionManager.prototype.hideSelection = function (id) {
        var selection = this._getSelection(id);
        selection.hide();
    };
    SelectionManager.prototype._getSelection = function (id) {
        if (!this._selections.has(id))
            throw new Error("No such selection: ".concat(id));
        return this._selections.get(id);
    };
    SelectionManager.prototype.dispose = function () {
        this._selections.forEach(function (selection) { return selection.dispose(); });
        this._selections.clear();
    };
    return SelectionManager;
}());
exports.default = SelectionManager;
