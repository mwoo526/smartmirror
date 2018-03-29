(function(angular){
    'use strict';
    
    function myCtrl(AnnyangService,WeatherService,NewsService,$scope,$interval,$timeout){
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


            var defaultView = function() {
                console.debug("Ok, going to default view...");
                $scope.focus = "default";
            }

            // List commands
            AnnyangService.addCommand(command.whatcanisay, function() {
                console.debug("Here is a list of commands...");
                console.log(AnnyangService.commands);
                $scope.focus = "commands";

            });

            // Go back to default view
            AnnyangService.addCommand(command.home, defaultView);

            AnnyangService.addCommand(command.name, function(name) {
                console.debug("Hi", name, "nice to meet you");
                $scope.user.name = name;
            });

            // var defaultView ~  추가시 에러 x

            AnnyangService.addCommand(command.news,function(){
                NewsService.init().then(function(){
                    $scope.currentNews=NewsService.topicNews();
                });
            })


            var resetCommandTimeout;
            //Track when the Annyang is listening to us
            AnnyangService.start(function(listening){
                $scope.listening = listening;
            }, function(interimResult){
                $scope.interimResult = interimResult;
                $timeout.cancel(resetCommandTimeout);
            }, function(result){
                $scope.interimResult = result[0];
                resetCommandTimeout = $timeout(restCommand, 5000);
            });
            // var resetCommandTimeout ~  추가시 에러 x
        };

        _this.addResult = function(result) {
            _this.results.push({
                content: result,
                date: new Date()
            });
        };

        _this.clearResults = function() {
            _this.results = [];
        };

        _this.init();
    }
    angular.module('myApp').controller('myCtrl',myCtrl);
    // 모듈.controller("컨트롤러명", constructor function)
    // constructor function 에 해당하는 함수는 html 에 ng-controller 지시어를 만나면 호출된다.

        
}(window.angular));


