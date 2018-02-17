(function(){
    'use strict';
// https 모듈과 같이 데이터 통신 역할을 하는 $http
    function forecast($http) {

        var service = {};
        service.forecast = null;

        service.init = function () {
            return $http.get('https://api.darksky.net/forecast/'+config.forecast.key+'/'+config.geolocation.latitude+','+config.geolocation.longitude)
                .then(function (response) {
                    return service.forecast = response;
                });
        }

        service.currentForecast = function () {
            if (service.forecast === null) {
                return  null;
            }
            service.forecast.data.currently.temperature = parseFloat((service.forecast.data.currently.temperature-32)/1.8).toFixed(1);
            service.forecast.data.currently.summary=service.forecast.data.currently.summary;
            service.forecast.data.currently.wi = "wi-forecast-io-" + service.forecast.data.currently.icon;

            return service.forecast.data.currently;
        }
        return service;
    }
    angular.module('myApp').factory('WeatherService',forecast);

}());
