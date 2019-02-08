<<<<<<< HEAD


var mymap = L.map('mapid').setView([39.75621, -104.99404], 15);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
		'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	id: 'mapbox.streets'
}).addTo(mymap);

// new code goes below here

var geojsonFeature = {
	    "type": "Feature",
	    "properties": {
	        "name": "Coors Field",
	        "amenity": "Baseball Stadium",
	        "popupContent": "This is where the Rockies play!"
	    },
	    "geometry": {
	        "type": "Point",
	        "coordinates": [39.75621, -104.99404]
	    }
	};

// this wont work for some reason

// var myLayer = L.geoJSON().addTo(map);
// myLayer.addData(geojsonFeature);

// function(geoJsonPoint, latlng) {
// 	return L.marker(latlng);
// }
// myLayer.addData(geojsonFeature);

// // var myLines = [{
// //     "type": "LineString",
// //     "coordinates": [[40,-100], [45,-105], [55,-110]]
// // }, {
// //     "type": "LineString",
// //     "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
// // }];
// // myLayer.addData(myLines);

function onMapClick(e) {
	L.popup()
		.setContent("You clicked the map at " + e.latlng)
		.setLatLng(e.latlng)
		.openOn(mymap);
}

=======


var mymap = L.map('mapid').setView([39.75621, -104.99404], 15);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
		'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	id: 'mapbox.streets'
}).addTo(mymap);

// new code goes below here

var geojsonFeature = {
	    "type": "Feature",
	    "properties": {
	        "name": "Coors Field",
	        "amenity": "Baseball Stadium",
	        "popupContent": "This is where the Rockies play!"
	    },
	    "geometry": {
	        "type": "Point",
	        "coordinates": [39.75621, -104.99404]
	    }
	};

// this wont work for some reason

// var myLayer = L.geoJSON().addTo(map);
// myLayer.addData(geojsonFeature);

// function(geoJsonPoint, latlng) {
// 	return L.marker(latlng);
// }
// myLayer.addData(geojsonFeature);

// // var myLines = [{
// //     "type": "LineString",
// //     "coordinates": [[40,-100], [45,-105], [55,-110]]
// // }, {
// //     "type": "LineString",
// //     "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
// // }];
// // myLayer.addData(myLines);

function onMapClick(e) {
	L.popup()
		.setContent("You clicked the map at " + e.latlng)
		.setLatLng(e.latlng)
		.openOn(mymap);
}

>>>>>>> 61fa2e948928a3915927898f46e08d0cdcf1d635
mymap.on('click', onMapClick);