
var app = angular.module("MyApp", ['ngGeolocation','ui.router']);


app.config(function ($stateProvider, $urlRouterProvider) {

  var WeatherState = {
    name: "weather",
    url: "/weather",
    templateUrl: 'test.html',
    controller: "WeatherAppController"
  }

  var FavoritesState = {
    name: 'favorites',
    url: '/favorites',
    templateUrl: 'favorites.html',
    controller: "WeatherAppFavoritesController"
  }

  $stateProvider.state(WeatherState);
  $stateProvider.state(FavoritesState);

  //$urlRouterProvider.otherwise("/Weather");
/*
    $stateProvider.state('Weather', {
        //template: '<div id="state1"><p>Slide 1</p><a ui-sref="state2">State 2</a></div>',
        url: '/index.html',
        controller: "WeatherAppController"
    });

    $stateProvider.state('Favorites', {
        //template: '<div id="state2"><p>Slide 2</p><a ui-sref="state1">State 1</a></div>',
        url: '/favorites.html',
        controller: "WeatherAppFavoritesController"
    });

    // For any unmatched url, redirect to /state1
    //$urlRouterProvider.otherwise("/state1");*/
})

app.controller("WeatherAppController", function($scope , $http , $timeout , $window , $geolocation , $state , $location) {

  /**********Default Settings********/
  var LocationPartitions = $window.location.href.split('/');
  $scope.PageName = LocationPartitions[LocationPartitions.length-1].split('.')[0];
  $scope.UnitType = setUnit('C');
  $scope.FavIcon = "Favorites1.png";
  var Cities = [];
  var RedirectPartitions = $window.location.href.split('?');
  /**********Default Settings********/

  /*
  * Use Default location as Tel Aviv.
  */
  $scope.UseTelAvivAsDefault = function(){
    $scope.CurrentCityName = "Tel Aviv";
    $scope.CityDataKey = "215854";
    $scope.GetSelectedCityData($scope.CityDataKey);
    $scope.GetCurrentConditions($scope.CityDataKey);
    $scope.IsFavorite($scope.CityDataKey);
  }

  /*
  * Use Default location as Redirected.
  */
  $scope.UseRedirectedAsDefault = function(name,key){
    $scope.CurrentCityName = name;
    $scope.CityDataKey = key;
    $scope.GetSelectedCityData($scope.CityDataKey);
    $scope.GetCurrentConditions($scope.CityDataKey);
    $scope.IsFavorite($scope.CityDataKey);
  }

  /*
  * API call to get Default city based on Longtitute and Latitude.
  */
  $scope.GetDefaultCityData = function(Longtitude,Latitude){

    $http({
    method: 'GET',
    url: 'https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=A0p5TuY2E3ABtGcLIfWkWTYOGJo7NfcQ&q=' + Longtitude + '%2C'  + Latitude +'&language=en-Us&details=true&toplevel=true'
    }).then(function successCallback(response) {

      $scope.DefaultCityData = response.data;
      $scope.CurrentCityName = $scope.DefaultCityData.LocalizedName;
      $scope.CityDataKey = $scope.DefaultCityData.Key;
      $scope.GetSelectedCityData($scope.CityDataKey);
      $scope.GetCurrentConditions($scope.CityDataKey);
      $scope.IsFavorite($scope.CityDataKey);


    }, function errorCallback(response) {
       $scope.PushNotification("Error",response.error.message);
    });
  }

  /*
  * API call to get relevant city names results as you type.
  */
  $scope.GetOptionalCities = function(InputString){

    $http({
    method: 'GET',
    url: 'http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=A0p5TuY2E3ABtGcLIfWkWTYOGJo7NfcQ&q=' + InputString + '&language=en-Us'
    }).then(function successCallback(response) {

      var results = response.data;

      if(results.length == 0){
        $scope.PushNotification("Alert","No results found");
        return;
      }

      var TempCities = [];

      angular.forEach(results, function(Element) {
        var City = { label: Element.LocalizedName + ' (' + Element.Country.LocalizedName + ')' , value: Element };
        TempCities.push(City);
      });

      $("#tags").autocomplete({source: []});                     //Clear Source
      $("#tags").autocomplete("option", { source: TempCities }); //Update Autocomplete Source

    }, function errorCallback(response) {
       $scope.PushNotification("Error",response.error.message);
    });

  }


  /*
  * API call to get relevant city forecast on  city selected.
  */
  $scope.GetSelectedCityData = function(SelectedCityKey){

    $http({
    method: 'GET',
    url: 'http://dataservice.accuweather.com/forecasts/v1/daily/5day/'+ SelectedCityKey +'?apikey=A0p5TuY2E3ABtGcLIfWkWTYOGJo7NfcQ&language=en-Us&details=tru'
    }).then(function successCallback(response) {

      for (i = 0; i < response.data.DailyForecasts.length; i++) { //Fix numbers to use them for retrieving weather icons from accuweather
          var num = (response.data.DailyForecasts[i]).Day.Icon;
          var res = addZero(num);
          (response.data.DailyForecasts[i]).Day.Icon = res;
      }

      $scope.CurrentCityData = response.data;

      $('.LoaderBG').fadeOut(1000);

    }, function errorCallback(response) {
       $scope.PushNotification("Error",response.error.message);
    });
  }

  /*
  * API to get selected city conditions.
  */
  $scope.GetCurrentConditions = function(SelectedCityKey){

    $http({
    method: 'GET',
    url: 'http://dataservice.accuweather.com/currentconditions/v1/' + SelectedCityKey + '?apikey=A0p5TuY2E3ABtGcLIfWkWTYOGJo7NfcQ&language=en-Us&details=true'
    }).then(function successCallback(response) {

      var num = response.data[0].WeatherIcon;  //Fix numbers to use them for retrieving weather icons from accuweather
      var res = addZero(num);
      response.data[0].WeatherIcon = res;

      $scope.CurrentCityConditions = response.data[0];

    }, function errorCallback(response) {
       $scope.PushNotification("Error",response.error.message);
    });

  }

    $("#tags").autocomplete({
      minLength: 2,
      delay: 300,
      source: Cities,
      select: function(event,ui) { //On City Selected
          if(ui.item){
            $scope.CurrentCityName = ui.item.label;
            $scope.CityDataKey = ui.item.value.Key;
            $scope.GetSelectedCityData($scope.CityDataKey);
            $scope.GetCurrentConditions($scope.CityDataKey);
            $scope.IsFavorite($scope.CityDataKey);
            $(this).val('');
            return false;
          }
      },
      focus: function(event,ui) {
            //$(this).val('');
      }
    });


   $("#tags").keypress(function(){

        $timeout( function(){

            var Text = $("#tags").val();

            if(Text.length>1){
                var TestForEnglishLetters =  /^[a-zA-Z]+$/.test(Text);
                if(!TestForEnglishLetters){ //Not only English letters
                    $scope.PushNotification("Alert","Searching should be done in English letters only");
                }else{
                    $scope.GetOptionalCities(Text);
                }
            }

        }, 300 );

   });



   /*
   * Get the default state of Favorites Icon.
   */
   $scope.IsFavorite = function(CityKey){
      var res = IsFavorite(CityKey);
      if(res){
        $scope.FavIcon = "Favorites2.png";
      }else{
        $scope.FavIcon = "Favorites1.png";
      }
   }


   $scope.UnitTypeChange = function(){
      $scope.UnitType = toggleUnit();
   }


   $scope.AddToFavorites = function(){ // Tel Aviv or Geolocation or By Select
        setFavorite($scope.CurrentCityName,$scope.CityDataKey,$scope.CurrentCityConditions);
        $scope.IsFavorite($scope.CityDataKey);
   }

   $scope.PushNotification = function(Title,Body){
      $scope.Modaltitle = Title;
      $scope.ModalBody = Body;
      $("#exampleModalCenter").css("display", "block");
   }

   $(".close").click(function() {
     $("#exampleModalCenter").css("display", "none");
   });

   $(".modal").draggable();


   if(RedirectPartitions.length > 1){
      $scope.UseRedirectedAsDefault( decodeURI(RedirectPartitions[1]) , decodeURI(RedirectPartitions[2]) );
   }else{

      $geolocation.getCurrentPosition({
      timeout: 500
      }).then(function(position) {

               $scope.myPosition = position;
               var latitude = $scope.myPosition.coords.latitude;
               var longitude = $scope.myPosition.coords.longitude;
               $scope.GetDefaultCityData(latitude,longitude);

      }, function errorCallback(response) { //User Did no approve Geolocation , Default City is Tel Aviv
               $scope.UseTelAvivAsDefault();
      });

   }


});

