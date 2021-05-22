let map;
const boston = {lat:42.353350,lng:-71.091525};
var markers = [];
var wayPoints = [];


function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: boston,
        mapTypeId : google.maps.MapTypeId.ROADMAP,
        zoom: 14,
      });
	
	  const flightPlanCoordinates = [
		{ lat: 37.772, lng: -122.214 },
		{ lat: 21.291, lng: -157.821 },
		{ lat: -18.142, lng: 178.431 },
		{ lat: -27.467, lng: 153.027 },
	  ];
	  const flightPath = new google.maps.Polyline({
		path: wayPoints,
		geodesic: true,
		strokeColor: "#FF0000",
		strokeOpacity: 1.0,
		strokeWeight: 2,
	  });
	  flightPath.setMap(map);
  	addMarkers();
	

}

async function addMarkers(){
	// get bus data
	var locations = await getBusLocations();

	// loop through data, add bus markers
	locations.forEach(function(bus){
		var marker = getMarker(bus.id);		
		if (marker){
			moveMarker(marker,bus);
		}
		else{
			addMarker(bus);			
		}
	});

	// timer
	console.log(new Date());
	setTimeout(addMarkers,15000);

}


async function getBusLocations(){
	var url = 'https://api-v3.mbta.com/vehicles?api_key=ca34f7b7ac8a445287cab52fb451030a&filter[route]=47&include=trip';	
	var response = await fetch(url);
	var json     = await response.json();
	return json.data;
	
}

async function getStops() {
	var url = 'https://api-v3.mbta.com/stops?api_key=ca34f7b7ac8a445287cab52fb451030a&filter[route]=47';	
	var response = await fetch(url);
	var arr = await response.json();
	var data = arr.data;
	for(let i = 0; data.length > i; i++) {
		// var lat = "lat: "+ (data[i].attributes.latitude);
		// var lng = "lng: " + (data[i].attributes.longitude);
		var lat = data[i].attributes.latitude;
		var lng = data[i].attributes.longitude;
		var latLng = lat +", " + lng;
		wayPoints.push(latLng);
	}
		
		
	console.log(wayPoints);

	const routeLines = new google.maps.Polyline({
		path: wayPoints, 
		geodesic: true,
		strokeColor: "#FF0000",
		strokeOpacity: 1.0,
		strokeWeight: 2,
	});

	routeLines.setMap(map);

}





function addMarker(bus){
	var icon = getIcon(bus);
	var marker = new google.maps.Marker({
	    position: {
	    	lat: bus.attributes.latitude, 
	    	lng: bus.attributes.longitude
	    },
	    map: map,
	    icon: icon,
	    id: bus.id
	});
	markers.push(marker);
}

function getIcon(bus){
	// select icon based on bus direction
	if (bus.attributes.direction_id === 0) {
		return 'red.png';
	}
	return 'blue.png';	
}

function moveMarker(marker,bus) {
	// change icon if bus has changed direction
	var icon = getIcon(bus);
	marker.setIcon(icon);

	// move icon to new lat/lon
    marker.setPosition( {
    	lat: bus.attributes.latitude, 
    	lng: bus.attributes.longitude
	});
}

function getMarker(id){
	var marker = markers.find(function(item){
		return item.id === id;
	});
	return marker;
}

getStops();