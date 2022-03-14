const { SlashCommandBuilder } = require('@discordjs/builders');
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

  async run(interaction, { query }) {
    const voiceChannel = interaction.member.voice.channel;
    let { input, flags } = query;
    input = input.trim();

    if (!voiceChannel) {
      interaction.reply(
        "I can only play music in voice channels. Join a voice channel and try again."
      );
      return;
    }

    const songs = await getSongsFromInput(interaction, input);
    if (songs) {
      interaction.guild.jukebox.queue = songs;
      interaction.guild.jukebox.play(interaction);
    }
  }
};
