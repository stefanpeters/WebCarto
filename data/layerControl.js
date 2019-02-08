
jQuery.loadScript = function (url, callback) {
    jQuery.ajax({
        url: 'https://unpkg.com/leaflet@1.3.4/dist/leaflet.js',
        dataType: 'script',
        success: callback,
        async: true
    });
}

var map = L.map('mapid').setView([37.8, -96], 4);
var mapboxAccessToken = 'pk.eyJ1IjoiYWtlYW5lIiwiYSI6ImNqbjhtaW5wMTFnY3ozdG1qdzIzaWtzbXMifQ.uRpuBKjptoz-b4cm7akDtQ';
var mapboxUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
var event = '0';
var mapboxAttribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
		'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';



L.tileLayer(mapboxUrl, {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
		'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	id: 'mapbox.streets'
}).addTo(map);

function onMapClick(e) {
    alert("event passed point " + event);
}
map.on('click', onMapClick);

// ------new code goes below here------
// note that the progression will not work if one element fails

// here markers are defined for cities, and then combined into a layer 'cities' via "LayerGroup"
		// creates popup of latitude and logitude



var littleton = L.marker([39.61, -105.02]).bindPopup('This is Littleton, CO.'),
    denver    = L.marker([39.74, -104.99]).bindPopup('This is Denver, CO.'),
    aurora    = L.marker([39.73, -104.8]).bindPopup('This is Aurora, CO.'),
    golden    = L.marker([39.77, -105.23]).bindPopup('This is Golden, CO.');

var cities = L.layerGroup([littleton, denver, aurora, golden]),
	event = '1';

var grayscale = L.tileLayer(mapboxUrl, {id: 'mapbox.light', attribution: mapboxAttribution}),
	event = '2';
var streets = L.tileLayer(mapboxUrl, {id: 'mapbox.streets', attribution: mapboxAttribution}),
	event = '3';

var map = L.map('map', {
    center: [39.73, -104.99],
    zoom: 10,
    layers: []
});
var	event = '4';
var baseMaps = {
    "Grayscale": grayscale,
    "Streets": streets
},
	event = '4';
var overlayMaps = {
    "Cities": cities
},
	event = '6';



L.control.layers(baseMaps, overlayMaps).addTo(map);