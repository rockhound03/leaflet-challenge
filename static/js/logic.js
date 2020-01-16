var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
//*****************lightest[0] >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> darkest[5] */
var colorArray = ['#ffffd4','#fee391','#fec44f','#fe9929','#d95f0e','#993404'];

var myMap = L.map("map", {
    center: [44.0849, -119.2793],
    zoom: 5
  });
  
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets-basic",
    accessToken: API_KEY
  }).addTo(myMap);

d3.json(queryUrl, function(quakeResponse) {
    //console.log(quakeResponse.features);
    console.log(quakeResponse.features.length)
    for (var i =0;i<quakeResponse.features.length;i++){
      var tempMarker = quakeResponse.features[i];
      var date = new Date(tempMarker.properties.time);
      //console.log(quakeResponse.features[i].geometry.coordinates);
      //console.log(dateFromUTC(tempMarker.properties.time));
      L.circle([tempMarker.geometry.coordinates[1], tempMarker.geometry.coordinates[0]], {
        color: getColor(tempMarker.properties.mag),
        fillColor: getColor(tempMarker.properties.mag),
        fillOpacity: 0.75,
        radius: markerSize(tempMarker.properties.mag)
      }).bindPopup("<h3>Location: Lat: " + tempMarker.geometry.coordinates[1].toPrecision(5) +" Lon: "+tempMarker.geometry.coordinates[0].toPrecision(5)+
       "</h3> <hr> <h3>" + dateFromUTC(tempMarker.properties.time) + "</h3>").addTo(myMap);
    };

    var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = [0,1,2,3,4,5];
    var colors = colorArray;
    var labels = [];

    // Add min & max
    var legendInfo = "<h2 class=\"legend-title\">Earthquake Strength</h2>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "+</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);

    //L.geoJson(quakeResponse).addTo(myMap);

});

function markerSize(magnitude) {
  return 10000 * magnitude;
};

function dateFromUTC(unixTimeStamp){
  var date = new Date(unixTimeStamp);
  return `Date: ${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}\nTime: ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
};

function getColor(magnitude) {
  return magnitude > 5 ? colorArray[5] :
         magnitude > 4 ? colorArray[4] :
         magnitude > 3 ? colorArray[3] :
         magnitude > 2 ? colorArray[2] :
         magnitude > 1 ? colorArray[1] :
                 colorArray[5];
};