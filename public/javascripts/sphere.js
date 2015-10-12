var div = document.getElementById('sphere');
/* https://seabox.informatik.uni-kiel.de/d/ef70b81e93/ */
var PSV = new PhotoSphereViewer({
    panorama: '/images/spheres/example.jpg',
    container: div,
    time_anim: 3000,
    navbar: true,
    navbar_style: {
        backgroundColor: 'rgba(58, 67, 77, 0.7)'
    },
});
