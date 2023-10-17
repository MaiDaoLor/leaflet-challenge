// Get
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson"


// create the map
var map = L.map('map').setView([15, -0.40], 3);

// create tile layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Using Leaflet, create a map that plots all the earthquakes 
// from your dataset based on their longitude and latitude.

// call data
d3.json(url).then(data=>{
    console.log(data.features[500]);

    L.geoJSON(data, {
        pointToLayer: function(geoJsonPoint, latlng) {
            return L.circleMarker(latlng);
        },
        style: function (feature) {
            let depth = feature.geometry.coordinates[2];

            return {
                radius: feature.properties.mag*4,
                weight: 1,
                fillOpacity: .8,
                color: 'black',
                fillColor:  depth < 10 ? '#98EE00' : 
                            depth < 30 ? '#D4EE00' :
                            depth < 50 ? '#EECC00' :
                            depth < 70 ? '#EE9C00' :
                            depth < 90 ? '#EA822C' : '#EA2C2C'
            };
        }
            
    }).bindPopup(function (layer) {
        return layer.feature.properties.description;
    }).addTo(map);

    let legend = L.control({position: "bottomright"});

    legend.onAdd = function () {
        let div = L.DomUtil.create("div", "info legend");
    
        let grades = [-10, 10, 30, 50, 70, 90];
        let colors = [
          "#98ee00",
          "#d4ee00",
          "#eecc00",
          "#ee9c00",
          "#ea822c",
          "#ea2c2c"];
    
        // Loop through our intervals and generate a label with a colored square for each interval.
        for (let i = 0; i < grades.length; i++) {
          div.innerHTML += "<i style='background: "
            + colors[i]
            + "'></i> "
            + grades[i]
            + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
        return div;
      };
    
    legend.addTo(map);

});
