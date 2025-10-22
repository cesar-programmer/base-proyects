import { google } from "googleapis";
import readline from "readline";

const CLIENT_ID = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
const CLIENT_SECRET = "xxxxxxxxxxxxxxxxxxxxxxxxxxxx"; // <-- tu client secret
const REDIRECT_URI = "xxxxxxxxxxxxxxxxx"; // el mismo que pusiste en Google Cloud

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const SCOPES = ["https://mail.google.com/"];

const url = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: SCOPES,
});

console.log("🔗 Abre este enlace en tu navegador:");
console.log(url);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("\nPega aquí el código que te dio Google: ", async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  console.log("\n✅ Tus tokens:");
  console.log(tokens);
  rl.close();
});
