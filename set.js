const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoicUw5K0t2RnBPVy9pZXBRVGI3N0gxSS8vaEtTU0Rha2JqZmUzZ0xOVG5WZz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoia1AyWXlyQ0NrMU1CVkZOUW8xcU9NQUR6Z1p2UU5uMGVxblpnQW1ic09oRT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJBSnN0QVlla3FaZ3prWk9zUVluRTFYMXVYL0R3RDlpVHQ3RkFXN056UkZjPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJIVXFxaDNNNnkwMVZvUk9ET2tMSXVGdUNMa2h0aHRvcHprWUVXRGk0OW5jPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImNCUkxoczdrZFhWRmFhb0VGOWlwbFpOUkN2U3ErZVpFM25tTlhwT2tKR289In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InMvSElzelRwRGV4bmhwY1ZUc241UTBXSWZCZ1BqWlY0b2VMUTFVdHdSMUk9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoid0ZxQXpOV1dCdFVFNHk1Z0QwUFRTb2dKMkNpYk5Md3hzd01GN1duSVhWWT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiSkJWa2NoWnRiWWdDYWMrUTJvZStmbFo5dWhNSGFvVGNGZDBYOU16eDhuaz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ill5bDhFZ3lOdGhhVUl0UVYxNFNVeCtCNTUzd05IZCs4TGZTOWJWV25PYVJRUk5wdUVOd01JOGRrOHQzK3VrS0hzNUJqaitGT1ZUZmZNUmV2emNiVmlBPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjA2LCJhZHZTZWNyZXRLZXkiOiJBRTJPTktQMmdxRHNOUFFhaERtV1VoZ2cwWVg5M2hrSDVTNFJHLzVXaWowPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiI0eXN2ZHlmUFFZMktfN2ZPaUVRS2Z3IiwicGhvbmVJZCI6IjhkMmE0MjA3LTIxYjktNDhhOS1iZmM1LWM2ZjUwZDk3MGFiNiIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJFU1dUZGdpNy9aVHZ3VzdsWG5LMkI2MjhuRUU9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRE10a3BiR3NyVnhBZlFhelRPK0hDVXNuWi84PSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IkVSNEpQTDY0IiwibWUiOnsiaWQiOiIyMzQ5MDI2MzcxNjQ2OjM1QHMud2hhdHNhcHAubmV0IiwibmFtZSI6IkQgT25lIn0sImFjY291bnQiOnsiZGV0YWlscyI6IkNLMm44YXdERUpiQmpib0dHQUlnQUNnQSIsImFjY291bnRTaWduYXR1cmVLZXkiOiJ1SWFkbDB4NXhFcy9VZjliM2RYS2M2dFJPbEZONlExSFJ2WVJ3UVNldUFNPSIsImFjY291bnRTaWduYXR1cmUiOiJsMUZrZytESEFnamVVSVN0MEMvdzV3VTFjbVdvNkUyVzR4SlpWNkxFbkJIeHRCV0ZlUkF4aWJRTG05NjUvMWE2YzVsN01EY0JVTXZpaHFtcFU1bzRDUT09IiwiZGV2aWNlU2lnbmF0dXJlIjoiYTM4Qm5QUzY0U3BsUFYzZzdWQmhINGkyaVBoeG1KMlAxTVNqZkp5SG9DTGZscmVSWUpja1A4VnNOTWdHUDR4SXRiNUpoV1ZRZ3R4cVJkTGhNbkRmaEE9PSJ9LCJzaWduYWxJZGVudGl0aWVzIjpbeyJpZGVudGlmaWVyIjp7Im5hbWUiOiIyMzQ5MDI2MzcxNjQ2OjM1QHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQmJpR25aZE1lY1JMUDFIL1c5M1Z5bk9yVVRwUlRla05SMGIyRWNFRW5yZ0QifX1dLCJwbGF0Zm9ybSI6InNtYmEiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3MzI0Njg5MDEsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBQTRlIn0='
    PREFIXE: process.env.PREFIX || "#",
    OWNER_NAME: process.env.OWNER_NAME || "D ONE",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "2349026371646",              
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
