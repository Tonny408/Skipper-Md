const { skipper } = require("../framework/skipper");
const moment = require("moment-timezone");
const { getBuffer } = require("../framework/dl/Function");
const { default: axios } = require('axios');

nomCom: "uptime",
categorie: "Utility",
reaction: "⏱️"
}, async (origineMessage, zk, commandeOptions) => {
    // Get the uptime in seconds
    const uptimeInSeconds = process.uptime();
    
    // Calculate days, hours, minutes, and seconds
    const days = Math.floor(uptimeInSeconds / (24 * 3600));
    const hours = Math.floor((uptimeInSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeInSeconds % 60);
    
    // Format the uptime message
    const uptimeMessage = `🕒 *Bot Uptime:*\n` +
                          `*Days:* ${days}\n` +
                          `*Hours:* ${hours}\n` +
                          `*Minutes:* ${minutes}\n` +
                          `*Seconds:* ${seconds}`;
    
    // Send the uptime message
    await zk.sendMessage(origineMessage, { text: uptimeMessage }, { quoted: ms });
});
