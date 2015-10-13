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

### Contributing Instructions:

1. Go to your favorite directory and create a new directory called 'lenses'
	`cd <path to the new lenses dir>`

2. In that directory run the following:
  `git clone git@github.com:lenses/lenses-freeform`
  `cd lenses-freeform`
  `bower install` (if there is a lodash version conflict use item with lodash version 3.0.0)
3. start the server in the workspace directory (e.g. lenses) by running `python -m SimpleHTTPServer`. (You would  have to do `cd ..` to get back to the lenses directory.)
4. check if page is running at: http://localhost:8000/lenses-freeform/

5. if you want to contribute to any already existing lenses components:
	  
	  5.1. Select a component you want to work on from https://github.com/lenses
    
    5.2. fork the component into your own github account using github.com (Use the fork button on the top right corner in the repository’s page)
	  
	  5.3. remove the existing component directory (the one you want to work on) from your workspace directory, because it is not a git directory you can commit to (e.g. `rm -rf lens-data-filter`. Replace `lens-data-filter` with the name of the component.) 
	  
	  5.4. clone your component fork into your workspace directory (e.g. `git clone git@github.com:[you-github-username]/lens-data-filter`)
	  
         5.4.1. (optional) create a new branch (e.g. `git checkout -b [branch-name]`)
  	
  	5.5. make modifications and test
    
         5.5.1. hint: each component has a `demo.html` file (or `demo/index.html`). You can use the component's `demo.html` while developing instead of `lenses-freeform/demo.html`
	  
	  5.6. commit your changes (`git commit . -m ‘my changes’`), push to your fork (or branch on your fork) (e.g. git `push origin master` or git `push origin [branch-name]`)
	  
	  5.7. submit a pull request on github.com

#### Some data sources from [Vegalite](http://uwdata.github.io/vegalite/)

[Barley](http://uwdata.github.io/vegalite/data/barley.json)

[Cars](http://uwdata.github.io/vegalite/data/cars.json)

[Crimea](http://uwdata.github.io/vegalite/data/crimea.json)

[Driving](http://uwdata.github.io/vegalite/data/driving.json)

[Iris](http://uwdata.github.io/vegalite/data/iris.json)

[Jobs](http://uwdata.github.io/vegalite/data/jobs.json)

[Population](http://uwdata.github.io/vegalite/data/population.json)

[Movies](http://uwdata.github.io/vegalite/data/movies.json)

[Birdstrikes](http://uwdata.github.io/vegalite/data/birdstrikes.json)

[Burtin](http://uwdata.github.io/vegalite/data/burtin.json)

[Budget 2016](http://uwdata.github.io/vegalite/data/budget.json)

[Climate Normals](http://uwdata.github.io/vegalite/data/climate.json)

[Campaigns](http://uwdata.github.io/vegalite/data/weball26.json)
