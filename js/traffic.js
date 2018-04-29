(function() {
    'use strict';

    function trafficService() {
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 10,
            center: {lat: 37.5985, lng: 126.9783}
        });

        var trafficLayer = new google.maps.TrafficLayer();
        trafficLayer.setMap(map);
        return map;
    }
    angular.module('myApp').factory('TrafficService',trafficService);

}());