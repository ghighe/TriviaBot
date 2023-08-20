const { EmbedBuilder } = require("discord.js");
const gameParticipants = new Set();
let playersPoints = {};

function formatQuestion(question) {
  const formattedQuestion = new EmbedBuilder()
    .setColor("#000000")
    .setTitle("𝓜𝓲𝓷𝓭 𝓣𝓮𝓪𝓼𝓮𝓻𝓼: 𝓣𝓻𝓲𝓿𝓲𝓪 𝓢𝓱𝓸𝔀𝓭𝓸𝔀")
    .setDescription(
      `\`\`\`Category: ${question.category}\n\nQ:${
        question.question
      }\n\n${getOptions(question)}\`\`\``
    )
    .setTimestamp()
    .setFooter({
      text: `Game Difficulty: ${question.difficulty} | Type: ${question.type}`
    });

  return formattedQuestion;
}

function increasePlayerPoints(playerName) {
  if (!playersPoints[playerName]) {
    playersPoints[playerName] = 0;
    console.log(playersPoints);
  }
  playersPoints[playerName]++;

  return { playerName, points: playersPoints[playerName] };
}

function addParticipants(message) {
  if (message.author.bot) return;

  const userName = message.author.username;

  if (!gameParticipants.has(userName)) {
    gameParticipants.add(userName);
    message.channel.send(`${userName} joined trivia game!`);
  } else {
    return;
  }
  console.log("Participants: ", gameParticipants);
}

function getAnswerFromIndex(question) {
  const correctOption = question.correct_answer;
  const optionsArray = getOptions(question).split("\n");
  // Find the index of the correct option in the array
  const correctAnswerIndex =
    optionsArray.findIndex((option) => option.includes(correctOption)) + 1;
  return correctAnswerIndex.toString();
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

module.exports = {
  formatQuestion,
  increasePlayerPoints,
  addParticipants,
  getAnswerFromIndex,
  gameParticipants,
  playersPoints
};
