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
                } else if (hData[innerCounter]['Winner'] == 'Dem') {
                    districts[innerState]['Democrats'].push(hData[innerCounter]['District'])
                }
                innerCounter = innerCounter + 1
            }
            state = hData[a]['State']
        }
    }
    return districts;
}



function createInitialGrid(data, districts) {

    //Set up circles and x and y values
    var cRadius = 5;

    //Add district data to stte data
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

        if (data[x]['State'].includes(' ')) {
            data[x]['State'] = data[x]['State'].split(' ')[0] + '_' + data[x]['State'].split(' ')[1]
        }

        //Initial SVG container for each state
        var svgContainer = d3v4.select(".gerry").append('g').attr('class', data[x]['State']).attr("transform", "translate(" + (0) + ",0)");  //Transform xMargin pixels to the right, no y manipulation

        //Set up state text names
        svgContainer.append("text")
            .attr("x", 220)
            .attr("y", xAxisY - 100)
            .attr("dy", "1em")
            .attr('font-size', 20)
            .text(function() { return data[x]['State'].replace('_', ' ') });

        //Blue Dots
        //console.log(data[x]['Districts']['Democrats'])
        svgContainer.selectAll('circle').data(data[x]['Districts']['Democrats']).enter().append('circle')
            .style('fill', '#4575b4')
            .attr('r', cRadius)
            .attr('cx', function(d, i) {
                return 30 + 15* parseInt(i%5)
            })
            .attr('cy', function (d, i) {
                return 50 + 18 * parseInt(i/5)
            })
            .on("mouseover", function(d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9)
                div.html(d)
                    .style("left", (d3v4.event.pageX + 5) + "px")
                    .style("top", (d3v4.event.pageY - 28) + "px")
            })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(100)
                    .style("opacity", 0);
            });



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
        console.log(data[x]['Districts']['Republicans'])
        svgContainer.append('g').selectAll('circle').data(data[x]['Districts']['Republicans']).enter().append('circle')
            .style('fill', 'red')
            .attr('r', cRadius)
            .attr('cx', function (d, i) {
                //console.log(d)
                return 400 + 15 * (parseInt(i%5))
            })
            .attr('cy', function (d, i) {
                return 50 + 18 * (parseInt(i/5))
            })
            .on("mouseover", function(d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(d)
                    .style("left", (d3v4.event.pageX + 5) + "px")
                    .style("top", (d3v4.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(100)
                    .style("opacity", 0);
            });

        nameArray.push(data[x]['State'])
        gerryArray.push(Math.abs(parseFloat(data[x]['Gop % of Votes']) - parseFloat(data[x]['Gop % of Seats'])))
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
    return;
}

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
    //console.log(gerryArray)
    var totalHeight = 0;
    if (gerryBit) {
        for (var z = 0; z < nameArray.length; z++) {
            //console.log(gerryList[z])
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

//TODO   Need to implement sort by party column
function sortByParty() {
    var totalHeight = 0;
    if (partyBit) {
        for (var z = 0; z < nameArray.length; z++) {
            //console.log(gerryList[z])
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
