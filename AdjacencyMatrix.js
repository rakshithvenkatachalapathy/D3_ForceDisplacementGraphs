<!-- https://bl.ocks.org/KingOfCramers/32bbcd8c360e6d8aa0d5b7a50725fe73 -->
<html>
<head>
    
    <meta charset="utf-8" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js"></script>
    <script src="https://d3js.org/queue.v1.min.js" type="text/JavaScript"></script>
</head>
<style>
    svg {
        height: 1000px;
        width: 900px;
        border: 1px solid gray;
    }
</style>

<body>

    <div id="viz">
        <svg>
        </svg>
    </div>
    <div id="controls" />
</body>
<footer>

    <script>
        queue()
            .defer(d3.csv, "nl.csv")
            .defer(d3.csv, "el.csv")
            .await(function (error, file1, file2) { createAdjacencyMatrix(file1, file2); });

        function createAdjacencyMatrix(nodes, edges) {
            var edgeHash = {};
            for (x in edges) {
                var id = edges[x].source + "-" + edges[x].target;
                edgeHash[id] = edges[x];
            }
            matrix = [];
            //create all possible edges
            for (a in nodes) {
                for (b in nodes) {
                    var grid = { id: nodes[a].id + "-" + nodes[b].id, x: b, y: a, weight: 0 };
                    if (edgeHash[grid.id]) {
                        grid.weight = edgeHash[grid.id].weight;
                    }
                    matrix.push(grid);
                }
            }

            d3.select("svg")
                .append("g")
                .attr("transform", "translate(50,50)")
                .attr("id", "adjacencyG")
                .selectAll("rect")
                .data(matrix)
                .enter()
                .append("rect")
                .attr("width", 25)
                .attr("height", 25)
                .attr("x", function (d) { return d.x * 25 })
                .attr("y", function (d) { return d.y * 25 })
                .style("stroke", "black")
                .style("stroke-width", "1px")
                .style("fill", "red")
                .style("fill-opacity", function (d) { return d.weight * .2 })
                .on("mouseover", gridOver)

            var scaleSize = nodes.length * 25;
            var nameScale = d3.scale.ordinal().domain(nodes.map(function (el) { return el.id })).rangePoints([0, scaleSize], 1);

            xAxis = d3.svg.axis().scale(nameScale).orient("top").tickSize(4);
            yAxis = d3.svg.axis().scale(nameScale).orient("left").tickSize(4);
            d3.select("#adjacencyG").append("g").call(xAxis).selectAll("text").style("text-anchor", "end").attr("transform", "translate(-10,-10) rotate(90)");
            d3.select("#adjacencyG").append("g").call(yAxis);

            function gridOver(d, i) {
                d3.selectAll("rect").style("stroke-width", function (p) { return p.x == d.x || p.y == d.y ? "3px" : "1px" })
            }

        }
    </script>
</footer>

</html>