/**
 * Class to handle the popup to show information on top of the map/sphere
 */
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

        _element: null, //div of the popup
        _eventFunction: null,

        /**
         * Initializes a Popup object
         * @returns {window.explore.Popup}
         */
        init: function () {
            this._element = document.querySelector('#infoPopup');
            this._eventFunction = this.showPopup.bind(this);

            return this;

        },
        /**
         * Shows a popup with the content of file. File is just the filename of a html file in /infos/
         * Close the popup if already opened or 'file' is 'null'
         * @param file {string} - file to show
         */
        showPopup: function (file) {
            var sphereDiv = document.getElementById("sphere");
            var element = this._element;
            //Check if file is a string and not an event if called from eventListener
            if (file == null || file.target !== undefined || element.style.display === 'block') {
                element.style.display = 'none';
                $("#infoPopup").empty();
                //Remove events to close popup
                if(sphereDiv != null) {
                    explore.removeEvent(sphereDiv, 'mouseup', this._eventFunction);
                    explore.removeEvent(sphereDiv, 'touchend', this._eventFunction);
                }
            } else {
                var path = "/infos/" + explore.config.languages[explore.config.lang].lang + "/" + file + ".html";
                $.get(path, function (html) {
                    $("#infoPopup").html(html);
                });
                element.style.display = 'block';
                //Add events to close popup if clicked next to it
                if(sphereDiv != null) {
                    explore.addEvent(sphereDiv, 'mouseup', this._eventFunction);
                    explore.addEvent(sphereDiv, 'touchend', this._eventFunction);
                }
            }
        },

        /**
         * Check if a popup is open
         * @returns {boolean}
         */
        isOpen: function () {
            return this._element.style.display === 'block';
        },

        /**
         * Loads new content into a popup without closing it
         * @param file {string} - file to show
         */
        changePopup: function (file) {
            var path = "/infos/" + explore.config.languages[explore.config.lang].lang + "/" + file + ".html";
            $.get(path, function (html) {
                $("#infoPopup").html(html);
            });
        }
    };

}(window));