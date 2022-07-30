"use strict";
/**
 * @fileOverview
 * @name cursor/widget.ts
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
var CursorWidget = /** @class */ (function () {
    function CursorWidget(opts) {
        var _this = this;
        this._position = null;
        var editor = opts.editor, tooltipDuration = opts.tooltipDuration, widgetId = opts.widgetId, onDisposed = opts.onDisposed, color = opts.color, tooltipEnabled = opts.tooltipEnabled, label = opts.label;
        this._editor = editor;
        this._tooltipDuration = tooltipDuration;
        this._id = "cursor-".concat(widgetId);
        this._onDisposed = onDisposed;
        var lineHeight = editor.getOption(56);
        this._domNode = document.createElement('div');
        this._domNode.className = 'sharedb-monaco-cursors-cursor';
        this._domNode.style.background = color;
        this._domNode.style.height = "".concat(lineHeight, "px");
        if (tooltipEnabled) {
            this._tooltipNode = document.createElement('div');
            this._tooltipNode.className = 'sharedb-monaco-cursors-tooltip';
            this._tooltipNode.style.background = color;
            this._tooltipNode.innerHTML = label;
            this._domNode.appendChild(this._tooltipNode);
            // we only need to listen to scroll positions to update the
            // tooltip location on scrolling.
            this._scrollListener = editor.onDidScrollChange(function () { return _this._updateTooltipPosition(); });
        }
        else {
            this._tooltipNode = null;
            this._scrollListener = null;
        }
        this._hideTimer = null;
        this._editor.addContentWidget(this);
        this._offset = -1;
        this._disposed = false;
    }
    CursorWidget.prototype.hide = function () { this._domNode.style.display = 'none'; };
    CursorWidget.prototype.show = function () { this._domNode.style.display = 'inherit'; };
    CursorWidget.prototype.setOffset = function (offset) {
        if (typeof offset !== 'number')
            return;
        var position = this._editor.getModel().getPositionAt(offset);
        this.setPosition(position);
    };
    CursorWidget.prototype.setPosition = function (pos) {
        var _this = this;
        if (typeof pos.lineNumber !== 'number' || typeof pos.column !== 'number')
            return;
        this._updatePosition(pos);
        if (this._tooltipNode !== null)
            setTimeout(function () { return _this._showTooltip(); }, 0);
    };
    CursorWidget.prototype.isDisposed = function () { return this._disposed; };
    CursorWidget.prototype.dispose = function () {
        if (this._disposed)
            return;
        this._editor.removeContentWidget(this);
        this._editor.render(true);
        if (this._scrollListener !== null)
            this._scrollListener.dispose();
        this._disposed = true;
        this._onDisposed();
    };
    CursorWidget.prototype.getId = function () { return this._id; };
    CursorWidget.prototype.getDomNode = function () { return this._domNode; };
    CursorWidget.prototype.getPosition = function () { return this._position; };
    CursorWidget.prototype._updatePosition = function (position) {
        var _a, _b;
        this._position = {
            position: __assign({}, position),
            preference: [0],
        };
        this._offset = (_b = (_a = this._editor.getModel()) === null || _a === void 0 ? void 0 : _a.getOffsetAt(position)) !== null && _b !== void 0 ? _b : 0;
        this._editor.layoutContentWidget(this);
    };
    CursorWidget.prototype._showTooltip = function () {
        var _this = this;
        this._updateTooltipPosition();
        if (this._hideTimer !== null)
            clearTimeout(this._hideTimer);
        else
            this._setTooltipVisible(true);
        this._hideTimer = setTimeout(function () {
            _this._setTooltipVisible(false);
            _this._hideTimer = null;
        }, this._tooltipDuration);
    };
    CursorWidget.prototype._updateTooltipPosition = function () {
        if (!this._tooltipNode)
            return;
        var distanceFromTop = this._domNode.offsetTop - this._editor.getScrollTop();
        if (distanceFromTop - this._tooltipNode.offsetHeight < 5)
            this._tooltipNode.style.top = "".concat(this._tooltipNode.offsetHeight + 2, "px");
        else
            this._tooltipNode.style.top = "-".concat(this._tooltipNode.offsetHeight, "px");
        this._tooltipNode.style.left = '0';
    };
    CursorWidget.prototype._setTooltipVisible = function (visible) {
        if (!this._tooltipNode)
            return;
        if (visible)
            this._tooltipNode.style.opacity = '1.0';
        else
            this._tooltipNode.style.opacity = '0';
    };
    return CursorWidget;
}());
exports.default = CursorWidget;
