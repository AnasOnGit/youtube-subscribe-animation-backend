var ffmpeg = require("fluent-ffmpeg");
const Jimp = require("jimp");
const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
var videoshow = require("videoshow");
// define
// const template = "./process/templates/pop_over/1280x750.mp4";
const template_pop_up = `./process/templates/pop_over/video/1060x469.mp4`;
// const banner =
//   "https://yt3.ggpht.com/qFvUd2J46ZNZfXPkV5b-dOsQkZms2LWolfvOUzcbzE-vFv4hhySa5YuNQPfZSDvkA--vNeqh1w=w1060-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj";
// const logo =
//   "https://yt3.ggpht.com/a/AATXAJwBQTLGE-faPEMd8jfTioJ-z6N89ZZZ3kIs-audvw=s240-c-k-c0xffffffff-no-rj-mo";
// let channelId = "UC5RRWuMJu7yP1DQwnW_nAvA";
// let channelName = "Innocent Droid Official";
// let logoPath = `./process/image_manipulation/icons/${channelId}.png`;
// const infoPath = `./process/image_manipulation/channel_info/${channelId}.png`;

// methods
// image resizing method
function resize(img, h, w, path, format) {
  Jimp.read(img)
    .then((image) => {
      return image
        .resize(h, w) //(650, 130) // resize
        .write(`./process/image_manipulation/${path}.${format}`);
    })
    .catch((err) => {
      console.error(err);
    });
}
function imageManipulation(channelId, banner, logo) {
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
}

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
}
function renderVideo(channelId) {
  const command = ffmpeg(template_pop_up);
  command
    .input(`./process/image_manipulation/banner/${channelId}.jpg`)
    .input(`./process/image_manipulation/channel_info/${channelId}.png`)
    .input("./process/subscribe_animation/pop-subscribe-animation.mp4")
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

    .run();
}

function createTempalte(size) {
  var images = [`./process/templates/pop_over/background/${size}.jpg`];

  var videoOptions = {
    fps: 30,
    loop: 10, // seconds
    transition: false,
    // transitionDuration: 0, // seconds
    videoBitrate: 1024,
    videoCodec: "libx264",
    size: "640x?",
    audioBitrate: "128k",
    audioChannels: 2,
    format: "mp4",
    pixelFormat: "yuv420p",
  };

  videoshow(images, videoOptions)
    .save(`./process/templates/pop_over/video/${size}.mp4`)
    .on("start", function (command) {
      console.log("ffmpeg process started:", command);
    })
    .on("error", function (err, stdout, stderr) {
      console.error("Error:", err);
      console.error("ffmpeg stderr:", stderr);
    })
    .on("end", function (output) {
      console.error("Video created in:", output);
    });
}

// function createVideo(channelId, logo, channelName, banner) {
// createTempalte(1060x469);
//   canvasImageManipulation(channelId, banner, logo, channel);
//   renderVideo(channelId);
// }

module.exports = {
  createVideo: function (
    type,
    channelId,
    logo,
    channelName,
    banner,
    subscribers
  ) {
    // createTempalte("1060x469");
    canvasImageManipulation(channelId, banner, logo, channelName, subscribers);
    renderVideo(channelId);
    return `process/rendered_video/pop_over/${channelId}.mp4`;
  },
};
