const { SlashCommandBuilder } = require('@discordjs/builders');
const getSongsFromInput = require("../../util/getSongsFromInput");

module.exports = class PlayCommand extends Command {
  constructor(client) {
    super(client, {
      name: "open-stream",
      aliases: ["stream"],
      memberName: "open-stream",
      group: "music",
      description:
        'Open local stream (ONLY WORKS FOR MATT RIGHT NOW).', //To use saved variables, surround them in greater/less than brackets like <this>. Flags are added at the end with the "$" symbol.
      guildOnly: true,
      clientPermissions: ["SPEAK", "CONNECT"],
    });
  }

  async run(interaction) {
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      interaction.reply(
        "I can only play music in voice channels. Join a voice channel and try again."
      );
      return;
    }

    const stream = new StreamResource();
    interaction.guild.jukebox.queue = stream;
    interaction.guild.jukebox.play(stream);
  }
};
