var fs = require('fs'),
    gm = require('gm');

// resize and remove EXIF profile data
gm(__dirname + '/static/img/1.jpg')
    .resize(100, 100)
    .noProfile()
    .write(__dirname + '/static/img/1111.jpg', function(err) {
        if (!err) console.log('done');
    });