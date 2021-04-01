const fs = require("fs");
const videoshow = require("videoshow");

function createTempalte(size) {
  var images = [`../${size}.jpg`];

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
    .save(`../${size}.mp4`)
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
createTempalte("1060x330") 
module.exports = { createTempalte };
