(function(angular){
    'use strict';
    
    function myCtrl(WeatherService,$scope,$interval){
        /* $scope
        * view와 controller의 매개체 역할
        * controller을 통해 scope에 model과 function을 정의해두면 view가 그것을 사용한다.
        * 함수는 return 값으로 변수는 값으로 정의할수 있다.*/
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


