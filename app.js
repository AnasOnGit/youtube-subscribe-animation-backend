// init
//  init dotenv

const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const yt = require('youtube-search-without-api-key');
const Jimp = require("jimp")
gm = require('gm')
// define
const PORT = 3000;
const channelId = "UC06WE_WLSgLBqwJDePcjesg";
const channelName = "A3 VLOG.8";
const channelLogo = "https://yt3.ggpht.com/a/AATXAJx6i8Z0VYlHtJtEe2WubIGCJmnVw_B2T-S0QHOoLw=s240-c-k-c0xffffffff-no-rj-mo";
const channelBanner = "https://yt3.ggpht.com/jdTWMv0lyU_AIPj44ipnnl9s0Spu6-ceGXmBkAlw5w7Z2SA1yeIOZsRPK6v19qIQD2JLEx7DHA=w1280-fcrop64=1,32b75a57cd48a5a8-k-c0xffffffff-no-nd-rj";
const subscribers = 233;
// methods
const resize = (img, w, h, path, format) =>{
  gm(img)
  .resize(w, h) // This will break the aspect ratio and resize width AND height
  .write(`./process/image_manipulation/${path}.${format}`, (err) => {
    if (err) {
      console.log(err);
    }else{
      console.log(`Save file on ${path}...`)
    }
  })


    // Jimp.read(img)
    // .then((image) => {
    //   return image
    //     .resize(h, w) //(650, 130) // resize
    //     .write(`./process/image_manipulation/${path}.${format}`);
    // })
    // .catch((err) => {
    //   console.error(err);
    // });
}

const editBannerAndIcon = (logo,banner,channelId)=>{
    var content = Jimp.read(logo);
    var circle = Jimp.read("./process/image_manipulation/mask/icon-mask.png");
    Promise.all([content, circle]).then(function (images) {
      var mainPhoto = images[0];
      var mask = images[1];
      mainPhoto
        .mask(mask, 0, 0)
        .write(`./process/image_manipulation/icons/${channelId}.png`);
    }).catch(err=>{
      console.log(err)
    })
    // resize banner
    resize(banner, 650, 130, `banner/${channelId}`, "jpg");
}
const  canvasImageManipulation = (
  channelId,
  banner,
  logo,
  channelName,
  subscribers
) =>{

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
  // request
app.get("/",(req,res)=>{
  editBannerAndIcon(channelLogo,channelBanner,channelId)
  canvasImageManipulation(
  channelId,
  channelBanner,
  channelLogo,
  channelName,
  subscribers
)
})


/**
 * Given a search query, searching on youtube
 * @param {string} search value.
 */

async function  video(){
  const videos = await yt.search('Anas The Vlogger');
  console.log('Videos:');
  console.log(videos);
}
video()
//listen
app.listen(PORT, console.log(`site is live on localhost:${PORT}`));
