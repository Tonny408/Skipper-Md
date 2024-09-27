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
        return repondre("Provide a song name to download!");
    }

    const yts = require("youtube-yts");
    const { youtubedl, youtubedlv2 } = require("@bochilteam/scraper");
    
    try {
        console.log('Starting song command processing...');
        const topo = arg.join(" ");
        const yt_play = await yts(topo);
        console.log('Search results:', yt_play);

        if (!yt_play.videos || yt_play.videos.length === 0) {
            return repondre('No video results found.');
        }

        const anup3k = yt_play.videos[0];
        console.log('Selected video:', anup3k);

        const q = '128kbps';
        const v = anup3k.url;
        console.log('Video URL:', v);
        
        // Try downloading with youtubedl first, fallback to youtubedlv2
        let yt;
        try {
            yt = await youtubedl(v);
            console.log('Primary downloader success:', yt);
        } catch (scraperError) {
            console.error('Error using primary downloader, trying backup:', scraperError);
            try {
                yt = await youtubedlv2(v);
                console.log('Backup downloader success:', yt);
            } catch (backupError) {
                console.error('Backup downloader failed:', backupError);
                return repondre('Both download methods failed.');
            }
        }

        console.log('Available audio formats:', yt.audio);
        const dl_url = await yt.audio[q].download();
        const ttl = await yt.title;
        const size = await yt.audio[q].fileSizeH;

        // Check file size limit (10MB for non-premium)
        const isPremium = false; // Replace with your actual premium check logic
        if (size > 10 * 1024 * 1024 && !isPremium) {
            return repondre('File size exceeds the download limit. Please try a smaller file.');
        }

        // Send the audio as a document
        console.log('Sending message to:', origineMessage);
        await zk.sendMessage(origineMessage, {
            document: { url: dl_url },
            mimetype: 'audio/mpeg',
            fileName: `${ttl}.mp3`,
            contextInfo: {
                externalAdReply: {
                    title: ttl,
                    thumbnailUrl: anup3k.thumbnail,
                    mediaType: 1,
                    showAdAttribution: true,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: ms });

        console.log("Audio file sent successfully!");

    } catch (error) {
        console.error('General error processing song command:', error);
        repondre('An error occurred during the search or download process.');
    }
        }
        


  

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
