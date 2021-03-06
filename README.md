#Virtual-Explorer

Virtual-Explorer is a web application to explore a place in 360° spheres.

![Screenshot inside a sphere](/readme/information.png)

The user can use a map to see the positions of all available spheres, have a look around and move throw the spheres.

![Screenshot of the map](/readme/map.png)

This project is the result of a master project at the University of Kiel. It will not be active developed in the near future.

## Installation

The webserver uses node.js to run. Make sure you install node.js and the packages listed in *package.json*.
The default configuration will run by default as an example, just use *grunt all* to prepare the *public* folder.
Start the webserver with *node bin/www*. The webserver will run on port 3000.

### Configuration
The raw files are stored in the folder *raw*. These files are processed by grunt which outputs the results into the *public* folder. In the *raw* folder are the following important files/folder:

* *json/maps/*:  Here is the information about the map and the clipping of the map.
* *json/spheres/*: Here is the information about the existing 360° spheres.
* *images/spheres/*: Here are folders for every sphere above, which contain the corresponding image in equirectangular projection (and will be converted by grunt).
* *locales/*: Here are the translation files for multi-language support.
* *markdown/*: Here are the markdown files for extra information in the spheres.
* *config.json*: Configuration file for available resolutions.
* *javascripts/main.js*: Configuration file for available resolutions and languages.

You can see the positions of objects inside a sphere by typing *explore.sphere.sphere.showGrid();* in the JavaScript-Console.

### Grunt

Grunt processes the files in the *raw* folder. There are the following (main) grunt tasks:
* *grunt all*: runs all grunt tasks. Use this before the first server run. This needs *[Blender](https://www.blender.org/)*, *[Hugin](http://hugin.sourceforge.net/)* and *[Panotools](http://search.cpan.org/~bpostle/Panotools-Script-0.25/)*, which has to be in your path.
* *grunt init*: runs all grunt tasks except the image processing.
* *grunt*: runs the grunt tasks to update the JavaScript and the CSS.

## Documentation
For a more detailed documentation read the [documentation](/readme/documentation-ger.pdf) (german).

## References

This project uses the following external packages:

* [i18next](http://i18next.com)
* [jQuery](https://jquery.com)
* [leaflet](http://leafletjs.com)
* [leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster)
* [leaflet-canvasicon](https://github.com/sashakavun/leaflet-canvasicon)
* [math.js](http://mathjs.org)
* [PhotoSphereViewer](https://github.com/JeremyHeleine/Photo-Sphere-Viewer)
* [three.js](http://threejs.org)