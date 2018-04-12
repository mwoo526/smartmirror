var FUNCTIONSERVICE ={

    defaultHome : function($scope){
        console.debug("Ok, going to default view...");
        if(responsiveVoice.voiceSupport()){
            responsiveVoice.speak("홈으로 이동할께요","Korean Female");
        }
        $scope.focus = "default";
    },

    wake : function($scope) {
        console.debug("Wake up...");
        if(responsiveVoice.voiceSupport()) {
            responsiveVoice.speak("좋은 아침이에요 주인님!","Korean Female");
        }
        $scope.focus = "default";
    },

    whatCanISay : function($scope){
        console.debug("Here is a list of commands...");
        if(responsiveVoice.voiceSupport()) {
            responsiveVoice.speak("사용가능한 메뉴를 보여줄께요.","Korean Female");
        }
        $scope.focus = "commands";
    },

    name : function($scope,name){
        console.debug("Hi", name, "nice to meet you");
        if(responsiveVoice.voiceSupport()) {
            responsiveVoice.speak("반가워요"+name+"님! 저는 SAM이라고 해요!","Korean Female");
        }
        $scope.focus="name";
    },

    weather : function($scope,WeatherService){
        WeatherService.init().then(function () {
            $scope.weekly = WeatherService.weeklyForecast();
            $scope.focus="weather";
        });
        if(responsiveVoice.voiceSupport()) {
            responsiveVoice.speak("일주일간 날씨에요","Korean Female");
        }
    },

    news : function($scope,NewsService){
        NewsService.init().then(function(){
            $scope.currentNews=NewsService.topicNews();
            $scope.focus="news";
        });
        if(responsiveVoice.voiceSupport()) {
            responsiveVoice.speak("현재 Topic 뉴스기사에요","Korean Female");
        }
    },

    music : function($scope,$sce,MusicService,term){
        MusicService.init(term).then(function () {
            // ex) 원더케이
            $scope.focus="music";
            $scope.getVideoId = MusicService.getVideoId();
            $scope.youtubeurl = "http://www.youtube.com/embed/"+$scope.getVideoId+"?autoplay=1&enablejsapi=1&version=3";
            $scope.currentYoutubeUrl = $sce.trustAsResourceUrl($scope.youtubeurl);
        });
    },

    stopyoutube : function($scope){
        var iframe = document.getElementsByTagName("iframe")[0].contentWindow;
        iframe.postMessage('{"event":"command","func":"' + 'stopVideo' +   '","args":""}', '*');
        $scope.focus = "default";

        if(responsiveVoice.voiceSupport()) {
            responsiveVoice.speak("유튜브 영상을 종료할께요","Korean Female");
        }
    }


}