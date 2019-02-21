/**
 * Created by haesa on 2/12/2019.
 */

var svgList = {};
var nameArray = [];  //Contains names of states alphabetically
var gerryArray = []; //Contains names of states by most gerrymandered to least
var gerryList = []
var data = null;
var nameBit = 0;
var gerryBit = 1;
var partyBit = 1;
var xMargin = 0;
var yMargin = 30;
var yMarginSpacing = 100;
var hData = null;
var demDistrictCount = 0;
var repDistrictCount = 0;

var circleState = null;

// Define the div for the tooltip
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

function gerry_graphs() {
//var margin = {top: 100, right: 275, bottom: 40, left: 275};


    var width = 960,
        height = 760;

    var svg = d3v4.select(".house")
        .attr("width", width)
        .attr("height", height)
        .append("g");

    d3v4.queue()
        .defer(d3v4.csv, "./Data/house_gerry.csv")
        .defer(d3v4.csv, './Data/house_results.csv')
        .awaitAll(ready);

    function ready(error, results) {
        data = results[0];
        hData = results[1]
        var districts = createInitialDistrictHash(hData);
        createInitialGrid(data, districts);
        //I want to have them all stacked up on top of each other.
        //MEasure height of every single one of them with the Bbox.
        //Now look at what parameter we are sorting them by:
        // If sort by name descending, go through hashmap list of every group and translate them alphabetically descending.
        //If sort by name ascending, go through hashmap list of every group and trnaslate them alphabetically asceniding
        //If sort by most gerrymandered ''
        //If sort by least gerrymandered

        //With that order, translte them downwards according to bbox measurements
        //Add tooltips to every circle
    }
}

function createInitialDistrictHash(hData) {
    var districts = {};
    var state = '';
    var innerState = '';
    var innerCounter = 0;
    var currState = null;
    for (var a = 0; a < hData.length; a++) {
        if (hData[a]['State'] !== state) {
            innerCounter = a;
            innerState = hData[innerCounter]['State']
            currState = hData[a]['State'];
            districts[innerState] = {};
            districts[innerState]['Republicans'] = [];
            districts[innerState]['Democrats'] = [];

            while (innerCounter < 435 && innerState == hData[innerCounter]['State']) {
                if (hData[innerCounter]['Winner'] == 'Gop') {
                    districts[innerState]['Republicans'].push(hData[innerCounter]['District'])
                    //console.log(innerState)
                } else {
                    districts[innerState]['Democrats'].push(hData[innerCounter]['District'])
                    //console.log(innerState)
                }
                innerCounter = innerCounter + 1
            }
            state = hData[a]['State']
        }
    }
    return districts;

    /**
     * Return {'Florida': { [D1, D2, D3], [D4, D5, D6] }, 'Georgia': {[...],[...]}, ...}
     */
}



function createInitialGrid(data, districts) {

    //Set up circles and x and y values
    var cRadius = 5;

    var demCirclesX = 40;
    var gopCirclesX = 400;
    var demCirclesY = 50;
    var gopCirclesY = 50;
    for (var q = 0; q < data.length; q++) {
        data[q]['Districts'] = districts[data[q]['State']]
    }
    //X Scale
    var datas = [0,25, 50, 75, 100];
    var extent = d3v4.extent(datas);

    var linearScale = d3v4.scaleLinear()
        .domain(extent)
        .range([0, 200]);

    var axis = d3v4.axisBottom(linearScale);

    //Y Scale
    var xAxisY = 100;   //Controls text and x-axis y locations

    //Create state groups
    for (var x = 0; x < data.length; x++) {

        demDistrictCount = 0;
        repDistrictCount = 0;

        if (data[x]['State'].includes(' ')) {
            data[x]['State'] = data[x]['State'].split(' ')[0] + '_' + data[x]['State'].split(' ')[1]
        }

        var svgContainer = d3v4.select(".gerry").append('g').attr('class', data[x]['State']).attr("transform", "translate(" + (0) + ",0)");  //Transform xMargin pixels to the right, no y manipulation

        //Set up state text names
        svgContainer.append("text")
            .attr("x", 220)
            .attr("y", xAxisY - 100)
            .attr("dy", "1em")
            .attr('font-size', 20)
            .text(function() { return data[x]['State'].replace('_', ' ') });
        //Blue Dots
        var count = 0;

        for (var z = 0; z < data[x]['Dem Wins']; z++) {
            svgContainer.data(data[x]['Districts']['Democrats']).append('circle')
                .style('fill', '#4575b4')
                .attr('r', cRadius)
                .attr('cx', function (d, i) {
                    if (count == 5) {
                        demCirclesX = 40;
                    }
                    return demCirclesX + (i * 80)
                })
                .attr('cy', function (d, i) {
                    if (count == 5) {
                        demCirclesY = demCirclesY + 14;
                        count = 0;
                    }
                    count++;
                    return demCirclesY + (i * 80)
                })
                .on("mouseover", function(d) {
                    div.transition()
                        .duration(200)
                        .style("opacity", .9)
                    console.log(d)
                    div.html(d)
                        .style("left", (d3v4.event.pageX + 5) + "px")
                        .style("top", (d3v4.event.pageY - 28) + "px")
                })
                .on("mouseout", function(d) {
                    div.transition()
                        .duration(100)
                        .style("opacity", 0);
                });

            demCirclesX = demCirclesX + 14;
        }

        //d3v4.event.pageX + 5   d3v4.event.pageY - 28
        //x_axis
        svgContainer.append("g").attr('class', data[x]['State']).attr("transform", "translate(" + (150) + "," + 50+ ")").call(axis)

        //vertical line over x_axis
        var calculatedPercentage = data[x]['Gop % of Votes'] * 200;
        svgContainer.append('g').append('line')
            .attr('class', 'xAxis')
            .attr("x1", 150)
            .attr("y1", 155)
            .attr("x2", 150)
            .attr("y2", 185)
            .attr('stroke', 'purple')
            .attr('stroke-width', 2)
            .attr("transform", "translate(" + (calculatedPercentage) + "," + -120 + ")").call(axis);

        //Red Dots
        count = 0;

        for (z = 0; z < data[x]['Gop Wins']; z++) {
            svgContainer.append('circle')
                .style('fill', 'red')
                .attr('r', cRadius)
                .attr('cx', function (d, i) {
                    if (count == 5) {
                        gopCirclesX = 400;
                        gopCirclesY = gopCirclesY + 14;
                        count = 0;
                    }
                    return gopCirclesX + (i * 80)
                })
                .attr('cy', function (d, i) {
                    count++;
                    return gopCirclesY + (i * 80)
                })
                .on("mouseover", function(d) {
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    div.html(data[x]['Districts']['Republicans'][z])
                        .style("left", (d3v4.event.pageX + 5) + "px")
                        .style("top", (d3v4.event.pageY - 28) + "px");
                })
                .on("mouseout", function(d) {
                    div.transition()
                        .duration(100)
                        .style("opacity", 0);
                });

            gopCirclesX = gopCirclesX + 14;

        }
        nameArray.push(data[x]['State'])
        gerryArray.push(Math.abs(parseFloat(data[x]['Gop % of Votes']) - parseFloat(data[x]['Gop % of Seats'])))
        //demCirclesY = demCirclesY + xMargin;
        //gopCirclesY = gopCirclesY + yMarginSpacing;
        demCirclesX = 40;
        gopCirclesX = 400;
        demCirclesY = 50;
        gopCirclesY = 50;
        repDistrictCount = 0;
        demDistrictCount = 0;
    }
    var gerryArraySort = gerryArray;
    var highest = -1;
    var highestIndex = -1
    for (var n = 0; n < gerryArraySort.length; n++) {
        for (var m = 0; m < gerryArraySort.length; m++) {
            if(gerryArraySort[m] > highest) {
                highest = gerryArraySort[m];
                highestIndex = m;
            }
        }
        highest = -1;
        gerryArraySort[highestIndex] = -2;
        gerryList.push(highestIndex)
    }
    initTransformation();
}

