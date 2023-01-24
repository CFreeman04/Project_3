// Our static json made from jsonifying our csv
var url = "../../waffle_house.json";

// Perform a GET request to the query URL/
d3.json(url).then(function(data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createMaps(data);
});

// Functipon to determine marker color
rating_numbers = [0, 3, 3.8, 4.2]
function chooseColor(rating) {
  if (rating < rating_numbers[1]) return "gray";
  else if (rating < rating_numbers[2]) return "yellow";
  else if (rating < rating_numbers[3]) return "green";
  else return "blue";
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
        L.circle([waffles[i].lat, waffles[i].lng], {
          fillOpacity: 0.75,
          color: "black",
          weight: .5,
          fillColor: chooseColor(waffles[i].rating),
          // Setting our circle's radius to equal the output of our markerSize() function:
          // This will make our marker's size proportionate to earthquake magnitude
          radius: 15000
        }).bindPopup(`<h2>${waffles[i].name}</h2> <hr> <h3>${waffles[i].address}</h3>`).addTo(myMap);
      }

   // ------- Legend for ratings -------------------------------------------
    var legend = L.control({ position: "topright" });
  
    legend.onAdd = function(map) {  
      var div = L.DomUtil.create("div", "legend");

      div.innerHTML = "<h4>Rating</h4>";
      for (i = 0; i < rating_numbers.length; i++) {
        div.innerHTML += '<i style="background:' + chooseColor(rating_numbers[i]) + '"></i>' + 
                rating_numbers[i] + (rating_numbers[i+1] ? '&ndash;' + rating_numbers[i+1] : '+') + '<br>';
      }
    return div;
   };
  
  legend.addTo(myMap);  
  // ----------- Legend -------------------------------------------------------
  }
