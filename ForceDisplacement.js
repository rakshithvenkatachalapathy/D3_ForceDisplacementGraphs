<!-- https://embed.plnkr.co/plunk/VZQjMV
  https://livebook.manning.com/book/d3-js-in-action/chapter-6/54 -->
<html>

<head>
  <meta charset="utf-8" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js"></script>
  <script src="https://d3js.org/queue.v1.min.js" type="text/JavaScript"></script>
</head>
<style>
  svg {
    height: 1000px;
    width: 1000px;
    border: 1px solid gray;
  }
</style>

<body>

  <div id="viz">
    <svg>
    </svg>
  </div>
</body>
<footer>
  <script>

    queue()
      .defer(d3.csv, "nl.csv") // reading the nodes
      .defer(d3.csv, "el.csv") // reading the edges
      .await(function (error, file1, file2) { createForceLayout(file1, file2); });

    function createForceLayout(nodes, edges) {
      var nodeHash = {};
      for (x in nodes) {
        nodeHash[nodes[x].id] = nodes[x];
      }
      for (x in edges) {
        edges[x].weight = parseInt(edges[x].weight);
        edges[x].source = nodeHash[edges[x].source];
        edges[x].target = nodeHash[edges[x].target];
      }

      var weightScale = d3.scale.linear().domain(d3.extent(edges, function (d) { return d.weight })).range([.1, 1])
      force = d3.layout.force()
        .charge(function (d) {
          //introducing some force in the network
          //calculating a force for the weight since all the weights are 1
          n = Math.random() * 10 / 2
          return d.weight * n * -500
        })
        .gravity(1.2)
        .size([1000, 1000]).nodes(nodes)
        .links(edges).on("tick", forceTick);

      d3.select("svg")
        .selectAll("line.link")
        .data(edges, function (d) { return d.source.id + "-" + d.target.id }).enter()
        .append("line")
        .attr("class", "link")
        .style("stroke", "black")
        .style("opacity", .5)
        .style("stroke-width", function (d) { return d.weight });

      var nodeEnter = d3.select("svg").selectAll("g.node").data(nodes, function (d) { return d.id }).enter()
        .append("g")
        .attr("class", "node")
        .call(force.drag())
        .on("click", fixNode);

      function fixNode(d) {
        d3.select(this).select("circle").style("stroke-width", 4);
        d.fixed = true;
      }

      nodeEnter.append("circle")
        .attr("r", 5)
        .style("fill", "lightgray")
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .on("mouseover", onNodeHover)
        .on("mouseout", onNodeHoverOut); //Hover functionality 

      nodeEnter.append("text")
        .style("text-anchor", "middle")
        .attr("y", 15)
        .text(function (d) { return d.id })
      d3.selectAll("line").attr("marker-end", "url(#Triangle)");
      force.start();

      function forceTick() {
        d3.selectAll("line.link")
          .attr("x1", function (d) { return d.source.x })
          .attr("x2", function (d) { return d.target.x })
          .attr("y1", function (d) { return d.source.y })
          .attr("y2", function (d) { return d.target.y });

        d3.selectAll("g.node")
          .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")" })
      }

      //Hover functions
      function onNodeHover(d, i) {
        d3.select(this)
        .attr("r", 9)
        .style("fill", "red")
      }
      function onNodeHoverOut(d, i) {
        d3.select(this)
        .attr("r", 5)
        .style("fill", "lightgray")
      }
    }
  </script>
</footer>

</html>
