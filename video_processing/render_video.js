const ffmpeg = require("fluent-ffmpeg");
const template_pop_up = `./1060x469.mp4`;
const fs = require("fs");
// const { createInfo } = require("./export_video");

function renderVideo(channelId) {
  const basePath = __dirname + "/../process/";
  //   const basePath = "../process/";
  const imgPath = `${basePath}image_manipulation/`;
  const banner = `${imgPath}banner/${channelId}.jpg`;
  const channelInfo = `${imgPath}channel_info/${channelId}.png`;
  const subAnimation = `${basePath}subscribe_animation/sub-animation.mp4`;
  try {
    const command = ffmpeg(template_pop_up);
    command
      .input(banner)
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
      .output(`../process/rendered_video/pop_over/${channelId}.mp4`)
      .on("error", function (er) {
        console.log("error occured: " + er.message);
      })
      .on("end", function () {
        console.log("success");
      })

     .run()
     return "done";
    // return `../process/render_video/pop_over/${channelId}`;
  } catch (err) {
    console.error(err);
  }
}

module.exports = { renderVideo };
