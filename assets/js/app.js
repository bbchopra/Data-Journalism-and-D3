// @TODO: YOUR CODE HERE!

// Setting the graph area
// width of the containing box
var width = parseInt(d3.select("#scatter").style("width"));

// Designate the height of the graph
var height = width - width / 3.9;

// Margin spacing for graph
var margin = 20;

// space for setting the label area
var labelArea = 110;

// padding for the text at the bottom and left axes
var tPadBot = 40;
var tPadLeft = 40;

// setting the coordiates to display based on padding
var leftTextX = margin + tPadLeft;
var leftTextY = (height + labelArea) / 2 - labelArea;

// Creating canvas for the graph
var svg = d3.select("#scatter")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("class", "chart");

// Set the radius for each scatter mark depending on the size of the window
var circleRadius;
//function to return the scatter mark radius
function circleGet() {
  if (width <= 500) {
    circleRadius = 5;
  }
  else {
    circleRadius = 10;
  }
}
//calling the function
circleGet();

// setting group of elements for bottom axes labels.
svg.append("g").attr("class", "xText");
var xText = d3.select(".xText");

//setting the transform property for window size changes
function xTextRefresh() {
    xText.attr(
        "transform",
        "translate(" +
        ((width - labelArea) / 2 + labelArea) +
        ", " +
        (height - margin - tPadBot) +
        ")"
    );
}
xTextRefresh();

// setting the x axis 
// setting the Poverty label to y coordinate
xText.append("text")
  .attr("y", -26)
  .attr("data-name", "poverty")
  .attr("data-axis", "x")
  .attr("class", "aText active x")
  .text("In Poverty (%)");
// setting the Age label to y coordinate
xText.append("text")
  .attr("y", 0)
  .attr("data-name", "age")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Age (Median)");
// setting the Income label to y coordinate
xText.append("text")
  .attr("y", 26)
  .attr("data-name", "income")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Household Income (Median)");

// y axis group creation
svg.append("g").attr("class", "yText");
var yText = d3.select(".yText");

// setting the values to support window change
function yTextRefresh() {
    yText.attr(
        "transform",
        "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
    );
}
yTextRefresh();

// Create the data set for the y axis
// setting Obesity to y axis
yText.append("text")
    .attr("y", -26)
    .attr("data-name", "obesity")
    .attr("data-axis", "y")
    .attr("class", "aText active y")
    .text("Obese (%)");
// setting Smokes to y axis
yText.append("text")
    .attr("x", 0)
    .attr("data-name", "smokes")
    .attr("data-axis", "y")
    .attr("class", "aText inactive y")
    .text("Smokes (%)");

// Setting Lacks Healthcare to y axis
yText.append("text")
    .attr("y", 26)
    .attr("data-name", "healthcare")
    .attr("data-axis", "y")
    .attr("class", "aText inactive y")
    .text("Lacks Healthcare (%)");

// Read CSV data with d3's .csv import method.
d3.csv("assets/data/data.csv").then(function(data) {
    // Visualize the data
    visualize(data);
});

