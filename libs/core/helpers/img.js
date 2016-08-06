module.exports.img = function(src, width, height, attr) {
    var heightStyle = !height ? '' : 'height: ' + height + 'px;',
        classAtrr = '',
        altAttr = '',
        heightAttr = '';
    if(attr && 'class' in attr){
        classAtrr = 'class="' + attr.class + '" ';
    };
    if(attr && 'alt' in attr){
        altAttr = 'alt="' + attr.alt + '" ';
    };
    if(attr && 'fixedHeight' in attr){
        heightAttr = 'height="' + height + '" ';
    };

    return '<img ' +
        classAtrr +
        'src="' + src + '"' +
        'style="width: ' + width + 'px; ' + heightStyle + '" ' +
        altAttr +
        heightAttr +
        '>';
};
