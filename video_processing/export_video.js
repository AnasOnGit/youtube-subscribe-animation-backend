const fs = require("fs");
const { renderVideo } = require("./render_video");
const { canvasImageManipulation } = require("./canvas_image_manipulation");

function render(type, channelId, logo, channelName, banner, subscribers) {
  // createTempalte("1060x469");
  canvasImageManipulation(channelId, banner, logo, channelName, subscribers);
  renderVideo(channelId);
}
const banner =
  "https://yt3.ggpht.com/qFvUd2J46ZNZfXPkV5b-dOsQkZms2LWolfvOUzcbzE-vFv4hhySa5YuNQPfZSDvkA--vNeqh1w=w1060-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj";
const logo =
  "https://yt3.ggpht.com/a/AATXAJwBQTLGE-faPEMd8jfTioJ-z6N89ZZZ3kIs-audvw=s240-c-k-c0xffffffff-no-rj-mo";
let channelId = "Arun";
// let channelId = "UC5RRWuMJu7yP1DQwnW_nAvA";
let channelName = "Ammar ki duniya";
let subscribers = 2000;
render("popup", channelId, logo, channelName, banner, subscribers);
renderVideo(channelId);
module.exports = { render };
