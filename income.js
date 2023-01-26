// Our static json made from jsonifying our csv
//var url = "waffle_house.json"
var url = "Cleaned_IncomeData.json";

// Perform a GET request to the query URL/
d3.json(url).then(function(data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createMaps(data);
});

// Functipon to determine marker color
income_levels = [0,30000, 60000, 90000, 120000, 150000]
function chooseColor(Median) {
  if (Median < income_levels[1]) return "purple";
  else if (Median < income_levels[2]) return "cyan";
  else if (Median < income_levels[3]) return "orange";
  else if (Median < income_levels[4]) return "red";
  else if (Median < income_levels[5]) return "plum";
  else return "lime";
}

function createMaps(waffles) {
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
    var myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 5,
      layers: street
    });
  
      for (var i = 0; i < Object.keys((waffles)).length; i++) {
        L.circle([waffles[i].Lat, waffles[i].Lon], {
          fillOpacity: 0.50,
          color: "black",
          weight: .5,
          fillColor: chooseColor(waffles[i].Median),
          // Setting our circle's radius to equal the output of our markerSize() function:
          // This will make our marker's size proportionate to earthquake magnitude
          radius: 5000
        }).bindPopup(`<h2>${waffles[i].City}</h2> <hr> <h3>${waffles[i].Median}</h3>`).addTo(myMap);
      }

   // ------- Legend for ratings -------------------------------------------
    var legend = L.control({ position: "topright" });
  
    legend.onAdd = function(map) {  
      var div = L.DomUtil.create("div", "legend");

      div.innerHTML = "<h4>Median Income</h4>";
      for (i = 0; i < income_levels.length; i++) {
        div.innerHTML += '<i style="background:' + chooseColor(income_levels[i]) + '"></i>' + 
                income_levels[i] + (income_levels[i+1] ? '&ndash;' + income_levels[i+1] : '+') + '<br>';
      }
    return div;
   };
  
  legend.addTo(myMap);  
  // ----------- Legend -------------------------------------------------------
  }
