# lenses-freeform

The freeform MAX/MSP-like UI for Lenses: a framework of open-source data visualization and transformation Polymer web components for fetching, manipulating and visualizing data.

See the [demo page](http://lenses.github.io/lenses-freeform) for more information.

## Getting Started

This is only the front-end for Lenses. Though it is fully functional, you cannot save your created lens.

### Installation

1. Create lenses directory and inside that use 'Bower' to install the component:

  <code>bower install lenses/lenses-freeform</code> 
  
  You should get all dependencies installed in the lenses directory.
2. Run HTTP server in the lenses directory (e.g. <code>python -m SimpleHTTPServer</code>)
3. Open <code>http://localhost:8000/lenses-freeform</code> in your browser

### Using Lenses

Drag components to the canvas (starting with an input component to get data)

Connect components by dragging the little output arrow (▶) over the input arrow of the other component. As soon as the components get connected, data (if any) propagates to the new component.

Move components by dragging the name of the components.

As you click on a component, the input/output data (if any) shows up in tables above and below  the screen. You can turn that off by clicking on the top right button.

#### Some data sources from [Vegalite](http://uwdata.github.io/vegalite/)

[Barley](http://uwdata.github.io/vegalite/data/barley)

[Cars](http://uwdata.github.io/vegalite/data/cars)

[Crimea](http://uwdata.github.io/vegalite/data/crimea)

[Driving](http://uwdata.github.io/vegalite/data/driving)

[Iris](http://uwdata.github.io/vegalite/data/iris)

[Jobs](http://uwdata.github.io/vegalite/data/jobs)

[Population](http://uwdata.github.io/vegalite/data/population)

[Movies](http://uwdata.github.io/vegalite/data/movies)

[Birdstrikes](http://uwdata.github.io/vegalite/data/birdstrikes)

[Burtin](http://uwdata.github.io/vegalite/data/burtin)

[Budget 2016](http://uwdata.github.io/vegalite/data/budget)

[Climate Normals](http://uwdata.github.io/vegalite/data/climate)

[Campaigns](http://uwdata.github.io/vegalite/data/weball26)
