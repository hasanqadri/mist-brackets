/**
 * Created by haesa on 2/12/2019.
 */


function gerry_graphs() {
//var margin = {top: 100, right: 275, bottom: 40, left: 275};


    var width = 960,
        height = 760;

    var svg = d3v4.select(".house")
        .attr("width", width)
        .attr("height", height)
        .append("g");

    d3v4.csv('./Data/house_gerry.csv', function (data) {

        //Set up circles and x and y values
        var cRadius = 8;
        var cx = 20;
        var cy = 20;

        var xx = 20;
        var gx = 800;
        var yy = 100;
        var gy = 100;

        //X Scale
        var datas = [0,25, 50, 75, 100];
        var extent = d3v4.extent(datas);

        var linearScale = d3v4.scaleLinear()
            .domain(extent)
            .range([0, 600]);

        var axis = d3v4.axisBottom(linearScale);

        //Y Scale
        var xAxisY = 100;

        //Create state groups
        for (var x = 0; x < data.length; x++) {

            var svgContainer = d3v4.select(".gerry").append('g').attr('class', data[x]['State']).attr("transform", "translate(" + (450) + ",0)");  //Transform 450 pixels to the right, no y manipulation

            //Set up state text names
            svgContainer.append("text")
                .attr("x", 420)
                .attr("y", xAxisY - 100)
                .attr("dy", "1em")
                .attr('font-size', 20)
                .text(function() { return data[x]['State'] });


            //Blue Dots
            var count = 0;
            for (var z = 0; z < data[x]['Dem Wins']; z++) {
                svgContainer.append('circle')
                    .style('fill', '#4575b4')
                    .attr('r', cRadius)
                    .attr('cx', function (d, i) {
                        if (count == 5) {
                            xx = 20;
                        }
                        return xx + (i * 80)
                    })
                    .attr('cy', function (d, i) {
                        if (count == 5) {
                            yy = yy + 20;
                            count = 0;
                        }
                        count++;
                        return yy + (i * 80)
                    });
                xx = xx + 18;
            }

            //x_axis
            svgContainer.append("g").attr('class', data[x]['State']).attr("transform", "translate(" + (150) + "," + xAxisY + ")").call(axis)
            xAxisY = xAxisY + 200;

            //vertical line over x_axis
            var calculatedPercentage = data[x]['Gop % of Votes'] * 600;
            svgContainer.append('g').append('line')
                .attr('class', 'xAxis')
                .attr("x1", 150)
                .attr("y1", xAxisY - 10)
                .attr("x2", 150)
                .attr("y2", xAxisY + 10)
                .attr('stroke', 'purple')
                .attr('stroke-width', 4)
                .attr("transform", "translate(" + (calculatedPercentage) + "," + -200 + ")").call(axis);

            //Red Dots
            count = 0;
            for (z = 0; z < data[x]['Gop Wins']; z++) {
                svgContainer.append('circle')
                    .style('fill', 'red')
                    .attr('r', cRadius)
                    .attr('cx', function (d, i) {
                        if (count == 5) {
                            gx = 800;
                            gy = gy + 20;
                            count = 0;
                        }
                        return gx + (i * 80)
                    })
                    .attr('cy', function (d, i) {
                        count++;
                        return gy + (i * 80)
                    });
                gx = gx + 18;

            }

            yy = yy + 180;
            xx = 20;
            gy = gy + 180;
            gx = 800;

            //var bBox = svgContainer.getBBox();
            console.log(svgContainer['_groups'][0][0].getBBox());

//            console.log('XxY', bBox.x + 'x' + bBox.y);

        }
    });

}
