const { Command } = require("discord.js-commando");

module.exports = class SkipCommand extends Command {
  constructor(client) {
    super(client, {
      name: "skip-track",
      aliases: ["skip-song", "skip", "next-song", "next"],
      memberName: "skip-track",
      group: "music",
      description: "Skip to the next track in the song queue",
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
      return message.say('Um... sorry, looks like there is no song playing right now.');
    }

    dispatcher.end();
  }
};
