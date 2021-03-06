const { Command } = require('discord.js-commando');
const parseFlags = require('../../util/parseFlags');

module.exports = class PauseCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'pause-music',
      aliases: ['pause', 'hold', 'stop'],
      memberName: 'pause-music',
      group: 'music',
      description: 'Pause the current playing song.',
      guildOnly: true,
      args: [
        {
          key: "flags",
          type: "string",
          prompt: "",
          default: ""
        }
      ]
    });
  }

  async run(message, { flags }) {
    flags = parseFlags(flags);
    const dispatcher = message.guild.musicData.songDispatcher;
    if (!dispatcher || dispatcher.busy) { return }
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply('I can only do that if you\'re in a voice channel. Join a channel and try again');

    if (
      typeof dispatcher == 'undefined' ||
      dispatcher == null
    ) {
      return message.say('Um... sorry, looks like there is no song playing right now.');
    }

    message.say('Song paused :pause_button:');

    dispatcher.pause(true);
  }
};