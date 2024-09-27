const { zokou } = require("../framework/zokou");

let startTime = Date.now(); // Store the start time when the bot starts

zokou({
  nomCom: "uptime",
  categorie: "Info",
  reaction: "⏳"
}, async (origineMessage, zk, commandeOptions) => {
  const { repondre } = commandeOptions;

  // Calculate the uptime
  const currentTime = Date.now();
  const uptimeMillis = currentTime - startTime;

  // Convert milliseconds to human-readable format
  const seconds = Math.floor((uptimeMillis / 1000) % 60);
  const minutes = Math.floor((uptimeMillis / (1000 * 60)) % 60);
  const hours = Math.floor((uptimeMillis / (1000 * 60 * 60)) % 24);
  const days = Math.floor(uptimeMillis / (1000 * 60 * 60 * 24));

  // Create uptime message
  const uptimeMessage = `*Uptime:* _${days}d ${hours}h ${minutes}m ${seconds}s_`;

  repondre(uptimeMessage);
});
