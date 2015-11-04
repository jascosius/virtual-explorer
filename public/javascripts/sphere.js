var createSphere = function(id,data) {

    var div = document.getElementById(id);

    var PSV = new PhotoSphereViewer({
        panorama: '/images/spheres/'+id+'.jpg',
        container: div,
        time_anim: 3000,
        navbar: true,
        navbar_style: {
            backgroundColor: 'rgba(58, 67, 77, 0.7)'
        },
    });

}
