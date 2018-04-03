(function(angular){
    'use strict';

    function myCtrl(AnnyangService,MusicService,GeolocationService,WeatherService,NewsService,$scope,$interval,$timeout,$sce){

        let _this= this;
        var command = COMMANDS.ko;
        var DEFAULT_COMMAND_TEXT = command.default;
        var functionService = FUNCTIONSERVICE;
        $scope.listening = false;
        $scope.complement = command.hi;
        $scope.focus = "default";
        $scope.user = {};
        /*'사용 가능 한 질문'이라고 말해보세요.*/
        $scope.interimResult = DEFAULT_COMMAND_TEXT;

        var restCommand = function(){
            $scope.interimResult = DEFAULT_COMMAND_TEXT;
        }

        _this.init=function(){

            restCommand();

            let refreshMirrorData =function() {
                GeolocationService.init().then(function(geo){
                    WeatherService.init(geo).then(function () {
                        $scope.currentForecast = WeatherService.currentForecast();
                    });
                })
            }
            refreshMirrorData();
            $interval(refreshMirrorData,360000);

            var defaultView = function() {
                functionService.defaultHome($scope);
            }

            /*초기화면*/
            AnnyangService.addCommand(command.home, defaultView);
            /*SAM 켜기*/
            AnnyangService.addCommand(command.wake, function(){
                functionService.wake($scope);
            });
            /*사용가능한 질문*/
            AnnyangService.addCommand(command.whatcanisay, function() {
                functionService.whatCanISay($scope);
            });
            /*인사*/
            AnnyangService.addCommand(command.name, function(name) {
                console.debug("Hi", name, "nice to meet you");
                $scope.user.name = name;
                functionService.name($scope,$scope.user.name);
            });
            /*뉴스 기사*/
            AnnyangService.addCommand(command.news,function(){
               functionService.news($scope,NewsService);
            })
            /*영상 재생*/
            AnnyangService.addCommand(command.music,function(term){
                functionService.music($scope,$sce,MusicService,term);
            })
            /*영상 정지*/
            AnnyangService.addCommand(command.stopyoutube, function() {
                functionService.stopyoutube($scope);
            });
            /*SAM 끄기*/
            AnnyangService.addCommand(command.sleep, function() {
                console.debug("Ok, going to sleep...");
                $scope.focus = "sleep";
            });

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
        };

        _this.clearResults = function() {
            _this.results = [];
        };

        _this.init();
    }
    angular.module('myApp').controller('myCtrl',myCtrl);

}(window.angular));


