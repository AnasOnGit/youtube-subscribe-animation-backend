const { createCanvas, loadImage } = require("canvas");
const { imageManipulation } = require("./image_manipulation");
const fs = require("fs");
const { resize } = require("./resize");

function canvasImageManipulation(
  channelId,
  banner,
  logo,
  channelName,
  subscribers
) {
  imageManipulation(channelId, banner, logo);
  // resizing logo
  // canvas width and height
  const width = 900;
  const height = 249;

  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  context.fillStyle = "#fff";
  context.fillRect(0, 0, width, height);

  // channelName
  const name = channelName;

  const textWidth = context.measureText(name).width;
  context.font = "35pt Menlo";
  context.fillStyle = "#000";
  context.fillText(name, 260, 130);

  // subscribers
  const subscriber = `${subscribers} Subscribers`;
  context.fillStyle = "#606060";
  context.font = "20pt Menlo";
  context.fillText(subscriber, 260, 160);
  // logo
  loadImage(`../process/image_manipulation/icons/${channelId}.png`).then(
    (image) => {
      context.drawImage(image, 40, 0, 200, 200);
      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(
        `../process/image_manipulation/channel_info/${channelId}.png`,
        buffer
      );

      resize(
        `../process/image_manipulation/channel_info/${channelId}.png`,
        350,
        100,
        `channel_info/${channelId}`,
        "png"
      );
    }
  );
}
module.exports = { canvasImageManipulation };
