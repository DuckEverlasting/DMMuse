const { Command } = require('discord.js-commando');
const parseFlags = require('../../util/parseFlags');
const fade = require("../../util/fadeMusic");

module.exports = class PauseCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'change-music-volume',
      aliases: ['volume', 'vol'],
      memberName: 'change-music-volume',
      group: 'music',
      description: 'Change the volume of the current playing song.',
      guildOnly: true,
      args: [
        {
          key: "target",
          type: "float",
          min: 0,
          max: 100,
          prompt: "What would you like to set the volume to? (0 - 100)"
        },
        {
          key: "flags",
          type: "string",
          prompt: "",
          default: ""
        }
      ]
    });
  }

  async run(message, { target, flags }) {
    flags = parseFlags(flags);
    target /= 50;
    console.log(target);
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

    if (flags.has("fade") || flags.has("f")) {
      dispatcher.busy = true;
      await fade(dispatcher, target);
      dispatcher.busy = false;
    } else {
      dispatcher.setVolume(target);
    }

    message.say('Volume set');
  }
};