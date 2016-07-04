module.exports.url_utm = function (url, campaign) {
    var tag = '';
    var source = data.utm_source;
    
    if(typeof campaign !== 'undefined'){
        tag = '?utm_source=' + source + '&utm_medium=email&utm_campaign=' +
            campaign
                .replace(/-|,| /g, "+") // convert dashes, commas, spaces to '+'
                .replace(/<[^>]+>/g,"+") // also remove HTML, such as <br> tags
                .replace(/[^\w\s+]/g,"") // remove nonword characters that are not spaces (but keep '+' and '_')
                .replace(/[+]{2,}/g,"+") // only use a single '+' in the case of multiples
                .replace(/[+]$/,"") // do not allow trailing '+''
            ;
    }

    return url + tag;
};
