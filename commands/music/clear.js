const { SlashCommandBuilder } = require('@discordjs/builders');

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
  
  async run(interaction) {
    interaction.guild.jukebox.clear(interaction);
  }
};
