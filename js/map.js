var map;
function initMap() {
    // Here, we create a new Maps instance from the Google Maps API and set the
    // center to Montreal
    map = new google.maps.Map(
        document.getElementById('map'), {
            center: {
                lat: 45.5017,
                lng: -73.5673
            },
            zoom: 11,
            // styles provided by: www.snazzymaps.com, name: Night commander
            styles: [{
    "featureType": "road",
    "elementType": "labels",
    "stylers": [
      { "visibility": "off" }
    ]
  },                {
                    "featureType": "all",
                    "elementType": "labels.text.fill",
                    "stylers": [{
                        "color": "#ffffff"
                    }
                  ]
                },
                {
                    "featureType": "all",
                    "elementType": "labels.text.stroke",
                    "stylers": [{
                            "color": "#000000"
                        },
                        {
                            "lightness": 13
                        }
                    ]
                },
                {
                    "featureType": "administrative",
                    "elementType": "geometry.fill",
                    "stylers": [{
                        "color": "#000000"
                    }]
                },
                {
                    "featureType": "administrative",
                    "elementType": "geometry.stroke",
                    "stylers": [{
                            "color": "#144b53"
                        },
                        {
                            "lightness": 14
                        },
                        {
                            "weight": 1.4
                        }
                    ]
                },
                {
                    "featureType": "landscape",
                    "elementType": "all",
                    "stylers": [{
                        "color": "#08304b"
                    }]
                },
                {
                    "featureType": "poi",
                    "elementType": "geometry",
                    "stylers": [{
                            "color": "#0c4152"
                        },
                        {
                            "lightness": 5
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry.fill",
                    "stylers": [{
                        "color": "#000000"
                    }]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry.stroke",
                    "stylers": [{
                            "color": "#0b434f"
                        },
                        {
                            "lightness": 25
                        }
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "geometry.fill",
                    "stylers": [{
                        "color": "#000000"
                    }]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "geometry.stroke",
                    "stylers": [{
                            "color": "#0b3d51"
                        },
                        {
                            "lightness": 16
                        }
                    ]
                },
                {
                    "featureType": "road.local",
                    "elementType": "geometry",
                    "stylers": [{
                        "color": "#000000"
                    }]
                },
                {
                    "featureType": "transit",
                    "elementType": "all",
                    "stylers": [{
                        "color": "#146474"
                    }]
                },
                {
                    "featureType": "water",
                    "elementType": "all",
                    "stylers": [{
                        "color": "#021019"
                    }]
                }
            ]

        });
        // Dead code for use later
        // var searchBox = new google.maps.places.SearchBox(
        //     document.getElementById('search-area'));
        // searchPlaces.bindTo('bounds', map);
        // Bias the searchbox to within the bounds of the map.
        // searchBox.setBounds(map.getBounds());
        // searchBox.bindTo('bounds', map);

        // Here, we create a variable that tags the search-area input in our respective
        // DOM.
        var searchPlaces = new google.maps.places.Autocomplete(
          document.getElementById('search-area')
        );
        document.getElementById('search-area-go').addEventListener('click', function(){
          goToArea();
        });
}



// We then tag the go-places button and add an eventListener to execute the
// goToArea() function.


function goToArea(){
  var geocoder = new google.maps.Geocoder();
  var address = document.getElementById('search-area').value;

  if (address == ""){
    window.alert("Please enter the address.");
  } else {
    geocoder.geocode(
      {
        address: address
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          map.setCenter(results[0].geometry.location);
          map.setZoom(13);
        } else {
          window.alert('Could not find location, enter something more specific');
        }
      }
    )};
  }
