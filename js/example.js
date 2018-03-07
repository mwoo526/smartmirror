var https=require('https');

https.get('https://newsapi.org/v2/top-headlines?country=kr&apiKey=736741bd63f14dbfb02b02e8eedf662e',function(res){
    res.setEncoding('utf8');
    res.on('data',function(chunk){
        console.log(chunk);
    })
}).end()
