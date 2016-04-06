(function (window) {
    "use strict";
    if (window.explore === undefined) {
        window.explore = {};
    }
    if (window.explore.sphere === undefined) {
        window.explore.sphere = {};
    }
    var sphere = window.explore.sphere;
    var $ = window.$;
    var self = null;

    sphere.Events = {
        _sphere: null,

        init: function (sphereObj) {
            self = this;
            self._sphere = sphereObj;

            self.addEvent(window,'resize',self._sphere.fitToContainer);

            return self;
        },
        addEvent: function (elt, evt, f) {
            if (!!elt.addEventListener)
                elt.addEventListener(evt, f, false);
            else
                elt.attachEvent('on' + evt, f);
        }

    };

}(window));