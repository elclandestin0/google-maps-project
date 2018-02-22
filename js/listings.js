// global variable array of names
var names = [];

// global variable array of addresses
var addresses = [];

// STEP 1: Id's of different categories, from foursquare.
var foodCategoryId = '4d4b7105d754a06374d81259';
var nightlifeCategoryId = '4d4b7105d754a06376d81259'

// Here, we create an array of category Id's to loop through and add through
// our models (via the number of API requests, 2 for now). STEP 2
var categoriesId = [foodCategoryId, nightlifeCategoryId];

// STEP 3: for loop for making URLs and requests for the 2 different categories
for (var i = 0; i < categoriesId.length; i++){
  var foursquareUrl = "https://api.foursquare.com/v2/venues/search";
  foursquareUrl += '?' + $.param({
    'client_id': FOURSQUARE_CLIENT_ID,
    'client_secret': FOURSQUARE_CLIENT_SECRET,
    'near':'montreal',
    'categoryId': categoriesId[i],
    'v':"20180101"
  });
  $.ajax({
    url: foursquareUrl,
    dataType: 'json',
         success: function(data){
           for (var j = 0; j < data.response.venues.length; j++){
             console.log(data);
            //  if (categoriesId[j] == foodCategoryId){
            //    console.log(j);
            //  }
            //  else if (categoriesId[j] == nightlifeCategoryId){
            //    console.log(j);
            //  }
           }
         }
  });

}


var Listing = function(data){
  this.name = ko.observable(data.name);
  this.phone = ko.observable(data.phone);
  this.address = ko.observable(data.address);
  this.url = ko.observable(data.url);
  this.photo = ko.observable(data.url);
}

// Our models will only make one API call, then it will store the data fetched
// into the different models.
var nightLifeListings = [{

}]

var ViewModel = function(){
  this.currentListing = ko.observable(new Listing({
    name: "first listing",
  }));
}

ko.applyBindings(ViewModel())
