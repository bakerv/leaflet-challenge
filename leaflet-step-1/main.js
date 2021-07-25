let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

d3.json(url).then(data => {
    console.log(data.features);

    var earthquakes = L.geoJSON(data.features, {
        pointToLayer: function(feature, latlng) {

            var colorScale = ""
            if (feature.geometry.coordinates[2] < 10){
                colorScale = "green";
            }
            else if (feature.geometry.coordinates[2] < 20){
                colorScale = "red";
            }
            else if (feature.geometry.coordinates[2] < 30){
                colorScale = "blue";
            }
            else if (feature.geometry.coordinates[2] < 40){
                colorScale = "orange";
            }
            else {
                colorScale = "black"
            }

            var markerAttributes = {
                radius:  5 ** feature.properties.mag /1000 ,
                color: colorScale,
                weight: 0,
                fillOpacity: 0.8
            }

            return L.circleMarker(latlng,markerAttributes)
                .bindPopup("<strong>" +feature.properties.title +"</strong>" + "<br>" +Date(feature.properties.time));
        }
    });

    generateMap(earthquakes)
});

function generateMap(earthquakes) {
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
    });

    var overlayMaps = {
        Earthquakes: earthquakes
    };

    var baseMaps = {
        "Street Map": streetmap
    };
    var myMap = L.map("map", {
        center: [37.09,-95.71],
        zoom: 5,
        layers: [streetmap]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false }).addTo(myMap);
    }

function bindFeatures(feature,layer) {
    layer.bindPopup(feature.properties.title);
}


