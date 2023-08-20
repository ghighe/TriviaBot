function ignoreBotMessages(message, channel) {
  return !message.author.bot && message.channel.id === channel.id;
}

function joinedParticipants(message, gameParticipants) {
  return gameParticipants.has(message.author.username);
}

const collectMultipleMessages = (message, gameParticipants) => {
  const userAnswerIndex = parseInt(message.content);
  return (
    !isNaN(userAnswerIndex) &&
    userAnswerIndex >= 1 &&
    userAnswerIndex <= 4 &&
    gameParticipants.has(message.author.username)
  );
};

function combinedFilter(channel, gameParticipants, message) {
  return (
    ignoreBotMessages(message, channel) &&
    joinedParticipants(message, gameParticipants) &&
    collectMultipleMessages(message, gameParticipants)
  );
}

module.exports = {
  combinedFilter
};
