const { zokou } = require("../framework/zokou");
const ytSearch = require("yt-search");
const fs = require("fs");
const axios = require("axios");

// Command for searching and downloading YouTube songs
const songCommand = {
  nomCom: "song",
  categorie: "Search",
  reaction: "💿",
  desc: "Search and download YouTube songs",
};

zokou(songCommand, async (message, client, args) => {
  const { ms, repondre, arg } = args;

  if (!arg[0]) {
    repondre("Please enter a search term.");
    return;
  }

  try {
    const searchQuery = arg.join(" ");
    const searchResult = await ytSearch(searchQuery);
    const videos = searchResult.videos;

    if (videos && videos.length > 0) {
      const video = videos[0];
      const videoUrl = video.url;

      // Send video details (thumbnail, title, duration, and link)
      const videoDetails = {
        image: { url: video.thumbnail },
        caption: `
*Song title:* _${video.title}_
*Duration:* _${video.timestamp}_
*Link:* _${video.url}_
\n_*Downloading...*_
        `,
      };
      client.sendMessage(message, videoDetails, { quoted: ms });

      // Download the audio
      const audioResponse = await axios.get(
        `https://kaiz-apis.gleeze.com/api/ytmp3-v2?url=${videoUrl}`,
        { responseType: "arraybuffer" }
      );
      fs.writeFileSync("./songaudio.mp3", Buffer.from(audioResponse.data));

      // Send the downloaded audio
      const audioFile = { url: "./songaudio.mp3" };
      const audioMessage = {
        audio: audioFile,
        mimetype: "audio/mp4",
        ptt: false,
      };
      client.sendMessage(message, audioMessage, { quoted: ms });
    } else {
      repondre("No audio found.");
    }
  } catch (error) {
    console.error("Error during video search or download:", error);
    repondre("An error occurred during the search or download.");
  }
});

// Command for searching and downloading YouTube videos
const videoCommand = {
  nomCom: "video",
  categorie: "Search",
  reaction: "🎥",
  desc: "Search and download YouTube videos",
};

zokou(videoCommand, async (message, client, args) => {
  const { arg: searchArgs, ms, repondre } = args;

  if (!searchArgs[0]) {
    repondre("Please enter a search term.");
    return;
  }

  const searchQuery = searchArgs.join(" ");

  try {
    const searchResult = await ytSearch(searchQuery);
    const videos = searchResult.videos;

    if (videos && videos.length > 0) {
      const video = videos[0];

      // Send video details (thumbnail, title, duration, and link)
      const videoDetails = {
        image: { url: video.thumbnail },
        caption: `
*Video title:* _${video.title}_
*Duration:* _${video.timestamp}_
*Link:* _${video.url}_
\n_*Downloading...*_
        `,
      };
      client.sendMessage(message, videoDetails, { quoted: ms });

      // Download the video
      const videoResponse = await axios.get(
        https://kaiz-apis.gleeze.com/api/ytmp4?url=&quality=?=${video.url}&quality=best`,
        { responseType: "arraybuffer" }
      );
      fs.writeFileSync("./VVideo.mp4", Buffer.from(videoResponse.data));

      // Send the downloaded video
      const videoFile = { url: "./VVideo.mp4" };
      const videoMessage = {
        video: videoFile,
        caption: "*Zokou-Md*",
        gifPlayback: false,
      };
      await client.sendMessage(message, videoMessage, { quoted: ms });
    } else {
      repondre("No video found.");
    }
  } catch (error) {
    console.error("Error during video search or download:", error);
    repondre("An error occurred during the search or download.");
  }
});
