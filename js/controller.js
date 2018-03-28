(function(angular){
    'use strict';
    
    function myCtrl(AnnyangService,WeatherService,NewsService,$scope,$interval){
        /* $scope
        * view와 controller의 매개체 역할
        * controller을 통해 scope에 model과 function을 정의해두면 view가 그것을 사용한다.
        * function는 return 값으로 / 변수는 값으로 정의할수 있다.*/

        let _this= this;
        var command = COMMANDS.ko;  //index.html 에 command.js 추가
        var DEFAULT_COMMAND_TEXT = command.default;
        $scope.listening = false;
        $scope.debug = false;
        $scope.complement = command.hi;
        $scope.focus = "default";
        $scope.user = {};
        $scope.interimResult = DEFAULT_COMMAND_TEXT;

        // Reset the command text
        var restCommand = function(){
            $scope.interimResult = DEFAULT_COMMAND_TEXT;
        }

        _this.init=function(){

            restCommand();

            let refreshMirrorData =function() {
                //GeolocationService.init().then(function(){
                    WeatherService.init().then(function () {
                        $scope.currentForecast = WeatherService.currentForecast();
                    });
               // })
            }
            refreshMirrorData();
            $interval(refreshMirrorData,360000);



            let NewsData=function(){
                NewsService.init().then(function(){
                    $scope.currentNews=NewsService.topicNews();
                });
            }
            NewsData();


        }

        _this.init();
    }
    angular.module('myApp').controller('myCtrl',myCtrl);
    // 모듈.controller("컨트롤러명", constructor function)
    // constructor function 에 해당하는 함수는 html 에 ng-controller 지시어를 만나면 호출된다.

        
}(window.angular));


