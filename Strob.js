/*global interact, Rx */

/**
 * Strob: STReamable OBjects
 *
 * This is a library that creates streamable shapes using RxJS. It uses
 * interact to make objects draggable and resizable. Both libraries must be
 * loaded prior to loading this script.
 */
(function(global) {
    function InteractiveRect(selector, options) {
        var elem = this._elem = document.querySelector(selector);

        this._minWidth = options && ("minWidth" in options) ? options.minWidth : 25;
        this._minHeight = options && ("minHeight" in options) ? options.minHeight : 25;

        this._rect = {
            x: +elem.getAttribute("x"),
            y: +elem.getAttribute("y"),
            width: +elem.getAttribute("width"),
            height: +elem.getAttribute("height")
        };

        var self = this;
        this.outStream = Rx.Observable.create(function(observer) {
            self._observer = observer;
            self._onUpdate();
        }).publish();

        var interactive = interact(selector);

        if (!options || !("draggable" in options) || options.draggable) {
            interactive.draggable({
                restrict: {
                    restriction: "parent",
                    elementRect: { left: 0, right: 1, top: 0, bottom: 1 }
                },
                onmove: this._onMove.bind(this)
            });
        }

        if (!options || !("resizable" in options) || options.resizable) {
            interactive.resizable({
                edges: {
                    left: true,
                    right: true,
                    top: true,
                    bottom: true
                },
                restrict: {
                    restriction: "parent"
                }
            })
            .on("resizemove", this._onResize.bind(this));
        }
    }

    InteractiveRect.prototype = {
        _onMove: function(event) {
            this._rect.x += event.dx;
            this._rect.y += event.dy;
            this._onUpdate();
        },

        _onResize: function(event) {
            var rect = this._rect;
            var prevWidth = rect.width;
            var prevHeight = rect.height;
            rect.width = Math.max(this._minWidth, event.rect.width);
            rect.height = Math.max(this._minHeight, event.rect.height);
            if (event.deltaRect.width) {
                rect.x += (event.dx * (rect.width - prevWidth)) / (2 * event.deltaRect.width);
            }
            if (event.deltaRect.height) {
                rect.y += (event.dy * (rect.height - prevHeight)) / (2 * event.deltaRect.height);
            }
            this._onUpdate();
        },

        _onUpdate: function() {
            var rect = this._rect;
            this._elem.setAttribute("x", rect.x - rect.width / 2);
            this._elem.setAttribute("y", rect.y - rect.height / 2);
            this._elem.setAttribute("width", rect.width);
            this._elem.setAttribute("height", rect.height);
            this._observer.onNext({ x: rect.x, y: rect.y, width: rect.width, height: rect.height });
        }
    };

    function StreamRect(selector, stream) {
        var elem = document.querySelector(selector);
        stream.subscribe(function(event) {
            elem.setAttribute("x", event.x - event.width / 2);
            elem.setAttribute("y", event.y - event.height / 2);
            elem.setAttribute("width", event.width);
            elem.setAttribute("height", event.height);
        });
    }

    function StreamCircle(selector, stream) {
        var elem = document.querySelector(selector);
        stream.subscribe(function(event) {
            elem.setAttribute("cx", event.x);
            elem.setAttribute("cy", event.y);
            elem.setAttribute("r", event.r);
        });
    }

    function StreamRay(selector, stream) {
        var elem = document.querySelector(selector);
        stream.subscribe(function(event) {
            var from = event.from;
            var to = event.to;
            var d = ["M", from.x, from.y, "L", to.x, to.y].join(" ");
            elem.setAttribute("d", d);
        });
    }

    function StreamVertSlab(selector, stream) {
        var elem = document.querySelector(selector);
        elem.setAttribute("y", -1);
        elem.setAttribute("height", "101%");

        stream.subscribe(function(event) {
            elem.setAttribute("x", event.x - event.width / 2);
            elem.setAttribute("width", event.width);
        });
    }

    function StreamHorizSlab(selector, stream) {
        var elem = document.querySelector(selector);
        elem.setAttribute("x", -1);
        elem.setAttribute("width", "101%");

        stream.subscribe(function(event) {
            elem.setAttribute("y", event.y - event.height / 2);
            elem.setAttribute("height", event.height);
        });
    }

    global.Strob = {
        InteractiveRect: InteractiveRect,
        StreamRect: StreamRect,
        StreamCircle: StreamCircle,
        StreamRay: StreamRay,
        StreamVertSlab: StreamVertSlab,
        StreamHorizSlab: StreamHorizSlab
    };
})(this);
