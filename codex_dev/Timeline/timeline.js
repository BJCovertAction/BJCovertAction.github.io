var labelType, useGradients, nativeTextSupport, animate;

(function() {
  var ua = navigator.userAgent,
      iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
      typeOfCanvas = typeof HTMLCanvasElement,
      nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
      textSupport = nativeCanvasSupport 
        && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
  //I'm setting this based on the fact that ExCanvas provides text support for IE
  //and that as of today iPhone/iPad current text support is lame
  labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
  nativeTextSupport = labelType == 'Native';
  useGradients = nativeCanvasSupport;
  animate = !(iStuff || !nativeCanvasSupport);
})();

var Log = {
  elem: false,
  write: function(text){
    if (!this.elem) 
      this.elem = document.getElementById('log');
    this.elem.innerHTML = text;
    this.elem.style.left = (500 - this.elem.offsetWidth / 2) + 'px';
  }
};


var icicle;

function init(){
  // left panel controls
  controls();
  $jit.id('max-levels').style.display = 'none';
  // init data
  var json = {
    "name": "Episode 2",
    "id": "root",
    "data": {
      "$color": "#0000FF"
    },
    "children": [
      {
        "name": "Intro",
        "id": "intro",
        "data": {
            "$color": "#FF8800"
        },
        "children": []
      },
      {
        "name": "Shamanism",
        "id": "shamanism",
        "data": {
          "$color": "#008800"
        },
        "children": [
            {
              "name": "Shamanism Definition",
              "id": "shamanism_intro",
              "data": {
                  "$color": "#00FFFF"
              },
              "children": []          
            },
            {
              "name": "Flow",
              "id": "flow",
              "data": {
                  "$color": "#00FFFF"
              },
              "children": []     
            },
            {
              "name": "Metaphor",
              "id": "metaphor",
              "data": {
                  "$color": "#00FFFF"
              },
              "children": []     
            }
        ]
      },
      {
        "name": "The Axial Age",
        "id": "axial_age",
        "data": {
          "$color": "#880000"
        },
        "children": [
            {
              "name": "Axial Age Definition",
              "id": "axial_intro",
              "data": {
                  "$color": "#FF00FF"
              },
              "children": []          
            },
            {
              "name": "Psychotechnologies",
              "id": "psychotech",
              "data": {
                  "$color": "#FF00FF"
              },
              "children": [
                {
                  "name": "Literacy",
                  "id": "literacy",
                  "data": {
                      "$color": "#8800FF"
                  }
                },
                {
                  "name": "Numeracy",
                  "id": "numeracy",
                  "data": {
                      "$color": "#8800FF"
                  }
                }
              ]     
            }
        ]         
      }
    ]
  };
  // end
  // init Icicle
  icicle = new $jit.Icicle({
    // id of the visualization container
    injectInto: 'infovis',
    // whether to add transition animations
    animate: animate,
    // nodes offset
    offset: 1,
    // whether to add cushion type nodes
    cushion: false,
    // do not show all levels at once
    constrained: true,
    levelsToShow: 4,
    // enable tips
    Tips: {
      enable: true,
      type: 'Native',
      // add positioning offsets
      offsetX: 20,
      offsetY: 20,
      // implement the onShow method to
      // add content to the tooltip when a node
      // is hovered
      onShow: function(tip, node){
        // count children
        var count = 0;
        node.eachSubnode(function(){
          count++;
        });
        // add tooltip info
        tip.innerHTML = "<div class=\"tip-title\"><b>Name:</b> "
            + node.name + "</div><div class=\"tip-text\">" + count
            + " children</div>";
      }
    },
    // Add events to nodes
    Events: {
      enable: true,
      onClick: function(node){
        if (node) {
          //hide tips
          icicle.tips.hide();
          // perform the enter animation
          icicle.enter(node);
        }
      },
      onRightClick: function(){
        //hide tips
        icicle.tips.hide();
        // perform the out animation
        icicle.out();
      }
    },
    // Add canvas label styling
    Label: {
      type: labelType, // "Native" or "HTML"
      color: '#333',
      style: 'bold',
      size: 12
    },
    // Add the name of the node in the corresponding label
    // This method is called once, on label creation and only for DOM and
    // not
    // Native labels.
    onCreateLabel: function(domElement, node){
      domElement.innerHTML = node.name;
      var style = domElement.style;
      style.fontSize = '0.9em';
      style.display = '';
      style.cursor = 'pointer';
      style.color = '#333';
      style.overflow = 'hidden';
    },
    // Change some label dom properties.
    // This method is called each time a label is plotted.
    onPlaceLabel: function(domElement, node){
      var style = domElement.style, width = node.getData('width'), height = node
          .getData('height');
      if (width < 7 || height < 7) {
        style.display = 'none';
      } else {
        style.display = '';
        style.width = width + 'px';
        style.height = height + 'px';
      }
    }
  });
  // load data
  icicle.loadJSON(json);
  // compute positions and plot
  icicle.refresh();
  //end
}

//init controls
function controls() {
  var jit = $jit;
  var gotoparent = jit.id('update');
  jit.util.addEvent(gotoparent, 'click', function() {
    icicle.out();
  });
  var select = jit.id('s-orientation');
  jit.util.addEvent(select, 'change', function () {
    icicle.layout.orientation = select[select.selectedIndex].value;
    icicle.refresh();
  });
  var levelsToShowSelect = jit.id('i-levels-to-show');
  jit.util.addEvent(levelsToShowSelect, 'change', function () {
    var index = levelsToShowSelect.selectedIndex;
    if(index == 0) {
      icicle.config.constrained = false;
    } else {
      icicle.config.constrained = true;
      icicle.config.levelsToShow = index;
    }
    icicle.refresh();
  });
}
//end
