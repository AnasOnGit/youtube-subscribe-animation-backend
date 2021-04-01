const Jimp = require("jimp");

function resize(img, h, w, path, format) {
  // Jimp.read(img)
  //   .then((image) => {
  //     return image
  //       .resize(h, w) //(650, 130) // resize
  //       .write(`../process/image_manipulation/${path}.${format}`);
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //   });
    Jimp.read(img, function (err, image) {
        if (err) throw err;
        return image
        .resize(h, w) //(650, 130) // resize
        .write(`../process/image_manipulation/${path}.${format}`);
    });
}

module.exports = { resize };
