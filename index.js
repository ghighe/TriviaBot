const Discord = require("discord.js");
const axios = require("axios");
require("dotenv").config();
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

//create new discord client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const gamePrefix = "!";

client.once("ready", () => {
  console.log(`Logged as ${client.user.tag}`);
});

client.on("messageCreate", async (msg) => {
  if (!msg.content.startsWith(gamePrefix) || msg.author.bot) return;

  const args = msg.content.slice(gamePrefix.length).trim().split(/ +/);
  const playerCommand = args.shift().toLowerCase();

  if (playerCommand === "trivia") {
    sendNewQuestion(msg.channel);

    // const questionInterval = setInterval(() => {
    //   sendNewQuestion(msg.channel);
    // }, 30000);
  }
});

async function sendNewQuestion(channel) {
  const APIData = await axios.get(
    "https://opentdb.com/api.php?amount=50&category=15&difficulty=easy&type=multiple"
  );
  const triviaFirstQuestion = APIData.data.results[0];
  const questionFormat = formatQuestion(triviaFirstQuestion);
  if (questionFormat) {
    channel.send({ embeds: [questionFormat] });
  }
  //store the correct answer
  const correctAnswer = triviaFirstQuestion.correct_answer;

  //wait for a response
  const filterAnswer = (response) =>
    !response.author.bot && response.channel.id === channel.id;
  //create a message collector
  const collector = channel.createMessageCollector({
    filter: filterAnswer,
    time: 15000,
    max: 1
  });
  //wait for user response
  collector.on("collect", (collected) => {
    const userAnswer = collected.content;
    const userName = collected.author.username;
    if (
      userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()
    ) {
      channel.send(`${userName}.Your answer is correct.`);
    } else {
      channel.send(`Oops ${userName} The correct answer was: ${correctAnswer}`);
    }

    collector.stop(); // Stop the collector after a response is received
  });

  collector.on("end", (collected, reason) => {
    if (reason === "time") {
      channel.send("Time is up! You did not provide an answer.");
    }
  });
}

function formatQuestion(question) {
  const formattedQuestion = new EmbedBuilder()
    .setColor("#0099ff")
    .setTitle("Trivia Question")

    .addFields(
      { name: "Category", value: question.category },
      { name: "Question", value: question.question },
      { name: "Options", value: getOptions(question) }
    )
    .setTimestamp();

  return formattedQuestion;
}

function getOptions(question) {
  const options = question.incorrect_answers;
  const correctOption = question.correct_answer;

  options.push(correctOption);
  options.sort();

  let formattedOptions = "";

  for (let i = 0; i < options.length; i++) {
    formattedOptions += `${i + 1} - ${options[i]}\n`;
  }

  return formattedOptions;
}

client.login(process.env.TOKEN);
