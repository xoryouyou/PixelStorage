function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getPixels(columns, rows) {
    var values = new Uint32Array(columns * rows).fill(0);
    for (var i = 0; i < columns * rows; i++) {
        var r = getRandomInt(0, 255);
        var g = getRandomInt(0, 255);
        var b = getRandomInt(0, 255);
        var value = packBytes(r, g, b, 0xFF);
        values[i] = value;
    }
    return values;
}

function hex2rgba(hex) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);

    return packBytes(r, g, b, 0xFF)
}

function unpackBytes(num) {
    var arr = new Uint8Array([
        (num & 0xff000000) >> 24,
        (num & 0x00ff0000) >> 16,
        (num & 0x0000ff00) >> 8,
        (num & 0x000000ff)
    ]);

    var view = new DataView(arr.buffer);
    return [
        view.getUint8(0),
        view.getUint8(1),
        view.getUint8(2),
        view.getUint8(3)
    ];
}

function packBytes(r, g, b, a) {
    return r << 24 | g << 16 | b << 8 | a
}


module.exports.getPixels = getPixels;
module.exports.getRandomInt = getRandomInt;
module.exports.hex2rgba = hex2rgba;
module.exports.unpackBytes = unpackBytes;
module.exports.packBytes = packBytes;