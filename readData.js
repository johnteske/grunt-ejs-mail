var fs = require('fs'),
    path = require('path'),
    yaml = require('js-yaml');

module.exports.readData = function (dataPath) {
    var ext = path.extname(dataPath);
    if (ext === '.json') return JSON.parse(fs.readFileSync(dataPath));
    else if (ext === '.yml') return yaml.safeLoad(fs.readFileSync(dataPath, 'utf-8'));
};
