// var slider = document.getElementById("myRange");
// var output = document.getElementById("demo");
// var dec = document.getElementById("dec7");

//this can be used to reload some element filters when the check box changes
	//all elements checked at start, all layers added
	//on check, hit myfuction
	//if checkbox 'a' is not checked remove affected elements from map <----however how will this work with multiple criteria? we'd 
		//need multiple layers. its better to construct and apply a new filter
	// alt: if checkbox 'a' is notchecked/unchecked; construct new filter parameters to be applied on all layers
// var decFilter = {};
	
//this is used to check a single element, we want to check all
	// function myFunction (a) {
	// 	var checkbox = document.getElementById(a);
	// 	if (checkbox.checked) {
	// 		alert("checkbox"+a+"checked")
	// 		// decFilter.push({
	// 		// 	filter: function(feature) {
	// 		// 		if (feature.properties.FIREYEAR >=output.innerHTML) return true;
	// 		// 	}
	// 		// });
	// 		// alert(decFilter)
	// 	};
	// }
//recall this:
		// filter: function(feature) {
		// 	if (feature.properties.FIREYEAR >=2016) return true;
		// }
// is what we want to build, store, and eval on each click
// having:
		// filter: function(feature) {
		// 	if 
		//(feature.properties.FIREYEAR >=2016 && feature.properties.SEASON =='SUMMER') 
		//return true;
		// }
// is the same the and function; and kind of the thing we want to build. but we need the part contained within eval()
		// filter: function(feature) {
		// 	if (eval('feature.properties.FIREYEAR >= 2016 && feature.properties.SEASON =="SPRING"')) return true;
		// },
// so we need to construct this string:
		// 'feature.properties.FIREYEAR >= 2016 && feature.properties.SEASON =="SPRING"' 
// but for within seasons or decades, we'll need an or:
// 		// 'feature.properties.FIREYEAR <= 1960 || 'feature.properties.FIREYEAR >= 2000' 

// //

// THIS POINT LAST
// /was trying to create an array of strings that could be chosen from based on if the array decFilter had a true value in the same position
	function betwValues(x, a, b) {
		return (x >= a) && (x < b);
	}

//As it stands this function upon being called checks the check boxes with id's 'dec[i]' and 'seas[i]' and returns a string that can be evaluated using eval() ..
//.. in order tio create a dynamic filter.
//as myFilter is not defined until myFunction is called by a button press, its best to call this before defining any variables initially
	function myFilterFunction() {
		var myFilter = '(   ';
		var testVar1 = '';
		// var decArray = ['< 1960 && >=1950', '<1970', '<1980', '<1990', '<2000', '<2010']; //keep this for simplification purpose later
		for(i = 0; i < 7; i++) {
			var decbox = document.getElementById('dec'+ (i+1).toString());
			if(decbox.checked) {
				testVar1 += i.toString();
				testArr = ('betwValues(feature.properties.FIREYEAR, ' + (1950+i*10).toString() + ', '+ (1960+i*10).toString() + ')');
				myFilter += testArr + ' || ';
			};
		};
		myFilter = myFilter.slice(0,-3);	//this is to remove the last (||), may possible break is myFilter is empty, simple fix is to make myFilter 2 spaces long
		// add the and to the filter for seasons
		myFilter += ') && (  '
		var seasArray = ['"SUMMER"', '"AUTUMN"','"WINTER"','"SPRING"'];
		var testVar2 = '';
		for(i = 0; i < 4; i++) {
			var seasbox = document.getElementById('seas'+ (i+1).toString());
			// alert(seasonArray[i] + ' checked');
			if(seasbox.checked) {
				myFilter += 'feature.properties.SEASON ==' +seasArray[i] + ' || ';
				testVar2 += (i+7).toString();
			};
		};
		myFilter = myFilter.slice(0,-3);
		myFilter += ') && (  '
		var IncidentArray = ['"Bushfire"', '"Prescribed Burn"'];
		var testVar3 = '';
		for(i = 0; i < 2; i++) {
			var seasbox = document.getElementById('burn'+ (i+1).toString());
			// alert(seasonArray[i] + ' checked');
			if(seasbox.checked) {
				myFilter += 'feature.properties.INCIDENTTY ==' +IncidentArray[i] + ' || ';
				testVar3 += (i+11).toString();
			};
		};
		myFilter = myFilter.slice(0,-3);
		myFilter += ')';
		if(testVar1 == '' || testVar2 == '' || testVar3 == '') myFilter = false;		//if no option is selected it returns false
		// alert(testVar + ' mFilter = ' + myFilter + (betwValues(10,1,10)).toString() );
		// alert(testVar1 + testVar2 + ' mFilter = ' + myFilter);
		return myFilter
	};
	
