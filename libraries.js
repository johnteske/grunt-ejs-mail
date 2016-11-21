var glob = require('glob'),
    readData = require('./libs/core/helpers/readData.js')['readData'];

module.exports.loadLibraries = function() {
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
                helperFiles = glob.sync('./libs/' + libname + '/helpers/**/*.js');
            helperFiles.forEach(
                function(helperPath) {
                    var thishelper = require(helperPath);
                    for (var helper in thishelper) {
                        helpers[helper] = thishelper[helper];
                    }
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
