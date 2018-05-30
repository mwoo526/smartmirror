var fileToJsonParser = require('aws-sdk');
var resolve = require('resolve');

var path = resolve.sync('aws-sdk');
console.log("Path to module found:", path);

if (require.cache[path]){
    delete require.cache[path];
}