app.controller("WeatherAppFavoritesController", function($scope , $http , $timeout , $window , $geolocation , $state) {

  var LocationPartitions = $window.location.href.split('/');
  $scope.PageName = LocationPartitions[LocationPartitions.length-1].split('.')[0];
  $scope.UnitType = setUnit('C');
  $scope.FavoritesArray = [];

  for(var i =0; i < localStorage.length; i++){ //Retrieve all Favorites
     var Key = localStorage.key(i);
     if(Key.includes("City")){
       var CityObject = JSON.parse(decodeURI( localStorage.getItem(localStorage.key(i)) ));
       $scope.FavoritesArray.push(CityObject);
     }
  }

  if($scope.FavoritesArray.length === 0){
     $(".NoFavorites").css("display", "block");
  }else{
     $(".NoFavorites").css("display", "none");
  }

  $scope.Navigate = function(name,key){
     $window.location.href = "index.html" + "?" + name + "?" + key;
  }

  $scope.UnitTypeChange = function(){
     $scope.UnitType = toggleUnit();
  }



});


var OpenNav = false;

function toggleNav() {
  OpenNav = !OpenNav;
  if(OpenNav){
   document.getElementById("mySidenav").style.width = "200px";
   document.getElementById("buttonsidenav").style.width = "230px";
 }else{
   document.getElementById("mySidenav").style.width = "0px";
   document.getElementById("buttonsidenav").style.width = "30px";
 }
}



function Notification(Title ,Body) {
    var scope = angular.element(document.getElementById('MainWrap')).scope();
    scope.PushNotification(Title,Body);
}

function addZero(number){
 if(number<10)
    return "0"+number;
 else
    return number;
}


app.filter('Round', function() {
    return function(input) {
        return Math.round(input);
    };
});


app.directive('backImg', function(){
    return function(scope, element, attrs){
        attrs.$observe('backImg', function(value) {
            element.css({
                'background-image': 'url(' + value +')',
                'background-size' : 'cover',
                'background-position' : 'center'
            });
        });
    };
});
