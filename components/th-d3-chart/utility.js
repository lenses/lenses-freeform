var Thelma = window.Thelma || {};

Thelma.util = {

}


Thelma.chartValidation = {

  errors : [],   //TODO what is this?
  validateChartData: function(polymerObj) {
    // polymerObj is passed to the function to make chartValidation not dependant on polymer
    
    // empty error messages
    var errors = []; //polymerObj.errors;
    var i = 0;
    if(polymerObj.chartData===undefined || polymerObj.chartData.length==0) {
      errors.push('no chart data');
    }
    errors = errors.concat(polymerObj.chartSpecificDataValidate());

    if(errors.length>0) {
      // polymerObj.$.chart.style.opacity = 0.5; // this is for testing
      // polymerObj.$.data_errors.style.display = 'block'; // this is for testing
      
      for (i; i < errors.length; i++){  
        // polymerObj.$.data_errors.appendChild(document.createElement('li')).innerHTML = errors[i].msg; // this is for testing
        polymerObj.asyncFire('th-error', errors[i]); // where th-error is an object containing details
      }
    }
    

  },
  chartSpecificDataValidate: function() {
    /* each chart needs to implement this method */
    return [];
  }



}

Thelma.BarFamilyPrivateStaticMethods = function() {

    this.setupBarLabelDims = function(dims, chartData, overlap, gap, wrap) {
        
        // bars margin and dims
        dims.bars = {};
        dims.bars.count = chartData.length;
        dims.bars.gap = gap || 1;

        if (dims.bars.count == 1 || !overlap){
          dims.bars.overlap = 1;
        } else { 
          dims.bars.overlap = overlap;
        }

        dims.bars.width = (dims.width / dims.bars.count)* dims.bars.overlap / dims.bars.gap;
        dims.bars.widthOverlap = dims.bars.count > 1 ? (((dims.bars.width * dims.bars.count) - dims.width)/ (dims.bars.count - 1)) : 0; // used in calculated position of paths for peak chart
        
        // value margin and dims (depending on bars.width)
        dims.values = {};
        dims.values.maxLength = d3.max(chartData, function(d){  
          return  d.display_value ? d.display_value.length : d.value.toString().length;
         });
        dims.values.size = Math.min(30, Math.max(12, ((dims.bars.width/dims.bars.overlap) / dims.values.maxLength / 0.6) ));
        dims.values.margin = dims.values.size * 0.25;

        // Adjust top margin as necessary
        if ((dims.values.size+dims.values.margin) > dims.margin.top) { 
          dims.margin.top = dims.values.size+dims.values.margin;
        }

        // label margins and dims
        dims.labels = {};
        dims.labels.maxLength = d3.max(chartData, function(d){ return  d.label ? d.label.length : 0;}); 
        dims.labels.width = dims.labels.maxLength * 5.25; // This calc works with the font-size 13px
        dims.labels.lines = Math.ceil(dims.labels.maxLength * 8 / dims.bars.width); // Estimates the number of lines for wrapped labels
        dims.labels.height = dims.labels.lines * 16; // Estimates the size of the div to hold labels

        // If labels are long, angle them and adjust margins 
        // 1.1 worked with well with different labels but it might be a little bit too aggressive. (larger->more conservative)
       if (wrap){
          dims.margin.bottom = dims.labels.height + dims.margin.label;
       } else if (dims.labels.width > dims.bars.width/dims.bars.overlap/1.3) { 
          dims.labels.angle = 25;
          
          // increase bottom margin for angled labels
          dims.margin.bottom = dims.labels.width/1.7 + dims.margin.label;  
          
          // increase right margin by width of last label
          var lastLabel = chartData[chartData.length - 1].label,
              lastLabelLength = lastLabel ? lastLabel.length : 0;
          dims.margin.right = dims.margin.right + lastLabelLength*5; 
          
      } else {
          dims.labels.angle = 0;
      }

        return dims;        

  }
  

  
}

