const Jimp = require("jimp");
const { resize } = require("./resize");

function imageManipulation(channelId, banner, logo) {
  var content = Jimp.read(logo);
  var circle = Jimp.read("../process/image_manipulation/mask/icon-mask.png");
  Promise.all([content, circle]).then(function (images) {
    var mainPhoto = images[0];
    var mask = images[1];
    mainPhoto
      .mask(mask, 0, 0)
      .write(`../process/image_manipulation/icons/${channelId}.png`);
  });
  // resize banner
  resize(banner, 650, 130, `banner/${channelId}`, "jpg");
}

module.exports = { imageManipulation };
