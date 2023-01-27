// Our static json made from jsonifying our csv
var url = "../../waffle_house.json";

// Perform a GET request to the query URL/
d3.json(url).then(function(data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createMaps(data);
});

// Functipon to determine marker color for Waffle House locations
rating_numbers = [0, 3, 3.8, 4.2]
function chooseColor1(rating) {
  if (rating < rating_numbers[1]) return "gray";
  else if (rating < rating_numbers[2]) return "brown";
  else if (rating < rating_numbers[3]) return "#231F20";
  else return "#FFF200";
}

// Function to determine marker color for incorme data
income_levels = [0, 30000, 60000, 90000, 120000, 150000]
function chooseColor2(median) {
  if (median < income_levels[1]) return "red";
  else if (median < income_levels[2]) return "orange";
  else if (median < income_levels[3]) return "yellow";
  else if (median < income_levels[4]) return "green";
  else if (median < income_levels[5]) return "blue";
  else return "purple";
}

function createMaps(waffles) {
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // ----------------- Waffle Layer -----------------------------------------------------------------------------------
  // Create circles for waffle
  waffle_house = new L.LayerGroup();
  for (var i = 0; i < Object.keys(waffles).length; i++) {
    L.circle([waffles[i].lat, waffles[i].lng], {
      fillOpacity: 0.75,
      color: "black",
      weight: .5,
      fillColor: chooseColor1(waffles[i].rating),
      radius: 1000
    }).bindPopup(`<h2>${waffles[i].name}</h2> <hr> <h3>${waffles[i].address}</h3>`).addTo(waffle_house);
  }
  // -------------------------------------------------------------------------------------------------------------------

  // ----------------- Income Layer ------------------------------------------------------------------------------------
  waffle_income = new L.LayerGroup();
    // Perform a GET request to the query URL/
  d3.json("Cleaned_IncomeData.json").then(function(waffle_data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    for (var i = 0; i < Object.keys(waffle_data).length; i++) {
      L.circle([waffle_data[i].Lat, waffle_data[i].Lon], {
        fillOpacity: 0.20,
        color: "black",
        weight: .5,
        fillColor: chooseColor2(waffle_data[i].Median),
        // Setting our circle's radius to equal the output of our markerSize() function:
        // This will make our marker's size proportionate to earthquake magnitude
        radius: 2000
      }).bindPopup(`<h2>${waffle_data[i].City}</h2> <hr> <h3>${waffle_data[i].Median}</h3>`).addTo(waffle_income);
    }
  });
  // --------------------------------------------------------------------------------------------------------------------

  // ------------------ Heat Layer --------------------------------------------------------------------------------------
  heatmap = new L.LayerGroup();

  d3.json("master_data.json").then(function(response) {

    var heatArray = [];
  
    for (var i = 0; i < Object.keys(response).length; i++) {
      heatArray.push([response[i].waffle_house_lat, response[i].waffle_house_lon]);
    } 

    var heat = L.heatLayer(heatArray, {
      radius: 50,
      blur: 1
    }).addTo(heatmap);

  });
  // -----------------------------------------------------------------------------------

  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [street, heatmap]
  });

   // ------- Legend for ratings -------------------------------------------
  // var legend = L.control({ position: "topright" });

  // legend.onAdd = function(map) {  
  //   var div = L.DomUtil.create("div", "legend");

  //   div.innerHTML = "<h4>Rating</h4>";
  //   for (i = 0; i < rating_numbers.length; i++) {
  //     div.innerHTML += '<i style="background:' + chooseColor1(rating_numbers[i]) + '"></i>' + 
  //             rating_numbers[i] + (rating_numbers[i+1] ? '&ndash;' + rating_numbers[i+1] : '+') + '<br>';
  //   }
  // return div;
  // };

  // legend.addTo(myMap);  

  var baseMaps = {
    "Street": street
  };

  var overlayMaps = {
    "Waffle House": waffle_house,
    "Income": waffle_income,
    "Heatmap": heatmap
  };

  L.control.layers(baseMaps, overlayMaps, {collapsed:false}).addTo(myMap);
  // ----------- Legend -------------------------------------------------------
}
