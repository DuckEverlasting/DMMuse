const { Command } = require("discord.js-commando");

module.exports = class ClearCommand extends Command {
  constructor(client) {
    super(client, {
      name: "clear-queue",
      aliases: ["clear", "skip-all"],
      memberName: "clear-queue",
      group: "music",
      description: "Stop music playback and clear the queue.",
      guildOnly: true,
    });
  }
  
  async run(message) {
    const dispatcher = message.guild.musicData.songDispatcher;
    if (dispatcher.busy) { return }
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply('I can only do that if you\'re in a voice channel. Join a channel and try again');

    if (
      typeof dispatcher == 'undefined' ||
      dispatcher == null
    ) {
      return message.say('Um... sorry, looks like there is no song playing right now');
    }

    message.guild.musicData.queue.length = 0;
    dispatcher.end();
    return message.say('Queue cleared');
  }
};
