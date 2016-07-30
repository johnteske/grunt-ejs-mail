var glob = require('glob'),
    path = require('path'),
    readData = require('./libs/core/helpers/readData.js')['readData'];

module.exports.loadLibraries = function (dataPath) {
    var libraries = {},
        libdata = glob.sync('libs/*/data.{json,yml}');
    libdata.forEach(
        function(dataPath) {
            var libname = dataPath.split('/')[1],
                thislib = {};

            // add data
            thislib.data = readData(dataPath);

            // load helpers
            var helpers = {},
                helperFiles = glob.sync('libs/' + libname + '/helpers/**/*.js');
            helperFiles.forEach(
                function(filePath) {
                    var basename = path.basename(filePath, '.js'),
                        helperPath = './' + filePath;
                    helpers[basename] = require(helperPath)[basename];
                }
            );
            thislib.helper = helpers;

            // add partial path, relative to project folders
            thislib.partials = '../../libs/' + libname + '/partials/';

            libraries[libname] = thislib;
        }
    );
    return libraries;
};
