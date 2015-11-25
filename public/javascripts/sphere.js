/**
 *
 * @param id - id of the html element
 * @param data - sphere_.....json object
 * @param photoSphereOnReady - function called when sphere is loaded
 */
var createSphere = function(id,data,photoSphereOnReady) {

    var div = document.getElementById(id);

    var PSV = new CubemapViewer({
        data: data,
        container: div,
        navbar: true,
        navbar_style: {
            backgroundColor: 'rgba(58, 67, 77, 0.7)'
        },
        onready: photoSphereOnReady
    });
}
