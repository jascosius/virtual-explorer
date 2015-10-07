var div = document.getElementById('sphere');
var PSV = new PhotoSphereViewer({
    panorama: 'https://seabox.informatik.uni-kiel.de/seafhttp/files/91963183-3f2f-4509-ab60-947550278872/example.jpg',
    container: div,
    time_anim: 3000,
    navbar: true,
    navbar_style: {
        backgroundColor: 'rgba(58, 67, 77, 0.7)'
    },
});
