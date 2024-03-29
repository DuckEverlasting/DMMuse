const { Command } = require("discord.js-commando");
const getSongsFromInput = require("../../util/getSongsFromInput");

module.exports = class PlayCommand extends Command {
  constructor(client) {
    super(client, {
      name: "play-music",
      aliases: ["play", "p"],
      memberName: "play-music",
      group: "music",
      description:
        'Play any song or playlist from Youtube.', //To use saved variables, surround them in greater/less than brackets like <this>. Flags are added at the end with the "$" symbol.
      guildOnly: true,
      clientPermissions: ["SPEAK", "CONNECT"],
      args: [
        {
          key: "query",
          prompt: "What do you want to listen to?",
          type: "musicrequest",
        },
      ],
    });
  }

  async run(message, { query }) {
    const voiceChannel = message.member.voice.channel;
    let { input, flags } = query;
    input = input.trim();

    if (!voiceChannel) {
      message.say(
        "I can only play music in voice channels. Join a voice channel and try again."
      );
      return;
    }

    const songs = await getSongsFromInput(message, input);
    if (songs) {
      message.guild.jukebox.queue = songs;
      message.guild.jukebox.play(message);
    }
  }
};
