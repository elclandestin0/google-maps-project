var map;
function initMap() {
  // Here, we create a new Maps instance from the Google Maps API
  map = new google.maps.Map(
    document.getElementById('map'), {
    center: {lat: 45.5017, lng: -73.5673},
    zoom: 13
  });
}
