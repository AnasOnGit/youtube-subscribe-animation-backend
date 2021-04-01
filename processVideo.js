const ffmpeg = require("fluent-ffmpeg");
const template_pop_up = `./process/templates/pop_over/video/1060x469.mp4`;
const fs = require("fs")
const Jimp = require("jimp");
const { createCanvas, loadImage } = require("canvas");

function VideoProcessing(type, channelId, logo, channelName, banner, subscribers){
    function resize(img, h, w, path, format) {
          Jimp.read(img)
    .then((image) => {
      return image
        .resize(h, w) //(650, 130) // resize
        .write(`../process/image_manipulation/${path}.${format}`);
    })
    .catch((err) => {
      console.error(err);
    });
    }   
    var content = Jimp.read(logo);
    var circle = Jimp.read("./process/image_manipulation/mask/icon-mask.png");
    Promise.all([content, circle]).then(function (images) {
        var mainPhoto = images[0];
        var mask = images[1];
        mainPhoto
        .mask(mask, 0, 0)
        .write(`./process/image_manipulation/icons/${channelId}.png`);
    });
    // resize banner
    resize(banner, 650, 130, `banner/${channelId}`, "jpg");
    // canvas Image Munioulation
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
  loadImage(`./process/image_manipulation/icons/${channelId}.png`).then(
    (image) => {
      context.drawImage(image, 40, 0, 200, 200);
      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(
        `./process/image_manipulation/channel_info/${channelId}.png`,
        buffer
      );

      resize(
        `./process/image_manipulation/channel_info/${channelId}.png`,
        350,
        100,
        `channel_info/${channelId}`,
        "png"
      );
    }
  );


  //   const basePath = "./process/";
  const imgPath = `./process/image_manipulation/`;
  const Vidbanner = `${imgPath}banner/${channelId}.jpg`;
  const channelInfo = `${imgPath}channel_info/${channelId}.png`;
  const subAnimation = `./process/subscribe_animation/sub-animation.mp4`;
  // try {
    const command = ffmpeg(template_pop_up);
    command
      .input(Vidbanner)
      .input(channelInfo)
      .input(subAnimation)
      .complexFilter(
        [
          {
            filter: "overlay",
            options: {
              x: "0",
              y: "0",
            },
            inputs: "[0:v][1:v]",
            outputs: "tmp",
          },
          {
            filter: "overlay",
            options: {
              x: "10",
              y: "140",
            },
            inputs: "[tmp][2:v]",
            outputs: "tmp",
          },
          {
            filter: "overlay",
            options: {
              x: "510",
              y: "160",
              // x: "100",
              // y: "670",
            },
            inputs: "[tmp][3:v]",
            outputs: "tmp",
          },
        ],
        "tmp"
      )
      .output(`./process/rendered_video/pop_over/${channelId}.mp4`)
      .on("error", function (er) {
        console.log("error occured: " + er.message);
      })
      .on("end", function () {
        console.log("success");
      })

     .run()
}

module.exports = {VideoProcessing}