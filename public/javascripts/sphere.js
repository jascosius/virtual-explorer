/**
 *
 * @param id - id of the html element
 * @param data - sphere_.....json object
 * @param photoSphereOnReady - function called when sphere is loaded
 */
var createSphere = function(id,data,photoSphereOnReady) {

    var div = document.getElementById(id);

    var PSV = new PhotoSphereViewer({
        panorama: data.image.highres,
        container: div,
        time_anim: 3000,
        navbar: true,
        navbar_style: {
            backgroundColor: 'rgba(58, 67, 77, 0.7)'
        },
        onready: photoSphereOnReady
    });
}
