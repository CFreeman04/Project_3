// our static json made from jsonifying our csv
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Perform a GET request to the query URL/
d3.json(url).then(function(data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createMaps(data.features);

});

// Function to determine marker size 
// using population data from csv
function markerSize(population) {
  return population *1000;
}

// Functipon to determine marker color
function chooseColor(rating) {
  if (rating < 1) return "red";
  else if (rating < 2) return "orange";
  else if (rating < 3) return "yellow";
  else if (rating < 4) return "green";
  else return "blue";
}

function createMaps(earthquake) {
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
    var myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 5,
      layers: street
    });
  
      // Loop through the cities array, and create one marker for each city object.
      for (var i = 0; i < earthquake.length; i++) {
        L.circle([earthquake[i].geometry.coordinates[1], earthquake[i].geometry.coordinates[0]], {
          fillOpacity: 0.75,
          color: "black",
          weight: .5,
          fillColor: chooseColor(earthquake[i].geometry.coordinates[2]),
          // Setting our circle's radius to equal the output of our markerSize() function:
          // This will make our marker's size proportionate to earthquake magnitude
          radius: markerSize(earthquake[i].properties.mag)
        }).bindPopup(`<h1>${earthquake[i].properties.place}</h1> ` +
                    `<hr> <h3>Magnitude: ${earthquake[i].properties.mag} &emsp; Depth: ${earthquake[i].geometry.coordinates[2]}</h3>`).addTo(myMap);
      }
   // ------- Legend for ratings -------------------------------------------
    var legend = L.control({ position: "bottomright" });
  
    legend.onAdd = function(map) {  
      var div = L.DomUtil.create("div", "legend");
  
      div.innerHTML += '<i style="background: red"></i><span>0-1</span><br>';
      div.innerHTML += '<i style="background: orange"></i><span>1-2</span><br>';
      div.innerHTML += '<i style="background: yellow"></i><span>2-3</span><br>';
      div.innerHTML += '<i style="background: green"></i><span>3-4</span><br>';
      div.innerHTML += '<i style="background: blue"></i><span>4+</span><br>';
  
    return div;
   };
  
  legend.addTo(myMap);  
  // ----------- Legend -------------------------------------------------------
  }
