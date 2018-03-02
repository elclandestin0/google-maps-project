// Initialize global variables here.
var map;
var markers = [];
// We initialize the client_id and client_secret of Foursquare as global
// variables to be used in the various scopes of this file.
var FOURSQUARE_CLIENT_ID = "IGSBB23NYXAIMP5CO1OVV4M3DSR5PFCMDYF5UAWHSRKK4AJH";
var FOURSQUARE_CLIENT_SECRET = "H3S03FQBEVV3YCRRORCQLG4TFKQYWM00POWVXAUQZCNVWGF3";

// We declare the category IDs here to be used in the various requests to the
// Foursquare API
var foodCategoryId = '4d4b7105d754a06374d81259';
var nightlifeCategoryId = '4d4b7105d754a06376d81259';
var gymCategoryId = "4bf58dd8d48988d175941735";

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
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "all",
                    "elementType": "labels.text.fill",
                    "stylers": [{
                        "color": "#ffffff"
                    }]
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
                            "weight": 1.0
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
    // The searchPlaces input text-box has a google places API autocomplete
    // functionality implemented to find all available areas in the text box.
    var searchPlaces = new google.maps.places.Autocomplete(
        document.getElementById('search-area')
    );
    // Here we define all the event listeners, clickable by the tagged
    // buttons.
    document.getElementById('search-area-go').addEventListener('click', function() {
        goToArea();
    });
    // for each icon, we add a click listener to filter searches into that
    // category
    document.getElementById('eat').addEventListener('click', function() {
        query(map, foodCategoryId);
    });
    document.getElementById('nightlife').addEventListener('click', function() {
        query(map, nightlifeCategoryId);
    });
    document.getElementById('gym').addEventListener('click', function() {
        query(map, gymCategoryId);
    });
    ko.applyBindings(ViewModel());
}

// We then tag the go-places button and add an eventListener to execute the
// goToArea() function.
function goToArea() {
    var geocoder = new google.maps.Geocoder();
    var address = document.getElementById('search-area').value;

    if (address === "") {
        window.alert("Please enter the address.");
    } else {
        geocoder.geocode({
            address: address
        }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
                map.setZoom(14);
                console.log("lat lng are: " + map.getCenter().lat() + ', ' + map.getCenter().lng());
            } else {
                window.alert('Could not find location, enter something more specific');
            }
        });
    }
}

// This is our listing model. It contains attributes such as name, address, and
// marker.
var Listing = function(data) {
    var self = this;
    this.name = ko.observable(data.name);
    this.address = ko.observable(data.address);
    this.marker = ko.observable();
};

var ViewModel = function() {
    var self = this;
    var infoWindow = new google.maps.InfoWindow();

    // For our initial data, we first construct the url from the Foursquare api,
    // which contains a HTTP GET request to the food category.
    var foursquareUrl = "https://api.foursquare.com/v2/venues/search";
    foursquareUrl += '?' + $.param({
        'client_id': FOURSQUARE_CLIENT_ID,
        'client_secret': FOURSQUARE_CLIENT_SECRET,
        'near': "montreal",
        'categoryId': foodCategoryId,
        'v': "20180302"
    });

    // Using the URL we just created, we send an AJAX request and attach it into
    // a JSON variable, if it's successful.
    initialFoodData = (function() {
        initialFoodData = null;
        $.ajax({
            'async': false,
            'global': true,
            'url': foursquareUrl,
            'dataType': "json",
            error: function(xhr, error){
                window.alert("Could not use Foursquare! Status is " +
                xhr.status+". Please refer to https://developer.foursquare.com/docs/api/troubleshooting/errors for more information");
            },
            'success': function(data) {
                initialFoodData = data;
                var initialFoodListings = initialFoodData.response.venues;
            }
        })
        return initialFoodData;
    })();
    //console.log(initialFoodData);
    self.list = ko.observableArray([]);
    infoWindow = new google.maps.InfoWindow();
    initialFoodListings.forEach(function(foodItem) {
        self.list().push(new Listing(foodItem));
        markers.push(marker = new google.maps.Marker({
          map: map,
          position: {lat: foodItem.location.lat, lng: foodItem.location.lng},
          animation: google.maps.Animation.DROP
        }));
        marker.addListener('click', function(){
          populateInfoWindow(foodItem, this, infoWindow);
        });
    });
    //console.log(self.list);
    if (self.list === null){
      window.alert("Data did not load! Please try again.");
    }
};

function removeMarkers(){
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}

function populateInfoWindow(item, marker, infoWindow){
  // if url is not found in the venue, display note on the bottom saying there
  // was no URL found. Else, set hyperlink of URL on the title of the venue.
  if (item.url === null){
    infoWindow.setContent('<div>' + item.name + '</div>' +
      '<div> Data powered by <a href="https://developer.foursquare.com/"><i class="fab fa-foursquare fa-1x"></i>oursquare</a></div>' +
      '<div><strong>Address:</strong> ' + item.location.address +'</div>' +
      '<div><strong>Note:</strong> no URL available from Foursquare. </div>');
    infoWindow.open(map, marker);
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){ marker.setAnimation(null); }, 1400);
  }
  else {
    infoWindow.setContent('<div><a href="'+item.url+'">' + item.name + '</a></div>' +
      '<div><strong>Address:</strong> ' + item.location.address +'</div>' +
      '<div> Data powered by <a href="https://developer.foursquare.com/"><i class="fab fa-foursquare fa-1x"></i>oursquare</a></div>');
    infoWindow.open(map, marker);
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){ marker.setAnimation(null); }, 1400);
  }
}


// this function queries for the model in the list. Each click of a button
// initializes a new API request and parses it onto the model.
function query(map, categoryId){
  var viewModel = new ViewModel();
  var infoWindow = new google.maps.InfoWindow();
  console.log("Querying...");
  var url = "https://api.foursquare.com/v2/venues/search";
  url += '?' + $.param({
      'client_id': FOURSQUARE_CLIENT_ID,
      'client_secret': FOURSQUARE_CLIENT_SECRET,
      'll': map.getCenter().lat() + ', ' + map.getCenter().lng(),
      'categoryId': categoryId,
      'v': "20180101"
  });


  // we store the jsonData of the queried category in a variable here.
  var jsonData = (function() {
      var jsonData = null;
      $.ajax({
          'async': false,
          'global': true,
          'url': url,
          'dataType': "json",
          'success': function(data) {
              jsonData = data;
          }
      });
      return jsonData;
  })();
  // we create a new list of the venues, based on our query
  var listings = jsonData.response.venues;
  if (listings.length === 0){
    window.alert("No listings found! Try changing the area.");
  } else {
    console.log("removing all data first, then repopulating");
    self.list.removeAll();
    removeMarkers();
    listings.forEach(function(item) {
      self.list.push(new Listing(item));
      markers.push(marker = new google.maps.Marker({
        map: map,
        position: {lat: item.location.lat, lng: item.location.lng},
        animation: google.maps.Animation.DROP
      }));
      marker.addListener('click', function(){
        populateInfoWindow(item, this, infoWindow);
      });
    });
  }
}