// Create the visualization function
function visualize(theData) {
    // setting default x and y axis to visible and showing the scatter graphs for them
    var curX = "poverty";
    var curY = "obesity";

    // creating variables 
    var xMin;
    var xMax;
    var yMin;
    var yMax;

    // setting tool tip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([40, -60])
        .html(function(d) {
            console.log(d)
            // x key variable
            var theX;
            // Get the state name.
            var theState = "<div>" + d.state + "</div>";
            // get the y value's key and value.
            var theY = "<div>" + curY + ": " + d[curY] + "%</div>";
            // If the x key is poverty
            if (curX === "poverty") {
                // get the x key with formatted value in percentage
                theX = "<div>" + curX + ": " + d[curX] + "%</div>";
            }
            // else x is age or husehold income
            else {
                // Get the x key and value formatted to include commas after every third digit.
                theX = "<div>" + curX + ": " + parseFloat(d[curX]).toLocaleString("en") + "</div>";
            }
            // Display the values from above
            return theState + theX + theY;
        });
    // Call the toolTip function.
    svg.call(toolTip);

    // These functions remove some repitition from later code.
    // setting min and max for X
    function xMinMax() {
        // min will grab the smallest datum from the selected column.
        xMin = d3.min(theData, function(d) {
            return parseFloat(d[curX]) * 0.90;
        });
        // .max will grab the largest datum from the selected column.
        xMax = d3.max(theData, function(d) {
            return parseFloat(d[curX]) * 1.10;
        });
    }

    // setting the min and max for y
    function yMinMax() {
        // min will grab the smallest datum from the selected column.
        yMin = d3.min(theData, function(d) {
            return parseFloat(d[curY]) * 0.90;
        });

        // .max will grab the largest datum from the selected column.
        yMax = d3.max(theData, function(d) {
            return parseFloat(d[curY]) * 1.10;
        });
    }

    // change the appearance of label text when clicked.
    function labelChange(axis, clickedText) {
        // Switch the currently active to inactive.
        d3.selectAll(".aText")
            .filter("." + axis)
            .filter(".active")
            .classed("active", false)
            .classed("inactive", true);
        // Switch the text just clicked to active.
        clickedText.classed("inactive", false).classed("active", true);
    }

    // Creating the Scatter Plot
    // Grab the min and max values of x and y.
    xMinMax();
    yMinMax();

    // creating scales based in min and max values
    var xScale = d3.scaleLinear()
        .domain([xMin, xMax])
        .range([margin + labelArea, width - margin]);
    var yScale = d3.scaleLinear()
        .domain([yMin, yMax])
        // inversing the height
        .range([height - margin - labelArea, margin]);

    // Creating the axes.
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    // Determine x and y tick counts.
    function tickCount() {
        if (width <= 500) {
            xAxis.ticks(5);
            yAxis.ticks(5);
        }
        else {
            xAxis.ticks(10);
            yAxis.ticks(10);
        }
    }
    tickCount();

    svg.append("g")
        .call(xAxis)
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + (height - margin - labelArea) + ")");
    svg.append("g")
        .call(yAxis)
        .attr("class", "yAxis")
        .attr("transform", "translate(" + (margin + labelArea) + ", 0)");

    // grouping the scatter graph dots
    var theCircles = svg.selectAll("g theCircles").data(theData).enter();

    // setting scatter graph dots
    theCircles.append("circle")
        // These attr's specify location, size and class.
        .attr("cx", function(d) {
            return xScale(d[curX]);
        })
        .attr("cy", function(d) {
            return yScale(d[curY]);
        })
        .attr("r", circleRadius)
        .attr("class", function(d) {
            return "stateCircle " + d.abbr;
        })
        // Mouse Hover rules
        .on("mouseover", function(d) {
            // Show the tooltip
            toolTip.show(d, this);
            // Highlight the state circle's border
            d3.select(this).style("stroke", "#323232");
        })
        //Mouse out event
        .on("mouseout", function(d) {
            // Remove the tooltip
            toolTip.hide(d);
            // Remove highlight
            d3.select(this).style("stroke", "#e3e3e3");
        });

    // settig the labels on the scatter dots
    theCircles.append("text")
        // return the text of the scatter dot 
        .text(function(d) {
            return d.abbr;
        })
        // Placing the text using the scale.
        .attr("dx", function(d) {
            return xScale(d[curX]);
        })
        .attr("dy", function(d) {
            return yScale(d[curY]) + circleRadius / 2.5;
        })
        .attr("font-size", circleRadius)
        .attr("class", "stateText")
        // Hover Rules
        .on("mouseover", function(d) {
            // Show the tooltip
            toolTip.show(d);
            d3.select("." + d.abbr).style("stroke", "#323232");
        })
        .on("mouseout", function(d) {
            // Remove tooltip
            toolTip.hide(d);
            d3.select("." + d.abbr).style("stroke", "#e3e3e3");
        });

    // Dynamic Graph depending on which label is selected
    
    // Select axis text and d3 click event.
    d3.selectAll(".aText").on("click", function() {
        // saving the selection
        var self = d3.select(this);
        // setting the data the graph depending on the selection
        if (self.classed("inactive")) {
            // save the the name and axis saved
            var axis = self.attr("data-axis");
            var name = self.attr("data-name");

            // When axis on the x-axis is selected
            if (axis === "x") {
                curX = name;
                // call function to change the min and max of the x-axis
                xMinMax();
                // Update the domain of x-axis.
                xScale.domain([xMin, xMax]);
                // changing the transition
                svg.select(".xAxis").transition().duration(300).call(xAxis);
                // changing the location of the circles.
                d3.selectAll("circle").each(function() {
                    // movement of scatter dots to new location
                    d3.select(this)
                        .transition()
                        .attr("cx", function(d) {
                            return xScale(d[curX]);
                        })
                        .duration(300);
                });

                // Change the location of the texts
                d3.selectAll(".stateText").each(function() {
                    // movement of text same as for the dots
                    d3.select(this)
                        .transition()
                        .attr("dx", function(d) {
                            return xScale(d[curX]);
                        })
                        .duration(300);
                });

                // changing the labels of the clicked label
                labelChange(axis, self);
            }
            else {
                // for y axis labels selected
                curY = name;
                // Change the min and max of the y-axis.
                yMinMax();
                // changing the y-axis scale
                yScale.domain([yMin, yMax]);
                // Update Y Axis
                svg.select(".yAxis").transition().duration(300).call(yAxis);
                // changing the y coordinates of the scatter dots
                d3.selectAll("circle").each(function() {
                    // transition of the dots for new y coordinates
                    d3.select(this)
                        .transition()
                        .attr("cy", function(d) {
                            return yScale(d[curY]);
                        })
                        .duration(300);
                });

                // changind the y-coordiates of the text.
                d3.selectAll(".stateText").each(function() {
                    // setting the motion depending on the y-coordidtes
                    d3.select(this)
                        .transition()
                        .attr("dy", function(d) {
                            return yScale(d[curY]) + circleRadius / 3;
                        })
                        .duration(300);
                });
                // changing the setting of the labels selected on y-axis
                labelChange(axis, self);
            }
        }   
    });

    // resize function whenever the window dimensions changes
    d3.select(window).on("resize", resize);
    function resize() {
        // Reset the width, height and leftTextY depending on the width of the window
        width = parseInt(d3.select("#scatter").style("width"));
        height = width - width / 3.9;
        leftTextY = (height + labelArea) / 2 - labelArea;
        // Apply the width and height to the svg canvas.
        svg.attr("width", width).attr("height", height);
        // Change the xScale and yScale ranges
        xScale.range([margin + labelArea, width - margin]);
        yScale.range([height - margin - labelArea, margin]);
        // With the scales changes updating the axes and the height of the x-axis
        svg.select(".xAxis")
            .call(xAxis)
            .attr("transform", "translate(0," + (height - margin - labelArea) + ")");

        svg.select(".yAxis").call(yAxis);

        // Update the ticks on each axis.
        tickCount();

        // Update the labels.
        xTextRefresh();
        yTextRefresh();

        // Update the radius of each dot.
        circleGet();

        // update the location and radius of the scatter dots
        d3.selectAll("circle")
            .attr("cy", function(d) {
                return yScale(d[curY]);
            })
            .attr("cx", function(d) {
                return xScale(d[curX]);
            })
            .attr("r", function() {
                return circleRadius;
            });

        // change the location and size of the scatter dot texts
        d3.selectAll(".stateText")
            .attr("dy", function(d) {
                return yScale(d[curY]) + circleRadius / 3;
            })
            .attr("dx", function(d) {
                return xScale(d[curX]);
            })
            .attr("r", circleRadius / 3);
    }
}