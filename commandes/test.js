"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { zokou } = require("../framework/zokou");
zokou({ nomCom: "repo", reaction: "😌", nomFichier: __filename }, async (dest, zk, commandeOptions) => {
    console.log("Commande saisie !!!s");
    let z = 'Hello This is  *SKIPPER-MD* \n\n ' + "The Following is *SKIPPER-MD Repo.*";
    let d = ' https://github.com/Tonny408/Skipper-Md';
    let varmess = z + d;
    var img = 'https://telegra.ph/file/89bfd1ddc221647f3c7ce.jpg';
    await zk.sendMessage(dest, { image: { url: img }, caption: varmess });
    //console.log("montest")
});
console.log("mon test");
/*module.exports.commande = () => {
  var nomCom = ["test","t"]
  var reaction="☺️"
  return { nomCom, execute,reaction }
};

async function  execute  (origineMessage,zok) {
  console.log("Commande saisie !!!s")
   let z ='Salut je m\'appelle *SKIPPER-MD* \n\n '+'je suis un bot Whatsapp Multi-appareil '
      let d =' developpé par *Tonny 408*'
      let varmess=z+d
      var img='https://telegra.ph/file/89bfd1ddc221647f3c7ce.jpg';
await  zok.sendMessage(origineMessage,  { image:{url:img},caption:varmess});
}  */ 
