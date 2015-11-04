/**
 *
 * @param id - id of the html element
 * @param data - sphere_.....json object
 */
var createSphere = function(id,data) {

    var div = document.getElementById(id);

    console.log(data.image.highres);

    var PSV = new PhotoSphereViewer({
        panorama: data.image.highres,
        container: div,
        time_anim: 3000,
        navbar: true,
        navbar_style: {
            backgroundColor: 'rgba(58, 67, 77, 0.7)'
        },
    });

}
