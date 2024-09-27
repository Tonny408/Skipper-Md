const { skipper } = require("../framework/skipper");
const yts = require('yt-search');
const ytdl = require('@distube/ytdl-core');
const { youtubedl, youtubedlv2 } = require("@bochilteam/scraper");
const fs = require('fs');
const yt=require("../framework/dl/ytdl-core.js")
const ffmpeg = require("fluent-ffmpeg");
const yts1 = require("youtube-yts");
//var fs =require("fs-extra")

skipper({
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
    const topo = arg.join(" ");
    const yts = require("youtube-yts");
    const ytdl = require("ytdl-core");
    const youtubedl = require('ytdl-core-discord');
    const search = await yts(topo);
    const videos = search.videos;

    if (videos && videos.length > 0 && videos[0]) {
      const video = videos[0];
      const urlElement = video.url;

      let infoMess = {
        image: { url: video.thumbnail },
        caption: `\n*Song Name:* _${video.title}_\n\n*Duration:* _${video.timestamp}_\n\n*Url:* _${video.url}_\n\n_*Downloading...*_\n\n`
      };

      await zk.sendMessage(origineMessage, infoMess, { quoted: ms });

      // Download the audio using ytdl-core
      const ytStream = await youtubedl(urlElement).catch(async _ => await ytdl(urlElement, { filter: 'audioonly' }));

      // Error check: Ensure audio format is available
      const formats = ytdl.filterFormats(ytStream.formats, 'audioonly');
      const audioFormat = formats.find(format => format.audioBitrate === 128);

      if (!audioFormat) {
        return repondre('No audio format available for download.');
      }

      const dl_url = audioFormat.url;
      const ttl = video.title;
      const size = audioFormat.contentLength ? parseInt(audioFormat.contentLength, 10) : 0;

      // Check file size limit (assuming 10MB for non-premium users)
      const isPremium = false; // Replace with actual premium check logic
      if (size > 10 * 1024 * 1024 && !isPremium) {
        return repondre('The file size exceeds the download limit. Please try a smaller file.');
      }

      // Send the audio as a document
      await zk.sendMessage(origineMessage, {
        document: { url: dl_url },
        mimetype: 'audio/mpeg',
        fileName: `${ttl}.mp3`,
        contextInfo: {
          externalAdReply: {
            title: ttl,
            thumbnailUrl: video.thumbnail,
            mediaType: 1,
            showAdAttribution: true,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: ms });

      console.log("Audio file sent successfully!");
    } else {
      repondre('No video results found.');
    }
  } catch (error) {
    console.error('Error processing song command:', error);
    repondre('An error occurred during the search or download process.');
  }
});

  

skipper({
  nomCom: "video",
  categorie: "Search",
  reaction: "🎥"
}, async (origineMessage, zk, commandeOptions) => {
  const { arg, ms, repondre } = commandeOptions;

  if (!arg[0]) {
    repondre("insert video name");
    return;
  }

  const topo = arg.join(" ");
  try {
    const search = await yts(topo);
    const videos = search.videos;

    if (videos && videos.length > 0 && videos[0]) {
      const Element = videos[0];

      let InfoMess = {
        image: { url: videos[0].thumbnail },
        caption: `*Video name :* _${Element.title}_
*Time :* _${Element.timestamp}_
*Url :* _${Element.url}_
_*On downloading...*_\n\n`
      };

      zk.sendMessage(origineMessage, InfoMess, { quoted: ms });

      // Obtenir les informations de la vidéo à partir du lien YouTube
      const videoInfo = await ytdl.getInfo(Element.url);
      // Format vidéo avec la meilleure qualité disponible
      const format = ytdl.chooseFormat(videoInfo.formats, { quality: '18' });
      // Télécharger la vidéo
      const videoStream = ytdl.downloadFromInfo(videoInfo, { format });

      // Nom du fichier local pour sauvegarder la vidéo
      const filename = 'video.mp4';

      // Écrire le flux vidéo dans un fichier local
      const fileStream = fs.createWriteStream(filename);
      videoStream.pipe(fileStream);

      fileStream.on('finish', () => {
        // Envoi du fichier vidéo en utilisant l'URL du fichier local
        zk.sendMessage(origineMessage, { video: { url :"./video.mp4"} , caption: "*SKIPPER-MD*", gifPlayback: false }, { quoted: ms });
      });

      fileStream.on('error', (error) => {
        console.error('Erreur lors de l\'écriture du fichier vidéo :', error);
        repondre('Une erreur est survenue lors de l\'écriture du fichier vidéo.');
      });
    } else {
      repondre('No video found');
    }
  } catch (error) {
    console.error('Erreur lors de la recherche ou du téléchargement de la vidéo :', error);
    repondre('Une erreur est survenue lors de la recherche ou du téléchargement de la vidéo.');
  }
});
