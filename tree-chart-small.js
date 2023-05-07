// Code goes here

// context menu

var menu = [
    {
          title: 'Summarize Data Region',
          action: function(elm, d, i) {
              console.log("Hello world!");
          }
      },
    {
          title: 'Understand Choice',
          action: function(elm, d, i) {
              console.log("Hello world!");
          }
      },
    {
          title: 'Change Request',
          action: function(elm, d, i) {
              console.log("Hello world!");
          }
      },
    {
          title: 'Remove Branch',
          action: function(elm, d, i) {
              
              if (d.parent) {
                
                // find child and remove it
                for (var ii = 0; ii < d.parent.children.length; ii++) {
                  if (d.parent.children[ii].name === d.name) {
                    d.parent.children.splice(ii, 1);
                    break;
                  }
                }
              }
              
              update(d);
          }
      },
  ];
  
  // tree
  
  var margin = {top: 70, right: 100, bottom: 50, left: 80},
      //width = 1.5*960 - margin.right - margin.left,
      width = window.innerWidth - margin.right - margin.left,
      height = window.innerHeight * 0.45 - margin.top - margin.bottom;
      
  var i = 0,
      duration = 750,
      root;
  
  var tree = d3.layout.tree()
      .size([height, width]);
  
  var diagonal = d3.svg.diagonal()
      .projection(function(d) { return [d.y, d.x]; });
  
  var svg = d3.select("#tree").append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  d3.json("small.json", function(error, flare) {
    root = flare;
    root.x0 = height / 2;
    root.y0 = 0;
  
    function collapse(d) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    }
  
    //root.children.forEach(collapse);
    theData = root;
    
    console.dir(theData);
    
    update(theData);
  });
  
  d3.select(self.frameElement).style("height", "800px");
  
  function update(source) {
  
    // var newHeight = Math.max(tree.nodes(root).reverse().length * 20, height);
    //var newHeight = Math.max(tree.nodes(root).reverse().length * 8.5, height);
    var newHeight = 0.8 * window.innerHeight;
    console.log(tree.size[0]);
  
    d3.select("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", newHeight + margin.top + margin.bottom);
  
    tree = d3.layout.tree().size([newHeight, width]);
  
    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
        links = tree.links(nodes);
  
    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * 210; });
  
    // Update the nodes…
    var node = svg.selectAll("g.node")
        .data(nodes, function(d) { return d.id || (d.id = ++i); });
    
    var tooltip2 = d3.select("#div_customContent")
    .append("div")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .html("<p>I'm a tooltip written in HTML</p><img src='https://github.com/holtzy/D3-graph-gallery/blob/master/img/section/ArcSmal.png?raw=true'></img><br>Fancy<br><span style='font-size: 40px;'>Isn't it?</span>");
  
    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
        .on("click", click)
        .on('contextmenu', d3.contextMenu(menu));
    
    // Define the div for the tooltip
    var tip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
      // Add events to circles
    nodeEnter.on("mouseover", function(d) {
      if (d.hypothesis != null) {
        tip.style("opacity", 1)
        .html(d.hypothesis + "<br/>" + d.count + "<br/>" + d.stats)
        .style("left", (d3.event.pageX-25) + "px")
        .style("top", (d3.event.pageY-75) + "px")
      }
      
      })
      .on("mouseout", function(d) {
        tip.style("opacity", 0)
      });
  
    nodeEnter.append("circle")
        .attr("r", 1e-6)
        .style("stroke", function(d) { return d.selected ? "steelblue" : "#999"; })
        //.style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });
        .style("fill", function(d) { return d.selected ? "steelblue" : "#fff"; });
  
    nodeEnter.append("text")
        .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
        .style("fill", function(d) { return d.selected ? "steelblue" : "#999"; })
        .text(function(d) { return d.name; })
        .style("fill-opacity", 1e-6);
  
    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
  
    nodeUpdate.select("circle")
        .attr("r", 5)
        .style("stroke", function(d) { return d.selected ? "steelblue" : "#999"; })
        //.style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });
        .style("fill", function(d) { return d.selected ? "steelblue" : "#fff"; });
  
    nodeUpdate.select("text")
        .style("fill-opacity", 1);
  
    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
        .remove();
  
    nodeExit.select("circle")
        .attr("r", 1e-6);
  
    nodeExit.select("text")
        .style("fill-opacity", 1e-6);
  
    // Update the links…
    var link = svg.selectAll("path.link")
        .data(links, function(d) { return d.target.id; });
  
    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
        //.attr("class", "linkSelected")
        .attr("class", function(d) { return d.target.selected ? "linkSelected" : "link"; })
        .attr("d", function(d) {
          var o = {x: source.x0, y: source.y0};
          return diagonal({source: o, target: o});
        });
  
    // Transition links to their new position.
    link.transition()
        .duration(duration)
        .attr("d", diagonal);
  
    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
        .duration(duration)
        .attr("d", function(d) {
          var o = {x: source.x, y: source.y};
          return diagonal({source: o, target: o});
        })
        .remove();
    
    // Update the link text
    var linktext = svg.selectAll("g.link")
      .data(links, function(d) {
        return d.target.id;
      });
  
    linktext.enter()
      .insert("g")
      //.attr("class", "link")
      .attr("class", function(d) { return d.target.selected ? "linkSelected" : "link"; })
      .append("text")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .style("fill", "steelblue")
      .text(function(d) {
        //console.log(d.target.name);
        return d.target.rule;
      });
  
    // Transition link text to their new positions
  
    linktext.transition()
      .duration(duration)
      .attr("transform", function(d) {
        return "translate(" + ((d.source.y + d.target.y) / 2) + "," + ((d.source.x + d.target.x) / 2) + ")";
      })
  
    //Transition exiting link text to the parent's new position.
    linktext.exit().transition()
      .remove();
  
    // Stash the old positions for transition.
    nodes.forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }
  
  // Toggle children on click.
  function click(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    update(d);
  }