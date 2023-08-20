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

client.on("messageCreate", messageCreate);

client.login(process.env.TOKEN);
