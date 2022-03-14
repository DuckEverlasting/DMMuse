const { SlashCommandBuilder } = require('@discordjs/builders');

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
  
  async run(interaction) {
    interaction.guild.jukebox.skip(interaction);
  }
};
