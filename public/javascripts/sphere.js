/**
 *
 * @param id - id of the html element
 * @param data - sphere_.....json object
 */
var createSphere = function(id,data) {

    var div = document.getElementById(id);

    var PSV = new SphereViewer({
        data: data,
        container: div,
    });

}