// this calculated the layers used in the map. the problem with this is it calls FireBanDist too which is unaffected by filters
	function layerCalc() {
		// var FireBanDist = new L.Shapefile('/data/Fire_Ban_districts.zip', {
		// 	onEachFeature: onEachFeature,
		// 	style: style
		// });
		var LastFireArea = new L.Shapefile('./data/LastFire_areas.zip', {
			onEachFeature: onEachFeature,
			style: areaStyle,
			filter: function(feature) {
				if (eval(myFilterFunction())) return true
			}
		});
		var LastFireCent = L.geoJson(LastFire_centroids, {
			onEachFeature: onEachFeature,
			pointToLayer: function(feature, latlng) {
				if (feature.properties.INCIDENTTY == "Bushfire") {
					return L.marker(latlng, {icon: fireIcon})
					}
				else if (feature.properties.INCIDENTTY == "Prescribed Burn") {
					return L.marker(latlng, {icon: prescribedIcon})
					}
				else return L.circleMarker(latlng)
    			},
			filter: function(feature) {
				if (eval(myFilterFunction())) return true },
		});
		
		var markerClusters = L.markerClusterGroup({ 
			animate : true,
			maxClusterRadius: 120,
			disableClusteringAtZoom: 10
			});
		markerClusters.addLayer(LastFireCent);
		return [0, LastFireArea, LastFireCent, markerClusters]
	}
	
// Any time there is a change to the variables, this can be called afterwards to update the layers on the map
// might need some kinks worked out where the layers might be redrawn in their original on/off state
//what it cant do right now is find out what layers are currently being displayed by the layer control and only turn those ones back on
	function legendUpdate() {
		mymap.removeLayer(LastFireCent);
		// mymap.removeLayer(FireBanDist);
		mymap.removeLayer(LastFireArea);
		mymap.removeLayer(markerClusters);
		

		// mymap.removeLayer(LastFireCent)
		mymap.removeLayer(FireBanDist);
		var maps = layerCalc();		
			LastFireCent = maps[2],
			LastFireArea = maps[1].addTo(mymap),
			markerClusters = maps[3].addTo(mymap);
		
		var overlayMaps = {
			"Fire Ban Districts": FireBanDist,
			"Last Fire Area": maps[1],
			"Last Fire Centroids": maps[2],
			"Marker Clusters": maps[3]
		};
		layersControl.remove(mymap);
		layersControl = L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(mymap);
	}

		
		
		
// Update the current slider value (each time you drag the slider handle)
// want this to update/redraw the map

	// output.innerHTML = slider.value; // Display the default slider value
	// slider.oninput = function() {
	//     output.innerHTML = this.value;
	// };
	

	
