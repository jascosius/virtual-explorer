$.getJSON( "/json/map/example.json", function( data ) {
    console.log(data);
    console.log(data.bottomright.longitude);
    console.log(data.spheres.example.latitude)
});
