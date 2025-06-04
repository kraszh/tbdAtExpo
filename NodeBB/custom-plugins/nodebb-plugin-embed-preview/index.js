'use strict';

const EmbedPreview = {};

EmbedPreview.parse = async function (data) {
  let content = data.postData.content;

  // YouTube
  content = content.replace(
    /https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/g,
    '<iframe width="560" height="315" src="https://www.youtube.com/embed/$1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
  );

  // Thingiverse
  content = content.replace(
    /https?:\/\/(?:www\.)?thingiverse\.com\/thing:(\d+)/g,
    '<iframe src="https://www.thingiverse.com/embed:$1" width="560" height="420" frameborder="0"></iframe>'
  );

  // Roblox (fallback to a clickable link because iframe likely won’t work)
//   content = content.replace(
//     /https?:\/\/(?:www\.)?roblox\.com\/games\/(\d+)[^\s]*/g,
//     '<a href="https://www.roblox.com/games/$1" target="_blank" rel="noopener noreferrer">Play on Roblox</a>'
//   );

  data.postData.content = content;
  return data;
};

module.exports = EmbedPreview;