// Creating a chorpleth coloring where d is the number of fires
	function getColorA(d) {
		colour = ['#d73027','#f46d43','#fdae61','#fee090','#e0f3f8','#abd9e9','#74add1','#4575b4'].reverse();
	    return d > 1000 ? colour[7] :
	           d > 800  ? colour[6]  :
	           d > 600  ? colour[5]  :
	           d > 400  ? colour[4]  :
	           d > 300  ? colour[3]  :
	           d > 200  ? colour[2]  :
	           d > 100  ? colour[1]  :
	                      colour[0] ;

	}
	function getColorB(d) {
		colour = ['#f7f4f9','#e7e1ef','#d4b9da','#c994c7','#df65b0','#e7298a','#ce1256','#91003f'];
	    return d > 100000 ? colour[7] :
	           d > 80000  ? colour[6]  :
	           d > 60000  ? colour[5]  :
	           d > 40000  ? colour[4]  :
	           d > 30000  ? colour[3]  :
	           d > 20000  ? colour[2]  :
	           d > 10000  ? colour[1]  :
	                      colour[0] ;

	}
	function countStyle(feature) {
	    return {
	        fillColor: getColorA(feature.properties.Count_),
	        weight: 2,
	        opacity: 1,
	        color: 'white',
	        dashArray: '3',
	        fillOpacity: 0.5
	    };
	}
	function areaStyle(feature) {
	    return {
	        fillColor: getColorB(feature.properties.area_ha),
	        weight: 1,
	        opacity: 1,
	        color: 'black',
	        // dashArray: '3',
	        fillOpacity: 0.2
	    };
	}
// this function takes the key value pair properties of the geoJSON and binds a popup to the marker with those properties
	function onEachFeature(feature, layer) {
			if (feature.properties) {													//if feature properties exist
				layer.bindPopup(Object.keys(feature.properties).map(function(k) {		// "name" would be a key, "john" is a value (key value pairs)
					return k + ": " + feature.properties[k];							//joins the keys and mapped values with a ": " inbetween, 
				}).join("<br />"), 														//separates each iteration of "key: value" with a line br
				{maxHeight: 200}														//sets maxheight of icon to be 200px
				);
			}
			layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight, 
				click: zoomToFeature
			});
		}
		
	function highlightFeature(e) {
	    var layer = e.target;
	
	    layer.setStyle({
	        // weight: 5,
	        // color: '#666',
	        // dashArray: '',
	        fillOpacity: .7
	    });
	
	    // if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
	    //     layer.bringToFront();
	    // }
	    info.update(layer.feature.properties);
	}
	function resetHighlight(e) {
	    // geojson.resetStyle(e.target);
	    var layer = e.target;
	    //need to be wary of the icons
	    layer.setStyle({fillOpacity: 0.5});
	    info.update();
	    
	}
	function zoomToFeature(e) {
	    mymap.fitBounds(e.target.getBounds());
	}

	
// -------- I really need to keep the function defining and variables separat


	var mapboxAccessToken = 'pk.eyJ1IjoiYWtlYW5lIiwiYSI6ImNqbjhtaW5wMTFnY3ozdG1qdzIzaWtzbXMifQ.uRpuBKjptoz-b4cm7akDtQ',
		mapboxUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token='+mapboxAccessToken,
		mapboxAttribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

//a road map, terrain map, satellite map, l.grey map with labels, d.grey without labels
	var streets = L.tileLayer(mapboxUrl, {id: 'mapbox.streets', attribution: mapboxAttribution}),
		grayscale = L.tileLayer(mapboxUrl, {id: 'mapbox.light', attribution: mapboxAttribution}),
		satellite = L.tileLayer(mapboxUrl, {id: 'mapbox.satellite', attribution: mapboxAttribution}),
		terrain = L.tileLayer(mapboxUrl, {id: 'mapbox.outdoors', attribution: mapboxAttribution}),
		dgrey = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd'
		});
//Creating Map
	var mymap = L.map('mapid',{
		center: [-33.53, 136.77],
		zoom: 7,
		layers: [streets],
		maxBounds: (
			[-8, 110],
			[-45, 170]),
		minZoom: 7,
		maxZoom: 18
	});
//this layer is unaffected by the filtering so its left out
	var FireBanDist = new L.Shapefile('./data/Fire_Ban_districts.zip', {
		onEachFeature: onEachFeature,
		style: countStyle
	}).addTo(mymap);
	
	var fireIcon = L.icon({
		iconUrl: './assets/flame_red.svg',
		iconSize:     [25, 25]
		// iconAnchor:   [22, 94],
		// shadowAnchor: [4, 62],
		// popupAnchor:  [-3, -76]
	});
	var prescribedIcon = L.icon({
		iconUrl: './assets/flame_blue.svg',
		iconSize:     [25, 25]
		// iconAnchor:   [22, 94],
		// shadowAnchor: [4, 62],
		// popupAnchor:  [-3, -76]
	});
	
