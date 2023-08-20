const axios = require("axios");
const {
  addParticipants,
  formatQuestion,
  increasePlayerPoints,
  getAnswerFromIndex,
  gameParticipants,
  playersPoints
} = require("../utils/utils");
const { combinedFilter } = require("../filters/collector_filters");

let isTriviaActive = false;
let questionInterval;
let collectedUserName = "";
const gamePrefix = "!";
let triviaFirstQuestion, questionFormat;

const messageCreate = async (msg) => {
  if (!msg.content.startsWith(gamePrefix) || msg.author.bot) return;
  addParticipants(msg);
  const args = msg.content.slice(gamePrefix.length).trim().split(/ +/);
  const playerCommand = args.shift().toLowerCase();

  if (playerCommand === "trivia" && !isTriviaActive) {
    sendNewQuestion(msg.channel);
    isTriviaActive = true;
    questionInterval = setInterval(() => {
      sendNewQuestion(msg.channel);
    }, 30000);
  } else if (playerCommand === "stop" && isTriviaActive) {
    gameParticipants.delete(collectedUserName);
    clearInterval(questionInterval); //stop the question interval
    isTriviaActive = false;
    msg.channel.send(`${msg.author.username} stopped the game!`);
  } else if (playerCommand === "points" && isTriviaActive) {
    let pointsMessage = "Players Points:\n";
    for (const playerName in playersPoints) {
      if (Object.prototype.hasOwnProperty.call(playersPoints, playerName)) {
        const points = playersPoints[playerName];
        pointsMessage += `${playerName} - ${points} ${
          points > 1 ? "Points" : "Point"
        }`;
      }
    }
    msg.channel.send(pointsMessage);
  }
};

async function sendNewQuestion(channel) {
  try {
    const APIData = await axios.get(
      //"https://opentdb.com/api.php?amount=50&category=15&difficulty=easy&type=multiple"
      "https://opentdb.com/api.php?amount=50"
    );

    triviaFirstQuestion = APIData.data.results[0];
    questionFormat = formatQuestion(triviaFirstQuestion);

    if (questionFormat) {
      channel.send({ embeds: [questionFormat] });
    }
  } catch (e) {
    console.log(`Questions cannot be fetched from API ${e}`);
  }

  //store the correct answer
  const correctAnswer = triviaFirstQuestion.correct_answer;

  //wait for a response

  //create a message collector
  const collector = channel.createMessageCollector({
    filter: combinedFilter.bind(null, channel, gameParticipants),
    time: 15000,
    max: 4
  });
  //wait for user response
  collector.on("collect", (collected) => {
    if (!collected.content) return;
    if (!isTriviaActive) {
      return;
    }
    const userAnswerIndex = collected.content;
    const correctAnswerIndex = getAnswerFromIndex(triviaFirstQuestion);
    collectedUserName = collected.author.username;

    if (userAnswerIndex === correctAnswerIndex) {
      channel.send(
        `${collectedUserName} -> Your answer "${correctAnswer.toLowerCase()}" is correct!`
      );
      collector.stop();
      increasePlayerPoints(collectedUserName);
    } else {
      channel.send(`Wrong answer ${collectedUserName}`);
    }

    // Stop the collector after a response is received
  });

  collector.on("end", (collected, reason) => {
    if (reason === "time") {
      channel.send(
        `Time is up! The correct answer was "${correctAnswer.toLowerCase()}".`
      );
    }
  });
}

module.exports = {
  messageCreate
};
