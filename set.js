const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiVUNSUzYxV1ZIckRVWlc0T20xQVdXTldxRVNmZE9QY290bWlKbWxHdDBGdz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiTUQxT09YVmlGdEFHbW9pNXh6UGxyN0hIaEs1bm9RVzBZb2VQNTg1SGZEYz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJjSlJZaDRsYnN2dmxkRmI5bzY0Ty9WSm5PS3pnUWtueTA3M0ZJK25BV1ZBPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIzVmU2UjJ0QzU5UElyQ1g4eHY0VnlyZXZ1dHQyekIvOTJZVEgzRWNjVXljPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InVFNVEwZHBkWWd0YW1BNW9kZm0raUtvd3NpVmJZYy9rSnE3Rm03U3dCbDQ9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImlhMWdqZFdEMkpUU0dQbUhxMExQRXozS1krcDFFeWJJQ0NBbjJPOU16bW89In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQ01sL0doYUxnZnU2WmRMOHhiYlpPWHZRaFh3RVd1dURzTUVSaUh6RlprUT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNkpueFpXOGlZY2RCRW4rRWhUcE50WG8vL1dJT2JUYkNNa3Vjb3daanRGRT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IktaY2RsbXo4Q0FRa1JpdkxGbEFhYXBCSnpPOGFWb1QrVzdXdnBZMCtmaU02NEpCQU5saE4rZVJHbWFPb2tFUk5KT2lvSTYxcGVNcHp2NDE4YXlGQkFnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTg2LCJhZHZTZWNyZXRLZXkiOiJaTGtHM3Era2lpVUxOYjAra0lCbU1WaTFYdmZIVStyZzM0bW8zRCtOSkw0PSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W3sia2V5Ijp7InJlbW90ZUppZCI6IjI1MjkwNTYwNzk5M0BzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiI3MThDODQxMzc2RkNBREVBM0M5QTE3OTcyQ0QyQkI2QSJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzI3MDc2OTI0fSx7ImtleSI6eyJyZW1vdGVKaWQiOiIyNTI5MDU2MDc5OTNAcy53aGF0c2FwcC5uZXQiLCJmcm9tTWUiOnRydWUsImlkIjoiNjlEMkQ1NjEzMDE3RTgwMTc3Nzc0QkEzRTE5RkU0MkUifSwibWVzc2FnZVRpbWVzdGFtcCI6MTcyNzA3NjkyNX1dLCJuZXh0UHJlS2V5SWQiOjMxLCJmaXJzdFVudXBsb2FkZWRQcmVLZXlJZCI6MzEsImFjY291bnRTeW5jQ291bnRlciI6MSwiYWNjb3VudFNldHRpbmdzIjp7InVuYXJjaGl2ZUNoYXRzIjpmYWxzZX0sImRldmljZUlkIjoidUVFY1R5c0NUQS1WQ3g2M3lmX29CQSIsInBob25lSWQiOiI0NGI0MzI0OC1jYzZlLTQxZDMtOTVhOC05YzdhZDE3MDMxNmUiLCJpZGVudGl0eUlkIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiUktyUXdMbzY3cXBQcGJxVmdhTWdZdElJbE5nPSJ9LCJyZWdpc3RlcmVkIjp0cnVlLCJiYWNrdXBUb2tlbiI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IldFTXZwMGVnenNrdGNjTzlzaWhYNHF1SVcyOD0ifSwicmVnaXN0cmF0aW9uIjp7fSwicGFpcmluZ0NvZGUiOiI5NlE3OEI1RiIsIm1lIjp7ImlkIjoiMjUyOTA1NjA3OTkzOjFAcy53aGF0c2FwcC5uZXQiLCJuYW1lIjoiWmFtc2FtIn0sImFjY291bnQiOnsiZGV0YWlscyI6IkNOS3B4a29RcmJURXR3WVlBU0FBS0FBPSIsImFjY291bnRTaWduYXR1cmVLZXkiOiJuY1BDU3dLcTVTMUIvcXZOeUpHVUw5em96SUxBOE5wQ3ZiUW4yMTdwY0c4PSIsImFjY291bnRTaWduYXR1cmUiOiI0R0F1SUZ4NnN6SjlGa3BJUEx0OFhaL0N3bjBPdG5Md3IvT20zY3VTY1c2NFpWblliR3NzTDJ3bVpmY1YxU2lsRU95OUppei94ZEdkZmhuV0I4SzhEUT09IiwiZGV2aWNlU2lnbmF0dXJlIjoiTmJMdUpGSjd6NFA1TUg2dkV4MWY1VnIvNUVGak94bVZDMkovNkUrcXh2Yk1mZk9MK0wrNUVoR2xoOS80TTZQS2JSODV3MlkyRkkxay84Sm1hTngvQXc9PSJ9LCJzaWduYWxJZGVudGl0aWVzIjpbeyJpZGVudGlmaWVyIjp7Im5hbWUiOiIyNTI5MDU2MDc5OTM6MUBzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJaM0R3a3NDcXVVdFFmNnJ6Y2lSbEMvYzZNeUN3UERhUXIyMEo5dGU2WEJ2In19XSwicGxhdGZvcm0iOiJhbmRyb2lkIiwibGFzdEFjY291bnRTeW5jVGltZXN0YW1wIjoxNzI3MDc2OTIyLCJteUFwcFN0YXRlS2V5SWQiOiJBQUFBQUlLdCJ9',
    PREFIXE: process.env.PREFIX || "#",
    OWNER_NAME: process.env.OWNER_NAME || "Godzilla",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "252905253177",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "non",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'non',
    BOT : process.env.BOT_NAME || 'Skipper-Md',
    URL : process.env.BOT_MENU_LINKS || 'https://static.animecorner.me/2023/08/op2.jpg',
    MODE: process.env.PUBLIC_MODE || "no",
    PM_PERMIT: process.env.PM_PERMIT || 'no',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_API_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '2' ,
    ETAT : process.env.PRESENCE || '',
    //GPT : process.env.OPENAI_API_KEY || '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',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'yes',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9" : "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9",
    /* new Sequelize({
     dialect: 'sqlite',
     storage: DATABASE_URL,
     logging: false,
})
: new Sequelize(DATABASE_URL, {
     dialect: 'postgres',
     ssl: true,
     protocol: 'postgres',
     dialectOptions: {
         native: true,
         ssl: { require: true, rejectUnauthorized: false },
     },
     logging: false,
}),*/
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
