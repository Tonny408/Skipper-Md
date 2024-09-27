const { youtubedl, youtubedlv2 } = require("@bochilteam/scraper");
const { zokou } = require("../framework/zokou");
const yts = require('yt-search');
const fs = require('fs');
const ffmpeg = require("fluent-ffmpeg");

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

      let infoMess = {
        image: { url: videos[0].thumbnail },
        caption: `\n*Song Name:* _${videos[0].title}_\n*Time:* _${videos[0].timestamp}_\n*Url:* _${videos[0].url}_\n_*On downloading...*_\n\n`
      }

      zk.sendMessage(origineMessage, infoMess, { quoted: ms });

      // Use youtubedl to get audio stream
      const audioStream = await youtubedl(urlElement, { filter: 'audioonly', quality: 'highestaudio' });

      // Save the audio to a file
      const filename = 'audio.mp3';
      const fileStream = fs.createWriteStream(filename);
      audioStream.pipe(fileStream);

      fileStream.on('finish', () => {
        zk.sendMessage(origineMessage, { audio: { url: "audio.mp3" }, mimetype: 'audio/mp4' }, { quoted: ms, ptt: false });
        console.log("Audio file sent!");
      });

      fileStream.on('error', (error) => {
        console.error('Error writing audio file:', error);
        repondre('An error occurred while writing the audio file.');
      });
    } else {
      repondre('No video found.');
    }
  } catch (error) {
    console.error('Error searching or downloading the video:', error);
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
      const element = videos[0];

      let infoMess = {
        image: { url: videos[0].thumbnail },
        caption: `*Video Name:* _${element.title}_\n*Time:* _${element.timestamp}_\n*Url:* _${element.url}_\n_*On downloading...*_\n\n`
      };

      zk.sendMessage(origineMessage, infoMess, { quoted: ms });

      // Use youtubedl to get video stream
      const videoStream = await youtubedl(element.url, { filter: 'videoonly', quality: 'highest' });

      // Save the video to a file
      const filename = 'video.mp4';
      const fileStream = fs.createWriteStream(filename);
      videoStream.pipe(fileStream);

      fileStream.on('finish', () => {
        zk.sendMessage(origineMessage, { video: { url: "./video.mp4" }, caption: "*FLASH-MD*", gifPlayback: false }, { quoted: ms });
      });

      fileStream.on('error', (error) => {
        console.error('Error writing video file:', error);
        repondre('An error occurred while writing the video file.');
      });
    } else {
      repondre('No video found.');
    }
  } catch (error) {
    console.error('Error searching or downloading the video:', error);
    repondre('An error occurred while searching or downloading the video.');
  }
});
