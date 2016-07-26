module.exports.img = function(src, width, height, customClass, alt) {
    var heightStyle = !height ? '' : 'height: ' + height + 'px;',
        classAttr = !customClass ? '' : 'class="' + customClass + '"',
        altAttr = !alt ? '' : altAttr = 'alt="' + alt + '"';
    // option to add height attr for select images
    return '<img ' + classAttr + ' style="width: ' + width + 'px; ' + heightStyle + '" src="' + src + '" ' + altAttr + '>';
};
