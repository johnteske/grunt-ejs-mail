var url_utm = require('./url_utm.js')['url_utm'];
module.exports.link = function (text, url, source, campaign, customClass) {
    source = production ? data.utm_source : 'EMAILNAME'; // redundant, matches url_utm
    var thisClass = customClass ? customClass : '';
    if(!campaign) {
        campaign = text;
    } else if(campaign === 'null') {
        campaign = undefined; // do not track if specified
    }
    return '<a href="' + url_utm(url, source, campaign) + '" class="' + thisClass + '"><span class="link ' + thisClass + '">' + text + '</span></a>';
};