function initTransformation() {
    var totalHeight = 0;
    for (var z = 0; z < nameArray.length; z++) {
        //console.log(nameArray[z])
        d3v4.select('.' + nameArray[z]).attr("transform", "translate(" + 0 + "," + totalHeight+ ")");
        totalHeight = d3v4.select('.' + nameArray[z])['_groups'][0][0].getBBox().height + totalHeight + yMargin
    }
    //console.log('here')
    return;
}

/**
function getData(nanme) {
    for (var b = 0; b < data.length; b++) {
        if (name == data[b]['State']) {
            return data[b];
        }
    }
}
**/

function sortByName() {
    var totalHeight = 0;

    if (nameBit) {
        for (var z = 0; z < nameArray.length; z++) {
            d3v4.select('.' + nameArray[z]).transition().duration(250).attr("transform", "translate(" + xMargin + "," + (totalHeight) + ")")
            totalHeight = totalHeight + yMarginSpacing;

        }
    } else {
        for (var c = nameArray.length; c >= 0; c--) {
            d3v4.select('.' + nameArray[c]).transition().duration(250).attr("transform", "translate(" + xMargin + "," + (totalHeight - yMarginSpacing) + ")")
            totalHeight = totalHeight + yMarginSpacing;
        }
    }
    nameBit = !nameBit;
}

function sortByGerry() {
    console.log(gerryArray)
    var totalHeight = 0;
    if (gerryBit) {
        for (var z = 0; z < nameArray.length; z++) {
            console.log(gerryList[z])
            d3v4.select('.' + nameArray[gerryList[z]]).transition().duration(250).attr("transform", "translate(" + xMargin + "," + totalHeight+ ")")
            totalHeight = totalHeight + yMarginSpacing;
        }
    } else {
        for (var c = nameArray.length; c >= 0; c--) {
            d3v4.select('.' + nameArray[gerryList[c]]).transition().duration(250).attr("transform", "translate(" + xMargin + "," + (totalHeight - yMarginSpacing) + ")")
            totalHeight = totalHeight + yMarginSpacing;
        }
    }
    gerryBit = !gerryBit;
}

//To Do
function sortByParty() {
    var totalHeight = 0;
    if (partyBit) {
        for (var z = 0; z < nameArray.length; z++) {
            console.log(gerryList[z])
            d3v4.select('.' + nameArray[gerryList[z]]).transition().duration(250).attr("transform", "translate(" + xMargin + "," + totalHeight+ ")")
            totalHeight = totalHeight + yMarginSpacing;
        }
    } else {
        for (var c = nameArray.length; c >= 0; c--) {
            d3v4.select('.' + nameArray[gerryList[c]]).transition().duration(250).attr("transform", "translate(" + xMargin + "," + (totalHeight - yMarginSpacing) + ")")
            totalHeight = totalHeight + yMarginSpacing;
        }
    }
    gerryBit = !gerryBit;
}


/**
 .on("mouseover", function(d) {
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    div.html('    ')
                        .style("left", (d3v4.event.pageX + 5) + "px")
                        .style("top", (d3v4.event.pageY - 28) + "px");
                })
 .on("mouseout", function(d) {
                    div.transition()
                        .duration(100)
                        .style("opacity", 0);
                });
**/