(function(){
    'use strict';

    function forecast($http) {
        //var weatherdata="null";

        var service = {};
        //var data={};
        service.forecast = null;

        service.init = function () {
            return $http.get('https://api.darksky.net/forecast/a21a1a7167d9ed291cded7f6fd503e01/37.541,126.986')
                .then(function (response) {
                   /* data=JSON.parse(response);*/
                    return service.forecast = response;
                });
        }

        service.currentForecast = function () {
            if (service.forecast === null) {
                return  null;
            }
            service.forecast.data.currently.temperature = parseFloat((service.forecast.data.currently.temperature-32)/108).toFixed(1);
            service.forecast.data.currently.summary=service.forecast.data.currently.summary;
            service.forecast.data.currently.wi = "wi-forecast-io-" + service.forecast.data.currently.icon;

            return service.forecast.data.currently;
        }
        return service;
    }
    angular.module('myApp').factory('WeatherService',forecast);

}());


            /*https.get("https://api.darksky.net/forecast/a21a1a7167d9ed291cded7f6fd503e01/37.541,126.986", function (response) {
               var info = "";
               response.on("data", function (chunk) {
                   console.log("1"+info);
                   info += chunk;
                   console.log("2"+info);
               });

                response.on("end", function result() {
                   if (response.statusCode === 200) {
                       try {
                           var data = JSON.parse(info);
                           console.log("3"+data);
                           weatherdata = "Weather is " + data.currently.summary + " in " + data.timezone + ".";
                           console.log("4"+weatherdata);
                       } catch (error) {
                           console.log("Sorry something went wrong");
                       }
                   } else {
                       console.log("Sorry");
                   }
                   console.log("5"+weatherdata);
               });

               console.log("6"+weatherdata);
           });
           console.log("7"+weatherdata);*/