// Layer control
	var baseMaps = {
		"Streets":streets,
		"Terrain": terrain,
		"Satellite": satellite,
		"Grayscale": grayscale,
		"Dark Grey": dgrey
	};
	var maps = layerCalc(),
		LastFireCent = maps[2],
		LastFireArea = maps[1].addTo(mymap),
		markerClusters = maps[3].addTo(mymap);
	
	var overlayMaps = {
		"Fire Ban Districts": FireBanDist,
		"Last Fire Area": LastFireArea,
		"Last Fire Centroids": LastFireCent,
		"Marker Clusters": markerClusters
	};
	
//Map Interactivity
	var layersControl = L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(mymap);
	L.control.scale().addTo(mymap);
// Legend
	var legend = L.control({position: 'bottomright'});
		legend.onAdd = function (map) {
		    var div = L.DomUtil.create('div', 'legend'),
				counts = L.DomUtil.create('div', 'counts')
				area = L.DomUtil.create('div', 'counts')
		        grades1 = [0, 100, 200, 300, 400, 600, 800, 1000],
		        grades2 = [0, 10, 20, 30, 40, 60, 80, 100],
		        labels = [];

		    // loop through our density intervals and generate a label with a colored square for each interval
		    for (var i = 0; i < grades1.length; i++) {
		    	counts.innerHTML +=
		            '<i style="background:' + getColorA(grades1[i] + 1) + '"></i> ' +
		            grades1[i] + (grades1[i + 1] ? '&ndash;' + grades1[i + 1] + '<br>' : '+');
		    }
		    div.innerHTML += '<h3>Legend</h3><div class="counts"><h4>Fire Counts</h4>' + counts.innerHTML + '</div>';
		    for (var i = 0; i < grades2.length; i++) {
		        area.innerHTML +=
		            '<i style="background:' + getColorB(grades2[i]*1000 + 1) + '"></i> ' +
		            grades2[i] + (grades2[i + 1] ? '&ndash;' + grades2[i + 1] + '<br>' : '+');
		    }
		    div.innerHTML += '<div class="area"><h4>Fire Area<br>(x10<sup>3</sup> Ha)</h4>' + area.innerHTML + '</div>';
		    
		    return div;
		};
	legend.addTo(mymap);
	
//Mouse over events
	var info = L.control({position: 'bottomleft'});
	
	info.onAdd = function (map) {
	    this._div = L.DomUtil.create('div', 'legend'); // create a div with a class "info"
	    this.update();
	    return this._div;
	};
	
	// method that we will use to update the control based on feature properties passed
	info.update = function (props) {
	    if (props) {
			if (props.Burnt_Area) {
				 this._div.innerHTML = '<div class="info"><h3>Properties</h3>' + '<b> Fire Count: </b>' + props.Count_ +'<br /> <b> Burnt Area: </b>' +  props.Burnt_Area
			}
			else if (props.FIREYEAR) {
				this._div.innerHTML = '<div class="info"><h3>Properties</h3>' + '<br /> <b> Burn Type: </b>' +  props.INCIDENTTY + '<br /> <b> Area (Ha): </b>' 
			    		+ props.area_ha + '<br /> <b> Season: </b>' + props.SEASON + '<br /> <b> Date: </b>' + props.FIREDATE
			}
	    }
		else this._div.innerHTML = '<div class="info"><h3>Properties</h3>' + 'Hover over a feature</div>';
	};
	info.addTo(mymap);
		


//Slider
	// var sliderControl = L.control.sliderControl({position: "bottomleft", layer: LastFireCent});
	// //Make sure to add the slider to the map ;-)
	// mymap.addControl(sliderControl);
	// sliderControl.startSlider();