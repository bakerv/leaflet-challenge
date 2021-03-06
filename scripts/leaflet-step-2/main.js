let earthquake_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";
let boundaries_url = "../../data/PB2002_boundaries.json"

var overlayMaps = {
    Earthquakes: new L.LayerGroup(),
    Boundaries: new L.LayerGroup()
};

var map = L.map("map", {
    center: [37.09,-95.71],
    zoom: 5,
    worldCopyJump: "True",
    layers: [
        overlayMaps.Earthquakes,
        overlayMaps.Boundaries
    ]
});

var streetMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
tileSize: 512,
maxZoom: 18,
zoomOffset: -1,
id: "mapbox/streets-v11",
accessToken: API_KEY
});

var darkMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
tileSize: 512,
maxZoom: 18,
zoomOffset: -1,
id: "mapbox/dark-v10",
accessToken: API_KEY
}).addTo(map);

var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
tileSize: 512,
maxZoom: 18,
zoomOffset: -1,
id: "mapbox/satellite-v9",
accessToken: API_KEY
});

 baseMaps = {
    "Dark Map": darkMap,
    "Satellite": satelliteMap,
    "Street Map": streetMap
};

L.control.layers(baseMaps, overlayMaps, {
    collapsed: false 
}).addTo(map);


function addBoundaries(data,map) {
    d3.json(data).then(rawdata => {
        var boundaries = L.geoJSON(rawdata.features)
        boundaries.addTo(map)
        boundaries.addTo(overlayMaps["Boundaries"]);
    });
}

// generates the map using leaflet and geojson data
function plotEarthquakes(dataSet,map) {
    d3.json(dataSet).then(data =>{
        // generates a marker on the map for each earthquake in the data set
        var earthquakes = L.geoJSON(data.features, {
            pointToLayer: function(feature, latlng) {
        
                // dynamic attributes to pass to L.circleMarker() 
                var markerAttributes = {
                    radius: 10 + (5 ** feature.properties.mag /1000),
                    color: 'black',
                    fillColor: setColor(feature.geometry.coordinates[2]),
                    weight: 1,
                    fillOpacity: 0.8
                };

                var date = new Date(feature.properties.time).toString();
                // generate the circular marker, and bind a popup to that marker
                return L.circleMarker(latlng,markerAttributes)
                    .bindPopup("<strong>" +feature.properties.title + "</strong>" + "<br>" 
                    + date + "<br><br>"
                    + "Latitude:" + feature.geometry.coordinates[0] + "<br>"
                    + "Longitude: "+ feature.geometry.coordinates[1] + "<br>"
                    +"Depth: "+ feature.geometry.coordinates[2] + " km");
            }
            
        });
        earthquakes.addTo(map);
        earthquakes.addTo(overlayMaps["Earthquakes"]);
    });
}

function addLegend(map) {
    var legend = L.control({position:"bottomleft"});

    legend.onAdd = function(myMap) {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += '<h3>Depth (km)</h3>';
        div.innerHTML += '<i style="background: #ffffcc"></i><span>0-10</span><br>';
        div.innerHTML += '<i style="background: #ffeda0"></i><span>11-20</span><br>';
        div.innerHTML += '<i style="background: #fed976"></i><span>21-30</span><br>';
        div.innerHTML += '<i style="background: #feb24c"></i><span>31-40</span><br>';
        div.innerHTML += '<i style="background: #fd8d3c"></i><span>41-50</span><br>';
        div.innerHTML += '<i style="background: #fc4e2a"></i><span>51-60</span><br>';
        div.innerHTML += '<i style="background: #e31a1c"></i><span>61-70</span><br>';
        div.innerHTML += '<i style="background: #b10026"></i><span> >70</span><br>';

        return div;
    }
    legend.addTo(map);
}

function setColor(data) {
    var colorScale = ""
    if (data <= 10){
        colorScale = "#ffffcc";
    }
    else if (data <= 20){
        colorScale = "#ffeda0";
    }
    else if (data <= 30){
        colorScale = "#fed976";
    }
    else if (data <= 40){
        colorScale = "#feb24c";
    }
    else if (data <= 50){
        colorScale = "#fd8d3c";
    }
    else if (data <= 60){
        colorScale = "#fc4e2a";
    }
    else if (data <= 70){
        colorScale = "#e31a1c";
    }
    else {
        colorScale = "#b10026"
    }

    return colorScale;
}

addBoundaries(boundaries_url,map);
plotEarthquakes(earthquake_url,map);
addLegend(map);
