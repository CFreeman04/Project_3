function init() {
  var selector = d3.select("#selDataset");

  d3.json("data/waffle_house_data.json").then((waffle_data) => {
    var sampleWaffle = waffle_data.names;
    sampleWaffle.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
   });

   var initialWaffleHouse = sampleWaffle[0];
  //  console.log(initialWaffleHouse);
   showRating(initialWaffleHouse);

   createMaps(waffle_data.data);
  });

//fill options

};

init();

function optionChanged(newWaffle) {
  showRating(newWaffle);
}

function showRating(sample) {
  // d3.select("#selDataset").on("change", function() {
  //   var selectedName = d3.select(this).property("value");
  //   var selectedWaffle = sampleWaffle.filter(waffle => waffle.name === selectedName);
  //   d3.select("#rating").text(`Rating: ${selectedWaffle["0"].rating}`);
  d3.json("data/waffle_house_data.json").then((waffle_data) => {
    var ratings = waffle_data.data

    // FIlter the data for object with selected sample number

    var ratingsArray = ratings.filter(sampleObj => sampleObj.name == sample);
    var selectedWaffle = ratingsArray[0];
    // console.log(selectedWaffle);
    var PANEL = d3.select("#chart");

    // // Clear PANEL before populating with new data
    PANEL.html("");
    PANEL.html(`Rating: ${selectedWaffle.rating} <br> Local Income: $${selectedWaffle.median.toLocaleString("en-US")}`);

    // Object.entries(selectedSample).forEach(([key, value]) => {
    //     PANEL.append("h6").text(`${key}: ${value}`);
    // });
  });

};

// Perform a GET request to the query URL/
// d3.json("data/waffle_house_data.json").then(function(data) {
//   // Once we get a response, send the data.features object to the createFeatures function.
//   createMaps(data);
// });

// Function to determine marker color for Waffle House locations
rating_numbers = [0, 3, 3.8, 4.2]
function chooseWaffleColor(rating) {
  if (rating < rating_numbers[1]) return "gray";
  else if (rating < rating_numbers[2]) return "brown";
  else if (rating < rating_numbers[3]) return "#231F20";
  else return "#FFF200";
}

// Function to determine marker color for incorme data
income_levels = [0, 30000, 60000, 90000, 120000, 150000]
<<<<<<< HEAD
function chooseColor2(median) {
  if (median < income_levels[1]) return "red";
  else if (median < income_levels[2]) return "orange";
  else if (median < income_levels[3]) return "yellow";
  else if (median < income_levels[4]) return "green";
  else if (median < income_levels[5]) return "blue";
  else return "purple";
=======
function chooseIncomeColor(median) {
  if (median < income_levels[1]) return "yellow";
  else if (median < income_levels[2]) return "cyan";
  else if (median < income_levels[3]) return "orange";
  else if (median < income_levels[4]) return "red";
  else if (median < income_levels[5]) return "plum";
  else return "lime";
>>>>>>> 443712a2217b71b9a1ae2fb564a49e877d43758f
}

function createMaps(waffles) {
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // ----------------- Waffle Layer -----------------------------------------------------------------------------------
  // Create circles for waffle
  waffle_house = new L.LayerGroup();
  for (var i = 0; i < Object.keys(waffles).length; i++) {
    L.circle([waffles[i].waffle_house_lat, waffles[i].waffle_house_lon], {
      fillOpacity: 0.75,
      color: "black",
      weight: .5,
<<<<<<< HEAD
      fillColor: chooseColor1(waffles[i].rating),
      radius: 1000
=======
      fillColor: chooseWaffleColor(waffles[i].rating),
      radius: 15000
>>>>>>> 443712a2217b71b9a1ae2fb564a49e877d43758f
    }).bindPopup(`<h2>${waffles[i].name}</h2> <hr> <h3>${waffles[i].address}</h3>`).addTo(waffle_house);
  }
  // -------------------------------------------------------------------------------------------------------------------

  // ----------------- Income Layer ------------------------------------------------------------------------------------
  waffle_income = new L.LayerGroup();
    // Perform a GET request to the query URL/
  d3.json("data/Cleaned_IncomeData.json").then(function(waffle_data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    for (var i = 0; i < Object.keys(waffle_data).length; i++) {
      L.circle([waffle_data[i].Lat, waffle_data[i].Lon], {
        fillOpacity: 0.20,
        color: "black",
        weight: .5,
        fillColor: chooseIncomeColor(waffle_data[i].Median),
        // Setting our circle's radius to equal the output of our markerSize() function:
        // This will make our marker's size proportionate to earthquake magnitude
        radius: 2000
      }).bindPopup(`<h2>${waffle_data[i].City}</h2> <hr> <h3>${waffle_data[i].Median}</h3>`).addTo(waffle_income);
    }
  });
  // --------------------------------------------------------------------------------------------------------------------

  // ------------------ Heat Layer --------------------------------------------------------------------------------------
  heatmap = new L.LayerGroup();

  d3.json("data/waffle_house_data.json").then(function(response) {
    console.log("RESPONSE",response);
    console.log("RES",Object.keys(response.data).length);
    var heatArray = [];
  
    for (var i = 0; i < Object.keys(response.data).length; i++) {
      heatArray.push([response.data[i].waffle_house_lat, response.data[i].waffle_house_lon]);
    } 

    console.log("HA",heatArray);

    var heat = L.heatLayer(heatArray, {
      radius: 50,
      blur: 1
    }).addTo(heatmap);

  });
  // -----------------------------------------------------------------------------------

  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [street, waffle_house]
  });

  // ------- Legend for ratings -------------------------------------------
  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function(map) {  
    var div = L.DomUtil.create("div", "legend");

    div.innerHTML = "<h4>Rating</h4>";
    for (i = 0; i < rating_numbers.length; i++) {
      div.innerHTML += '<i style="background:' + chooseWaffleColor(rating_numbers[i]) + '"></i>' + 
              rating_numbers[i] + (rating_numbers[i+1] ? '&ndash;' + rating_numbers[i+1] : '+') + '<br>';
    }

    // div.innerHTML += '<a href="temp.html"></a>';
    // div.innerHTML += '<br><a href="temp.html">Main Page</a>';
  
    return div;
  };

  legend.addTo(myMap);  

  // Basemaps...only 1 map can be selected
  var baseMaps = {
    "Street": street
  };

  // Overlay Maps...can toggle these data points on/off
  var overlayMaps = {
    "Waffle House": waffle_house,
    "Income": waffle_income,
    "Heatmap": heatmap
  };

  L.control.layers(baseMaps, overlayMaps, {collapsed:false}).addTo(myMap);
  // ----------- Legend -------------------------------------------------------
}
