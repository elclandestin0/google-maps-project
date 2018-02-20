var ViewModel = function(){
  this.currentListing = ko.observable(new Listing({
    name: "first listing",
  }));
}

var Listing = function(data){
  this.name = ko.observable(data.name);
}

ko.applyBindings(ViewModel())
