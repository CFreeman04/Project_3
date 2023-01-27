//THIS IS A WORK IN PROGRESS NOT TO BE CONFUSED FOR FINAL

//Ratings chart
var svg = d3.select("#chart")
        .attr("width", width)
        .attr("height", height);

init();

data.forEach((sample) => {
  selector
    .append("option")
    .text(sample.name)
    .property("value", sample.name);
});
d3.select("#selDataset").on("change", function() {
  var selectedName = d3.select(this).property("value");
  var selectedWaffle = sampleWaffle.filter(waffle => waffle.name === selectedName);
  d3.select("#rating").text(`Rating: ${selectedWaffle["0"].rating}`);
});
d3.json("master_data.json").then((data) => {
  var sampleWaffle = data;
  d3.select("#selDataset").on("change", function() {
    var selectedName = d3.select(this).property("value");
    var selectedWaffle = sampleWaffle.filter(waffle => waffle.name === selectedName);
    d3.select("#rating").text(`Rating: ${selectedWaffle["0"].rating}`);
  });
  svg.selectAll("rect")
  .data(selectedWaffle)
  .enter()
  .append("rect")
  .attr("x", (d, i) => i * (width / selectedWaffle.length))
  .attr("y", d => height - (d.rating * 10))
  .attr("width", width / selectedWaffle.length - barPadding)
  .attr("height", d => d.rating * 10)
  .attr("fill", "teal");
  var yScale = d3.scaleLinear()
              .domain([0, d3.max(selectedWaffle, d => d.rating)])
              .range([height, 0]);

var yAxis = d3.axisLeft(yScale);

svg.append("g")
  .attr("transform", "translate(30, 0)")
  .call(yAxis);

svg.selectAll("text")
  .data(selectedWaffle)
  .enter()
  .append("text")
  .text(d => d.rating)
  .attr("x", (d, i) => i * (width / selectedWaffle.length) + (width / selectedWaffle.length - barPadding) / 2)
  .attr("y", d => height - (d.rating * 10) + 14)
  .attr("font-size", 14)
  .attr("fill", "white")
  .attr("text-anchor", "middle");
});

function init() {
  var selector = d3.select("#selDataset");

  d3.json("names.json").then((data) => {
    var sampleWaffle = data.names;
    sampleWaffle.forEach((sample) => {
      selector
        .append("option")
       .text(sample)
   });
  });
//fill options
}

init();