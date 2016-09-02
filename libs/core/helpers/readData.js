var fs = require('fs'),
    path = require('path'),
    yaml = require('js-yaml');

var readData = function(dataPath) {
    var ext = path.extname(dataPath);
    if (ext === '.json') return JSON.parse(fs.readFileSync(dataPath));
    else if (ext === '.yml') return yaml.safeLoad(fs.readFileSync(dataPath, 'utf-8'));
};
module.exports.readData = readData;

var readAllData = function(dataPath) {
    var datas = fs.readdirSync(dataPath),
        dataObj = {};
    for (var i = 0; i < datas.length; i++) {
        var file = datas[i],
            ext = path.extname(file),
            base = path.basename(file).split('.')[0]; // remove extension
        if (ext === '.json' || ext === '.yml') {
            dataObj[base] = readData(dataPath + file);
        }
    }
    return dataObj;
};
module.exports.readAllData = readAllData;
