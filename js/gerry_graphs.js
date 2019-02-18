/**
 * Created by haesa on 2/12/2019.
 */

var svgList = {};
var nameArray = [];  //Contains names of states alphabetically
var gerryArray = []; //Contains names of states by most gerrymandered to least
var gerryList = []
var data = null;
var nameBit = 1;
var gerryBit = 1;
function gerry_graphs() {
//var margin = {top: 100, right: 275, bottom: 40, left: 275};


    var width = 960,
        height = 760;

    var svg = d3v4.select(".house")
        .attr("width", width)
        .attr("height", height)
        .append("g");

    d3v4.csv('./Data/house_gerry.csv', function (gData) {
        data = gData;
        createInitialGrid(gData);
        //I want to have them all stacked up on top of each other.
        //MEasure height of every single one of them with the Bbox.
        //Now look at what parameter we are sorting them by:
        // If sort by name descending, go through hashmap list of every group and translate them alphabetically descending.
        //If sort by name ascending, go through hashmap list of every group and trnaslate them alphabetically asceniding
        //If sort by most gerrymandered ''
        //If sort by least gerrymandered

        //With that order, translte them downwards according to bbox measurements
        //Add tooltips to every circle
    });
}


function createInitialGrid(data) {
    //Set up circles and x and y values
    var cRadius = 8;

    var demCirclesX = 20;
    var gopCirclesX = 800;
    var demCirclesY = 100;
    var gopCirclesY = 100;

    //X Scale
    var datas = [0,25, 50, 75, 100];
    var extent = d3v4.extent(datas);

    var linearScale = d3v4.scaleLinear()
        .domain(extent)
        .range([0, 600]);

    var axis = d3v4.axisBottom(linearScale);

    //Y Scale
    var xAxisY = 100;   //Controls text and x-axis y locations

    //Create state groups
    for (var x = 0; x < data.length; x++) {
        if (data[x]['State'].includes(' ')) {
            data[x]['State'] = data[x]['State'].split(' ')[0] + '_' + data[x]['State'].split(' ')[1]
        }
        var svgContainer = d3v4.select(".gerry").append('g').attr('class', data[x]['State']).attr("transform", "translate(" + (450) + ",0)");  //Transform 450 pixels to the right, no y manipulation

        //Set up state text names
        svgContainer.append("text")
            .attr("x", 420)
            .attr("y", xAxisY - 100)
            .attr("dy", "1em")
            .attr('font-size', 20)
            .text(function() { return data[x]['State'].replace('_', ' ') });


        //Blue Dots
        var count = 0;
        for (var z = 0; z < data[x]['Dem Wins']; z++) {
            svgContainer.append('circle')
                .style('fill', '#4575b4')
                .attr('r', cRadius)
                .attr('cx', function (d, i) {
                    if (count == 5) {
                        demCirclesX = 20;
                    }
                    return demCirclesX + (i * 80)
                })
                .attr('cy', function (d, i) {
                    if (count == 5) {
                        demCirclesY = demCirclesY + 20;
                        count = 0;
                    }
                    count++;
                    return demCirclesY + (i * 80)
                });
            demCirclesX = demCirclesX + 18;
        }

        //x_axis
        svgContainer.append("g").attr('class', data[x]['State']).attr("transform", "translate(" + (150) + "," + xAxisY + ")").call(axis)

        //vertical line over x_axis
        var calculatedPercentage = data[x]['Gop % of Votes'] * 600;
        svgContainer.append('g').append('line')
            .attr('class', 'xAxis')
            .attr("x1", 150)
            .attr("y1", 150)
            .attr("x2", 150)
            .attr("y2", 190)
            .attr('stroke', 'purple')
            .attr('stroke-width', 5)
            .attr("transform", "translate(" + (calculatedPercentage) + "," + -70 + ")").call(axis);

        //Red Dots
        count = 0;
        for (z = 0; z < data[x]['Gop Wins']; z++) {
            svgContainer.append('circle')
                .style('fill', 'red')
                .attr('r', cRadius)
                .attr('cx', function (d, i) {
                    if (count == 5) {
                        gopCirclesX = 800;
                        gopCirclesY = gopCirclesY + 20;
                        count = 0;
                    }
                    return gopCirclesX + (i * 80)
                })
                .attr('cy', function (d, i) {
                    count++;
                    return gopCirclesY + (i * 80)
                });
            gopCirclesX = gopCirclesX + 18;

        }
        nameArray.push(data[x]['State'])
        gerryArray.push(Math.abs(parseFloat(data[x]['Gop % of Votes']) - parseFloat(data[x]['Gop % of Seats'])))
        //demCirclesY = demCirclesY + 180;
        //gopCirclesY = gopCirclesY + 180;
        demCirclesX = 20;
        gopCirclesX = 800;
        demCirclesY = 100;
        gopCirclesY = 100;
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
        d3v4.select('.' + nameArray[z]).attr("transform", "translate(" + 450 + "," + totalHeight+ ")");
        totalHeight = d3v4.select('.' + nameArray[z])['_groups'][0][0].getBBox().height + totalHeight + 50;
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
            d3v4.select('.' + nameArray[z]).attr("transform", "translate(" + 450 + "," + totalHeight+ ")")
            totalHeight = totalHeight + 180;

        }
    } else {
        for (var c = nameArray.length; c >= 0; c--) {
            d3v4.select('.' + nameArray[c]).attr("transform", "translate(" + 450 + "," + totalHeight+ ")")
            totalHeight = totalHeight + 180;
        }
    }
    nameBit = !nameBit;
}

//TO BE CONTINUED
function sortByGerry() {
    console.log(gerryArray)
    var totalHeight = 0;
    if (gerryBit) {
        for (var z = 0; z < nameArray.length; z++) {
            console.log(gerryList[z])
            d3v4.select('.' + nameArray[gerryList[z]]).attr("transform", "translate(" + 450 + "," + totalHeight+ ")")
            totalHeight = totalHeight + 180;
        }
    } else {
        for (var c = nameArray.length; c >= 0; c--) {
            d3v4.select('.' + nameArray[gerryList[c]]).attr("transform", "translate(" + 450 + "," + totalHeight+ ")")
            totalHeight = totalHeight + 180;
        }
    }
    gerryBit = !gerryBit;
}