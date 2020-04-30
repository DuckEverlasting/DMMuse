const { Command } = require('discord.js-commando');
const parseFlags = require('../../util/parseFlags');
const fade = require("../../util/fadeMusic");

module.exports = class ResumeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'resume-music',
      aliases: ['resume', 'continue'],
      memberName: 'resume',
      group: 'music',
      description: 'Resume the current paused song',
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
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply('I can only do that if you\'re in a voice channel. Join a channel and try again');
  
    if (
      typeof dispatcher == 'undefined' ||
      dispatcher === null
    ) {
      return message.reply('Um... sorry, looks like there is no song paused right now.');
    }

    message.say('Song resumed :play_pause:');

    if (flags.has("fade")) {
      const prevVolume = dispatcher.volume;
      await dispatcher.setVolume(0);
      await dispatcher.resume();
      await fade(dispatcher, prevVolume);
    } else {
      dispatcher.resume();
    }
    

    
  }
};