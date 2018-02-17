(function(angular){
    'use strict';
    
    function myCtrl(WeatherService,$scope,$interval){
        var data="테스팅";
        $scope.data=data;

        var _this= this;

        _this.init=function(){
            var refreshMirrorData =function() {
                WeatherService.init().then(function () {
                    $scope.currentForecast = WeatherService.currentForecast();
                });
            }

            refreshMirrorData();
            $interval(refreshMirrorData,1000);
        }
        _this.init();
    }
    angular.module('myApp').controller('myCtrl',myCtrl);
        
}(window.angular));


