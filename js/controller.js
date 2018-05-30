(function (angular) {
    'use strict';

    function myCtrl(AnnyangService,
                    ClockService,
                    WeatherService,
                    DustService,
                    GeolocationService,
                    MusicService,
                    NewsService,
                    GmailListService,
                    CalendarService,
                    TrafficService,
                    $scope, $interval, $timeout, $sce) {

        let _this = this;
        var command = COMMANDS.ko;
        var DEFAULT_COMMAND_TEXT = command.default;
        var functionService = FUNCTIONSERVICE;

        //길찾기 관련변수
        var directionsDisplay = new google.maps.DirectionsRenderer();
        var directionsService = new google.maps.DirectionsService();
        var geocoder = new google.maps.Geocoder();


        $scope.listening = false;
        $scope.complement = command.hi; //안녕 Zele!
        $scope.focus = "default"; //사용가능한 질문이라 말해보세요
        $scope.user = {};
        /*'사용 가능 한 질문'이라고 말해보세요.*/
        $scope.interimResult = DEFAULT_COMMAND_TEXT;
        $scope.destination = "목적지를말해주세요."

        $scope.map = {
            control: {},
            center: {
                latitude: 37.588442,
                longitude: 127.006197
            },
            zoom: 15
        };
        // marker object
        $scope.marker = {
            center: {
                latitude: 37.588442,
                longitude: 127.006197
            }
        }

        var restCommand = function () {
            $scope.interimResult = DEFAULT_COMMAND_TEXT;
        }

        //길찾기 정보
        var restDestination=function(){
                var request = {
                    origin: new google.maps.LatLng(37.588442, 127.006197),
                    destination: $scope.destination,
                    provideRouteAlternatives: true,
                    travelMode: eval("google.maps.DirectionsTravelMode.TRANSIT")
                };
                directionsService.route(request, function (response, status) {
                    if (status === google.maps.DirectionsStatus.OK) {
                        directionsDisplay.setDirections(response);
                        directionsDisplay.setMap($scope.map.control.getGMap());
                        directionsDisplay.setPanel(document.getElementById('directionsList'));
                        $scope.showList = true;

                    } else {
                        console.log('Goog9le route unsuccesfull!');
                    }
                });
        }

        var deleteModule=function(moduleName) {
            var resolve = require('resolve');
            var solvedName = require.resolve(moduleName),
                nodeModule = require.cache[solvedName];
            console.log(solvedName);
            if (nodeModule) {
                for (var i = 0; i < nodeModule.children.length; i++) {
                    var child = nodeModule.children[i];
                    deleteModule(child.filename);
                }
                delete require.cache[solvedName];
            }
        }

        var enabled = false; // A flag to know when start or stop the camera
        var WebCamera = require("webcamjs"); // Use require to add webcamjs

        var startwebcam= function() {

            return new Promise(function(resolve,reject) {
                if (!enabled) { // Start the camera !
                    enabled = true;
                    WebCamera.set({
                        width: 320,
                        height: 240
                    });
                    return resolve(WebCamera.attach('#camdemo'));
                    console.log("The camera has been started");
                } else { // Disable the camera !
                    enabled = false;
                    return reject(WebCamera.reset());
                    console.log("The camera has been disabled");
                }
            })

            // return WebCamera;
        }

//웹캠 관련 변수
        //var fs = require('fs');
        var options = {
            accessKeyId: "",
            secretAccessKey: "",
            region: ""
        };

        var filekeyname = "";
        var user = "";

//사용자 인식
        var image = function () {
            var AWS = require('aws-sdk');
            var s3 = new AWS.S3(options);
            var rekognition = new AWS.Rekognition(options);
            //$scope.focus = rekognition;
            console.log("rekognition button clicked");
            if(enabled) {
                WebCamera.snap(function (data_uri) {
                    var now = new Date();
                    filekeyname = now.getFullYear() + now.getMonth() + now.getDate() + "_" + now.getHours() + now.getMinutes() + now.getSeconds() + '.png';

                    var imageBuffer = processBase64Image(data_uri); //캡쳐 이미지 변환
                    var file = imageBuffer.data;

                    //캡처된 이미지를 S3에 업로드
                    var s3params = {
                        Bucket: "zele-sam",
                        Key: filekeyname,
                        Body: file
                    };
                    s3.upload(s3params, function (err, res) {
                        if (err) {
                            console.log("Error uploading data:", err);
                        } else {
                            console.log("Successfully uploaded data:", res);
                            var rekogparams = {
                                CollectionId: "zele-sam",
                                Image: {
                                    S3Object: {
                                        Bucket: "zele-sam",
                                        Name: filekeyname
                                    }
                                },
                                FaceMatchThreshold: 60.0,
                                MaxFaces: 5
                            };
                            //원래 저장된 사용자와 비교
                            rekognition.searchFacesByImage(rekogparams, function (err, data) {
                                if (err) {
                                    console.log(err, err.stack);
                                } else { //가장 일치율이 높은 데이터 추출
                                    for (var i = 0; i < data.FaceMatches.length - 1; i++) {
                                        for (var j = i; j < data.FaceMatches.length; j++) {
                                            if (data.FaceMatches[i].Similarity < data.FaceMatches[j].Similarity) {
                                                var a = {};
                                                a = data.FaceMatches[i];
                                                data.FaceMatches[i] = data.FaceMatches[j];
                                                data.FaceMatches[j] = a;
                                            }
                                        }
                                    }
                                    console.log(data.FaceMatches[0].Face.ExternalImageId);
                                    console.log(data.FaceMatches[0].Similarity);

                                    user = data.FaceMatches[0].Face.ExternalImageId;
                                    if (user == "mwoo1") {
                                        $scope.focus = "user";
                                        $scope.user.name = "민우";
                                        functionService.name($scope, $scope.user.name);
                                        var user = function () {
                                            $scope.message = GmailListService.minwooList();
                                            CalendarService.minwooInit().then(function (token) {
                                                $scope.calendar = CalendarService.list(token)
                                            })
                                        }
                                        user();
                                        $interval(user, 1000, 10);

                                    } else if (user == "seon1" || user == "seon2") {
                                        $scope.focus = "user";
                                        $scope.user.name = "종휘";
                                        functionService.name($scope, $scope.user.name);
                                        /*$scope.message = GmailListService.list();
                                        CalendarService.init().then(function (token) {
                                            $scope.calendar = CalendarService.list(token)
                                        })*/
                                    } else if (user == "yoonga1" || user == "yoonga2") {
                                        $scope.focus = "user";
                                        $scope.user.name = "가은";
                                        functionService.name($scope, $scope.user.name);
                                        var user = function () {
                                            $scope.message = GmailListService.gaeunList();
                                            CalendarService.gaeunInit().then(function (token) {
                                                $scope.calendar = CalendarService.list(token)
                                            })
                                        }
                                        user();
                                        $interval(user, 1000, 10);
                                    }

                                    //비교한 후 캡처된 사진 삭제
                                    var deleteparams = {
                                        Bucket: "zele-sam",
                                        Key: filekeyname
                                    };
                                    s3.deleteObject(deleteparams, function (err, data) {
                                        if (err) console.log(err, err.stack);
                                        else console.log(data);
                                    });
                                }
                            });
                        }
                    });
                });
            }
            else{
                console.log("Please enable the camera first to take the snapshot !");
            }
        };


        _this.init = function () {

            restCommand();

            // 시간
            let clockData = function () {
                $scope.clock = ClockService.printClock();
            }
            clockData();
            $interval(clockData, 1000);

            // 날씨
            let weatherData = function () {
                //GeolocationService.init().then(function(geo){
                WeatherService.init().then(function () {
                    $scope.currentForecast = WeatherService.currentForecast();
                    $scope.weekly = WeatherService.weeklyForecast();
                });
                // })
            }
            weatherData();
            $interval(weatherData, 360000);//날씨데이터 갱신

            // 미세먼지
            let dustData = function () {
                DustService.init().then(function () {
                    $scope.dust = DustService.dustForecast();
                });
            }
            dustData();
            $interval(dustData, 1000);


            var defaultView = function () {
                functionService.defaultHome($scope);//홈으로 이동
            }

            /*초기화면*/
            AnnyangService.addCommand(command.home, defaultView);
            /*SAM 켜기*/
            AnnyangService.addCommand(command.wake, function () {
                functionService.wake($scope);
            });
            /*사용가능한 질문*/
            AnnyangService.addCommand(command.whatcanisay, function () {
                deleteModule("aws-sdk")
                functionService.whatCanISay($scope);
            });
            /*인사*/
            AnnyangService.addCommand(command.name, function (name) {
                console.debug("Hi", name, "nice to meet you");
                $scope.user.name = name;
                functionService.name($scope, $scope.user.name);
            });
            /*주간 날씨*/
            AnnyangService.addCommand(command.weather, function () {
                functionService.weather($scope, WeatherService, DustService);
            });

            /*뉴스기사*/
            AnnyangService.addCommand(command.news, function () {
                functionService.news($scope, NewsService);
            })
            /*영상 재생*/
            AnnyangService.addCommand(command.playvideo, function (term) {
                functionService.music($scope, $sce, MusicService, term);
            })
            AnnyangService.addCommand(command.playmusic, function (term) {
                functionService.music($scope, $sce, MusicService, term);
            })
            /*영상 정지*/
            AnnyangService.addCommand(command.stopyoutube, function () {
                functionService.stopyoutube($scope);
            });
            /*SAM 끄기*/
            AnnyangService.addCommand(command.sleep, function () {
                console.debug("Ok, going to sleep...");
                $scope.focus = "sleep";
            });
            /*일상 대화*/
            AnnyangService.addCommand(command.name, function (name) {//나는 00야
                $scope.user.name = name;
                functionService.name($scope, $scope.user.name);
            });
            /*길 찾 기*/
            AnnyangService.addCommand(command.direction,function(){
                AnnyangService.start(function (listening) {
                    $scope.listening = listening;
                }, function (destination) {
                    $scope.destination = destination;
                    $timeout.cancel(restDestinationout);
                }, function (result) {
                    $scope.destination = result[0];
                    $timeout(restDestination, 1000);
                    restDestinationout=$timeout($scope.destination,5000)
                });
                if (responsiveVoice.voiceSupport()) {
                    responsiveVoice.speak("길찾기입니다.", "Korean Female");
                }
                $scope.focus="direction"
            })
            /*교통편*/
            AnnyangService.addCommand(command.traffic,function(){
                if (responsiveVoice.voiceSupport()) {
                    responsiveVoice.speak("교통편입니다.", "Korean Female");
                }
                var traffic=function() {
                    functionService.traffic($scope, TrafficService)
                }
                traffic();
                $interval(traffic,1000,10);
            })

            /*사용자 정보 화면*/
            AnnyangService.addCommand(command.webcam, function () { //사용자 인식

                $scope.focus = "webcam";
                //$scope.camdemo = WebcamService;
                startwebcam().then(function () {
                    //$scope.camdemo = startwebcam();
                    $timeout(image, 3000);
                    $timeout(console.log("Test!!!!!!!!!!!!!!!!!1"),5000);
                })

               /* var resolve = require('resolve');

                var path = resolve.sync('aws-sdk');
                console.log("Path to module found:", path);

                if (require.cache[path]){
                    console.log("HI!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1")
                    delete require.cache[path];
                }*/
                //$timeout(WebCamera.reset,5000);
            });


            var resetCommandTimeout;
            var restDestinationout;
            //Track when the Annyang is listening to us

            AnnyangService.start(function (listening) {
                $scope.listening = listening;
            }, function (interimResult) {
                $scope.interimResult = interimResult;
                $timeout.cancel(resetCommandTimeout);
            }, function (result) {
                $scope.interimResult = result[0];
                resetCommandTimeout = $timeout(restCommand, 5000);
            });
            //

        };

        _this.clearResults = function () {
            _this.results = [];
        };

        _this.init();
    }

    angular.module('myApp').controller('myCtrl', myCtrl);

}(window.angular));