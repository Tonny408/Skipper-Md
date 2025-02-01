const util = require('util');
const fs = require('fs-extra');
const { zokou } = require(__dirname + "/../framework/zokou");
const { format } = require(__dirname + "/../framework/mesfonctions");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");

zokou({ nomCom: "menu", categorie: "General" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre ,prefixe,nomAuteurMessage,mybotpic} = commandeOptions;
    let { cm } = require(__dirname + "/../framework//zokou");
    var coms = {};
    var mode = "public";
    
    if ((s.MODE).toLocaleLowerCase() != "yes") {
        mode = "private";
    }


    

    cm.map(async (com, index) => {
        if (!coms[com.categorie])
            coms[com.categorie] = [];
        coms[com.categorie].push(com.nomCom);
    });

    moment.tz.setDefault('Etc/GMT');

// Créer une date et une heure en GMT
const temps = moment().format('HH:mm:ss');
const date = moment().format('DD/MM/YYYY');

  let infoMsg =  `
╭────✧〈 *𝚂𝙺𝙸𝙿𝙿𝙴𝚁 𝙼𝙳* 〉 ✧───◆
┴╭─────────────☹︎
𓄂│▸ *Date* : ${date}
𓄂│▸ *User* : ${s.OWNER_NAME}
𓄂│▸ *Prefix* : ${s.PREFIXE}
𓄂│▸ *Mode* : ${mode}
𓄂│▸ *Commands* : ${cm.length} 
𓄂│▸ *Ram* : ${format(os.totalmem() - os.freemem())}/${format(os.totalmem())}
𓄂│▸ *Platform* : ${os.platform()}
𓄂│▸ *Theme* : *𝚃𝙾𝙽𝙽𝚈 𝙺𝙴*
┬╰──────────────☹︎
╰─── ···▸💰LIKE A BOSS💰··──◆\n\n`;
    
let menuMsg = `
╭──────────✇
   *𝚂𝙺𝙸𝙿𝙿𝙴𝚁-V1.0.0*
╰──────────✇

 *❄︎AVAILABLE COMMANDS❄︎*
`;

    for (const cat in coms) {
        menuMsg += `╭──────☹︎ ${cat} ☹︎`;
        for (const cmd of coms[cat]) {
            menuMsg += `
✞│▸ ${cmd}`;
        }
        menuMsg += `
╰────────────···▸▸ \n`
    }

    menuMsg += `
◇            ◇
*»»————————— ★ ——————————««*
> SKIPPER-MD CREATED BY TONNY
*»»—————————— ★ ——————————««*
`;

   var lien = mybotpic();

   if (lien.match(/\.(mp4|gif)$/i)) {
    try {
        zk.sendMessage(dest, { video: { url: lien }, caption:infoMsg + menuMsg, footer: "Je suis *Beltahmd*, déveloper Beltah Tech" , gifPlayback : true }, { quoted: ms });
    }
    catch (e) {
        console.log("🥵🥵 Menu erreur " + e);
        repondre("🥵🥵 Menu erreur " + e);
    }
} 
// Vérification pour .jpeg ou .png
else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
    try {
        zk.sendMessage(dest, { image: { url: lien }, caption:infoMsg + menuMsg, footer: "Je suis *Beltahmd*, déveloper Beltah Tech" }, { quoted: ms });
    }
    catch (e) {
        console.log("🥵🥵 Menu erreur " + e);
        repondre("🥵🥵 Menu erreur " + e);
    }
} 
else {
    
    repondre(infoMsg + menuMsg);
    
}

});
