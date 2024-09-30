const { zokou } = require("../framework/zokou");
const yts = require('yt-search');
const ytdl = require('ytdl-core');
const fs = require('fs');
const youtubedl = require('youtube-dl-exec'); 

zokou({
  nomCom: "play",
  categorie: "Search",
  reaction: "💿"
}, async (origineMessage, zk, commandeOptions) => {
  const { ms, repondre, arg } = commandeOptions;

  if (!arg[0]) {
    repondre("Which song do you want?");
    return;
  }

  try {
    let topo = arg.join(" ");
    const search = await yts(topo);
    const videos = search.videos;

    if (videos && videos.length > 0 && videos[0]) {
      const urlElement = videos[0].url;

      // Prepare message information
      let infoMess = {
        image: { url: videos[0].thumbnail },
        caption: `\n*Song name:* _${videos[0].title}_\n*Time:* _${videos[0].timestamp}_\n*Url:* _${videos[0].url}_\n\n_*On downloading...*_\n`
      };

      // Send the initial message
      await zk.sendMessage(origineMessage, infoMess, { quoted: ms });

      // Use youtube-dl to get audio stream
      const filename = 'audio.mp3';
      await new Promise((resolve, reject) => {
        youtubedl(urlElement, {
          extractAudio: true,
          audioFormat: 'mp3',
          output: filename
        })
        .then(() => {
          // Send the audio file using the local file URL
          zk.sendMessage(origineMessage, { audio: { url: filename }, mimetype: 'audio/mp4' }, { quoted: ms, ptt: false });
          console.log("Audio file sent successfully!");
          resolve();
        })
        .catch(err => {
          console.error('Error downloading audio:', err);
          repondre('An error occurred while downloading the audio.');
          reject(err);
        });
      });
    } else {
      repondre('No video found.');
    }
  } catch (error) {
    console.error('Error searching or downloading video:', error);
    repondre('An error occurred while searching or downloading the video.');
  }
});

zokou({
  nomCom: "video",
  categorie: "Search",
  reaction: "🎥"
}, async (origineMessage, zk, commandeOptions) => {
  const { arg, ms, repondre } = commandeOptions;

  if (!arg[0]) {
    repondre("Insert video name");
    return;
  }

  const topo = arg.join(" ");
  try {
    const search = await yts(topo);
    const videos = search.videos;

    if (videos && videos.length > 0 && videos[0]) {
      const Element = videos[0];

      // Prepare message information
      let InfoMess = {
        image: { url: videos[0].thumbnail },
        caption: `*Video name:* _${Element.title}_\n*Time:* _${Element.timestamp}_\n*Url:* _${Element.url}_\n\n_*On downloading...*_\n`
      };

      // Send the initial message
      await zk.sendMessage(origineMessage, InfoMess, { quoted: ms });

      // Use youtube-dl to get video stream
      const filename = 'video.mp4';
      await new Promise((resolve, reject) => {
        youtubedl(Element.url, {
          output: filename,
          format: 'bestvideo+bestaudio/best',
        })
        .then(() => {
          // Send the video using the local file URL
          zk.sendMessage(origineMessage, { video: { url: filename }, caption: "*FLASH-MD*", gifPlayback: false }, { quoted: ms });
          console.log("Video file sent successfully!");
          resolve();
        })
        .catch(err => {
          console.error('Error downloading video:', err);
          repondre('An error occurred while downloading the video.');
          reject(err);
        });
      });
    } else {
      repondre('No video found.');
    }
  } catch (error) {
    console.error('Error searching or downloading video:', error);
    repondre('An error occurred while searching or downloading the video.');
  }
});
