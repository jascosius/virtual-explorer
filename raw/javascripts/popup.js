(function (window) {
    "use strict";
    if (window.explore === undefined) {
        window.explore = {};
    }
    if (window.explore.sphere === undefined) {
        window.explore.sphere = {};
    }
    var explore = window.explore;
    var $ = window.$;

    explore.Popup = {

        _element: null,
        _markdownRenderer: null,
        _eventFunction: null,

        init: function () {
            this._element = document.querySelector('#infoPopup');
            this._eventFunction = this.showPopup.bind(this);

            var markdownRenderer = this._markdownRenderer = new marked.Renderer();
            markdownRenderer.link = function (href, title, text) {
                var out;
                if (href.substring(0, 1) === '#') {
                    href = href.substring(1);
                    out = '<a href="javascript:void(0)" onclick="window.explore.popup.changePopup(\'' + href + '\');"'
                } else {
                    out = '<a href="' + href + '" TARGET="_blank"';
                }
                if (title) {
                    out += ' title="' + title + '"';
                }
                out += '>' + text + '</a>';
                return out;
            };

            return this;

        },
        showPopup: function (file) {
            var sphereDiv = document.getElementById("sphere");
            var element = this._element;
            if (file === undefined || file === null || file.target !== undefined || element.style.display === 'block') {
                element.style.display = 'none';
                $("#infoPopup").empty();
                explore.removeEvent(sphereDiv, 'mouseup', this._eventFunction);
                explore.removeEvent(sphereDiv, 'touchend', this._eventFunction);
            } else {
                var path = "/infos/" + explore.config.languages[explore.config.lang].lang + "/" + file + ".html";
                $.get(path, function (html) {
                    $("#infoPopup").html(html);
                });
                element.style.display = 'block';
                explore.addEvent(sphereDiv, 'mouseup', this._eventFunction);
                explore.addEvent(sphereDiv, 'touchend', this._eventFunction);
            }
        },
        
        isOpen: function () {
            return this._element.style.display === 'block';
        },

        changePopup: function (file) {
            var path = "/infos/" + explore.config.languages[explore.config.lang].lang + "/" + file + ".html";
            $.get(path, function (html) {
                $("#infoPopup").html(html);
            });
        }
    };

}(window));