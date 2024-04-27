const { messageCreate } = require("./controllers/messageCreate.controller");

require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

//create new discord client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("ready", (message) => {
  console.log(`Logged as ${client.user.tag}`);
  const channelName =
    client.channels.cache.get("1090695738222186529") ||
    client.channels.cache.get("864198686215766029");
  if (channelName) {
    // channelName.send(`${client.user.tag} is now logged`);
  }
});

client.on("error", () => console.error(`Discord client error ${error}`));

client.on("messageCreate", messageCreate);

const loggedIn = client.login(process.env.TOKEN);

if (loggedIn) {
  console.log("Bot is online!");
}