Thelma.chartUtils = {

  setupDimensions: function(polymerObj) {
    var dims = {};

    //TODO there needs to be height and visHeight?! later for drawing area (excluding labels and axis)?!
    dims.margin = {
              top : 16,
              right : 0,
              bottom : 28,
              left : 0,
              label: 16
          };

      polymerObj.computedWidth = polymerObj.computeWidth();
      polymerObj.computedHeight = polymerObj.computeHeight();


    var MIN_WIDTH = 50,
        MIN_HEIGHT = 50;
    dims.width = Math.max(MIN_WIDTH,(polymerObj.computedWidth - dims.margin.left - dims.margin.right));
    dims.height = Math.max(MIN_HEIGHT,(polymerObj.computedHeight*0.95 - dims.margin.top - dims.margin.bottom));        
    

    dims.textLabelMargin = dims.height*0.05;
    dims.margin.label = polymerObj.wrapLabels ? 3 : 16; // If wrapLabels, margin is less for HTML text

    // Bar dimensions 
    // dims.barGap = 0.3;
    // dims.numBars = polymerObj.chartData.length;  // DEPENDANT ON CHARTDATA
    // dims.barWidth = Math.min(70,((dims.width / dims.numBars)/(1+dims.barGap)));
    return dims;


  },

  /*
   *  builds simple x,y scales for charts. labelAccessFun and valueAccessFun are optional accessor functions.
  */ 
  simpleScaleBuilder: function(width, height, chartData, orientation, labelAccessFun, valueAccessFun) {

      var VERTICAL = 'vertical',
          HORIZONTAL = 'horizontal';
      var scales = {};
      labelAccessFun = labelAccessFun || function(d) {return d.label}; 
      valueAccessFun = valueAccessFun || function(d) {return d.value}; 
      orientation = orientation || VERTICAL;
      
      scales.x = orientation===VERTICAL ? d3.scale.ordinal().rangeRoundBands([0, width], .1) 
                        : d3.scale.linear().range([0, width], .1);
        scales.y = orientation===VERTICAL ? d3.scale.linear().range([0, height])
                          : d3.scale.ordinal().rangeRoundBands([0, height]);
      
        var max = Math.max(0,d3.max(chartData, valueAccessFun));
        
        var min = Math.min(0, d3.min(chartData, valueAccessFun));
     
        scales.y.domain(orientation===VERTICAL ? [min, max] : d3.range(chartData.length)); 
        scales.x.domain(orientation===VERTICAL ? d3.range(chartData.length) : [min, max]);

      return scales;

  },
  setupValueDims: function(polymerObj){ 
        var dims = polymerObj.dims,
            chartData = polymerObj.chartData;
        
        dims.values = {};
        dims.values.maxLength = d3.max(chartData, function(d){  
          return  d.display_value ? d.display_value.length : d.value.toString().length;
         });
        dims.values.size = Math.min(30,((dims.bars.width/dims.bars.overlap) / dims.values.maxLength / 0.6) );
        dims.values.margin = dims.values.size * 0.25;

        // Adjust top margin as necessary
        if ((dims.values.size+dims.values.margin) > dims.margin.top) { 
          dims.margin.top = dims.values.size+dims.values.margin;
        }

        
        return dims.values;

      },

   setupBarDims: function(polymerObj, overlap, gap, orientation){ 

          orientation = orientation || 'vertical';

          var dims = polymerObj.dims,
              chartData = polymerObj.chartData;

          dims.bars = {};
          dims.bars.count = chartData.length;
          dims.bars.overlap = overlap || 1; // the higher the number, the more overlap
          dims.bars.gap = gap || 1;
          dims.bars.width = (orientation== 'horizontal') ?  ((dims.height / dims.bars.count)* dims.bars.overlap / dims.bars.gap) - 8 
                                                        : (dims.width / dims.bars.count)* dims.bars.overlap / dims.bars.gap;
          dims.bars.widthOverlap = dims.bars.width*dims.bars.overlap;
       
          return dims.bars
      },
    setupLabelDims: function(polymerObj){ // MOVE TO UTILS?
          // Check if labels overlap and angle them if they do
          var chartData = polymerObj.chartData,
              dims = polymerObj.dims;
          
          dims.labels = {};
          dims.labels.maxLength = d3.max(chartData, function(d){ return  d.label ? d.label.length : 0;}); 
          dims.labels.width = dims.labels.maxLength * 5.25; // This calc works with the font-size 13px

          // If labels are long, angle them and adjust margin 
          // 1.1 worked with well with different labels but it might be a little bit too aggressive. (larger->more conservative)
          if (dims.labels.width > dims.bars.width/dims.bars.overlap/1.3) { 
            dims.labels.angle = 25;
            dims.margin.bottom = dims.labels.width + dims.margin.label;
            dims.margin.right = dims.labels.width;
            
            // need to adjust margin right when last label is long, so it does not cut off
          } else {
            dims.labels.angle = 0;
          }
          return dims.labels;
      },
    getBoundaryValue: function(polymerObj, property, d3boundary){
        return d3boundary(polymerObj.chartData, function(d){
          return d[property];
        });
    },
    /**
     * Setting up dimension for stacked bar chart and spectrum chart
     * @param  {[type]} polymerObj
     * @return {[type]}
     */
    setupStackedDims: function(polymerObj){

      var dims = {},
          chartData = polymerObj.chartData,
          MIN_WIDTH = 100,
          MIN_HEIGHT = 150,
          BAR_MIN_WIDTH = 20,
          remainingWidth;
      
      dims.margin = { top : 0, right : 0, bottom : 8, left : 0, label: 10, };
      
      polymerObj.computedWidth = polymerObj.computeWidth();
      polymerObj.computedHeight = polymerObj.computeHeight();

      dims.width = Math.max(MIN_WIDTH,(polymerObj.computedWidth - dims.margin.left - dims.margin.right));
      dims.height = Math.max(MIN_HEIGHT,(polymerObj.computedHeight - dims.margin.top - dims.margin.bottom));        
    
      dims.bar = {};
      dims.labels = {};
      dims.values = {};

      do  {
        //for the first time dims.bar.width is undefined but optimizeSizes takes care of that.
        var newBarWidth = dims.bar.width * 0.8;
        optimizeSizes(newBarWidth);
      } while (((dims.values.lines > 1 && dims.labels.lines > 1) || dims.labels.lines > 3) && dims.bar.width > BAR_MIN_WIDTH)
      // If both values and labels are wrapping to more than 1 line, attempt to shrink the bar until one side does not have to wrap

      // This function attempts to maximize the width of the bar,
      // while reducing the number of lines labels and values wrap
      function optimizeSizes(barWidth){

        // Set bar width in proportion to total width
        remainingWidth = dims.width;
        dims.bar.width = barWidth || dims.width / 3.25;
        remainingWidth -= dims.margin.label*2 + dims.bar.width + 2; // Additional 2px of extra margin to account for font variation

        // Estimate length of labels and calculate width/height of container given word wrap
        dims.labels.maxLength = d3.max(chartData, function(d){ return d.label ? d.label.length : 0;}); // in number of characters
        dims.labels.width = dims.labels.maxLength * 8.25; // in estimated pixels 
        dims.labels.containerWidth = remainingWidth/2;
        dims.labels.lines = Math.ceil(dims.labels.width / dims.labels.containerWidth); // estimate # of lines given container width
        dims.labels.containerHeight = dims.labels.lines * 16; // estimate height given number of lines
        remainingWidth -= dims.labels.containerWidth;


        // Estimate length of values and calculate width/height of container given word wrap
        dims.values.maxLength = d3.max(chartData, function(d){ 
          if (d.range_min_display_value && d.range_max_display_value){ // for spectrum
            return  d.range_min_display_value.length + d.range_max_display_value.length + 3;
          } else if (d.range_min_value && d.range_max_value){ // for spectrum
            return  d.range_min_value.toString().length + d.range_max_value.toString().length + 3; // 3 is for the characters separating min and max " - "
          } else { // for stacked
            return d.display_value ? d.display_value.length : d.value.toString().length;
          }
        });
        dims.values.width = dims.values.maxLength * 8.25; // in estimated pixels 
        dims.values.containerWidth = Math.min(dims.values.width, remainingWidth) + 2; // Additional 2px of extra margin to account for font variation  
        dims.values.lines = Math.ceil(dims.values.width / dims.values.containerWidth);  // estimate # of lines given container width
        dims.values.containerHeight = dims.values.lines * 16; // estimate height given number of lines
        
      }

      // TODO: add logic to allocation remainingWidth to labels if they are wrapping or to bar

      return dims;

    },
    getColors: function(){
      colors = {};
      colors.theme = window.CoreStyle.g.theme;
      colors.accents = [];

      for (var color in colors.theme){
        if(/^accent/.test(color)){
          colors.accents.push(colors.theme[color]);
        }
      }

      colors.count = colors.accents.length;

      return colors;
    },
 
     addMoreColors: function(polymerObj){
      var newAccents = polymerObj.colors.accents.map(function(color){
        return this.changeBrightness(color, 0.3);
      }.bind(this));

      // add new colors to accents array
      polymerObj.colors.accents = polymerObj.colors.accents.concat(newAccents);

      // update total count of colors
      polymerObj.colors.count = polymerObj.colors.accents.length; 
      
      return polymerObj.colors.accents;
    },
    /**
     * changes the brigthness of color
     * @param  {string} color hex color to change the brightness
     * @param  {[type]} lum   number between -1 and 1. the percentage of brightness change
     * @return {[type]}       new color
     */
    changeBrightness: function(color, lum) {

        var hex = "#", c, i;
        
        // validate color and make it always 6 chars 
        color = String(color).replace(/[^0-9a-f]/gi, '');
        if (color.length < 6) {
          color = color[0]+color[0]+color[1]+color[1]+color[2]+color[2];
        }

        // convert color to decimal, adjust lumosity, and convert back to hex;
        for (i = 0; i < 3; i++) {
          c = parseInt(color.substr(i*2,2), 16);
          c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
          hex += ("00"+c).substr(c.length);
        }

        return hex;

    },
    setDisplayVals: function(polymerObj){
      var data = polymerObj.chartData;

      if (data){
        for (var i=0; i<data.length; i++){
          data[i]["display_value"] = data[i]["value"];
        } 
      }

      return data;
    },
    /**
    * '_decimalPlaces' takes a number and determines how many digits come after the decimal point
    * @param  {[Number]} num is the number to test
    * @return {[Number]} number of digits
    */
    getDecimalPlaces: function(num){
      var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
        
        if (!match) { return 0; }
        return Math.max(
             0,
             // Number of digits right of decimal point.
             (match[1] ? match[1].length : 0)
             // Adjust for scientific notation.
             - (match[2] ? +match[2] : 0));
    },
    addCommasToNum: function(num){
      
      var parts = num.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    },
    hexToRgb: function(hex){
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;  

    },
    cleanChartData: function(chartData){
      for(var i=0;i<chartData.length; i++){
        var str = chartData[i].display_value;
        if (str){
          chartData[i].display_value = this.escapeChars(str);
        }
      }
      return chartData;
    },
    escapeChars: function(str){
      str = str.replace(/&quot;/g, "\"");
      str = str.replace(/&#x27;/g, "'");
      return str;
    }

}