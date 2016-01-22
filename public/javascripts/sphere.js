/**
 *
 * @param id - id of the html element
 * @param data - sphere_.....json object
 * @param photoSphereOnReady - function called when sphere is loaded
 */

var sphere;
var createSphere = function(id,data,photoSphereOnReady,startAnimation) {

    var div = document.getElementById(id);

    sphere = new CubemapViewer({
        data: data,
        container: div,
        time_anim: false,
        navbar: true,
        navbar_style: {
            backgroundColor: 'rgba(58, 67, 77, 0.7)'
        },
        onready: photoSphereOnReady,
        startAnimation: startAnimation
    });
}
