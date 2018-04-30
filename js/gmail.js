(function () {

    var fs = require('fs');
    var {google} = require('googleapis');
    var googleAuth = require('google-auth-library');
    var TOKEN_PATH = './gmail_file/minwoo_Gmail_Token.json';

    function gmail() {
        let service = {};
        service.gmail=null;

        service.init= function() {
             /*fs.readFile('./gmail_file/client_secret.json', function processClientSecrets(err, content) {
                if (err) {
                    console.log('Error loading client secret file: ' + err);
                    return;
                }

            });*/
            //authorize(JSON.parse(content));
            return service.gmail=JSON.parse(fs.readFileSync('./gmail_file/client_secret.json','utf8'));
            /*console.log(JSON.parse(content));
            return service.gmail = JSON.parse(content);*/
        }

        service.authorize=function(){

            var credentials=JSON.parse(fs.readFileSync('./gmail_file/client_secret.json','utf8'));
            var clientSecret = credentials.installed.client_secret;
            var clientId = credentials.installed.client_id;
            var redirectUrl = credentials.installed.redirect_uris[0];
            var auth = new googleAuth();
            var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
            var gmail = google.gmail('v1');

            /*return fs.readFile(TOKEN_PATH, function (err, token) {
                if (err) {
                    console.log("토큰이 필요하다는 에러")
                } else {
                    oauth2Client.credentials = JSON.parse(token);
                    //litMessages(oauth2Client);
                    return service.gmail.token = oauth2Client;
                }
            });*/
            var token = fs.readFileSync(TOKEN_PATH, 'utf8')
            oauth2Client.credentials=JSON.parse(token)

            gmail.users.messages.list({
                //auth: service.gmail_file.token,
                auth: oauth2Client,
                userId: 'me',
                maxResults: 1
            }, function (err, response) {
                //console.log(response.messages);
                for (let i = 0; i < 3; i++) {
                    let Id = response.messages[i].id;
                    gmail.users.messages.get({
                        auth: oauth2Client,
                        userId: 'me',
                        id: Id,
                        format: 'raw'
                    }, (err, rawMail) => {
                        if(err) return err;
                        service.gmail= rawMail.snippet;
                    })
                }
            })
            return service.gmail;
        }

        service.listmessge=function(token){

        }
        return service;
    }
    angular.module('myApp').factory('GmailService',gmail);
}());