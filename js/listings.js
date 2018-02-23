// STEP 1: Id's of different categories, from foursquare.
var foodCategoryId = '4d4b7105d754a06374d81259';
var nightlifeCategoryId = '4d4b7105d754a06376d81259'

// Here, we create an array of category Id's to loop through and add through
// our models (via the number of API requests, 2 for now). STEP 2
var categoriesId = [foodCategoryId, nightlifeCategoryId];
var foodData;
// STEP 3: for loop for making URLs and requests for the 2 different categories
var foursquareUrl = "https://api.foursquare.com/v2/venues/search";
foursquareUrl += '?' + $.param({
  'client_id': FOURSQUARE_CLIENT_ID,
  'client_secret': FOURSQUARE_CLIENT_SECRET,
  'near':'montreal',
  'categoryId': nightlifeCategoryId,
  'v':"20180101"
  });

// we store the jsonData of the food in a variable here.
  var jsonData = (function () {
      var jsonData = null;
      $.ajax({
          'async': false,
          'global': true,
          'url': foursquareUrl,
          'dataType': "json",
          'success': function (data) {
              jsonData = data;
          }
      });
      return jsonData;
  })();

var Listing = function(data){
    this.name = ko.observable(data.name);
    this.address = ko.observable(data.address);
}

var foodListings = jsonData.response.venues;
  // {
  //   name: jsonData.response.venues[0].name,
  //   address: jsonData.response.venues[0].location.address
  // }

var ViewModel = function(){
  var self = this;
  this.foodList = ko.observableArray([]);

  foodListings.forEach(function(foodItem){
    self.foodList.push(new Listing(foodItem));
  })


}

ko.applyBindings(ViewModel())
