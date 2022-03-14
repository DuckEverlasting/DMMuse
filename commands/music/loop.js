const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = class SkipCommand extends Command {
  constructor(client) {
    super(client, {
      name: "loop-music",
      aliases: ["loop"],
      memberName: "loop-music",
      group: "music",
      description: "Set the music player to repeat either the current song (\"current\") or the entire song queue (\"all\")",
      guildOnly: true,
      args: [
        {
          key: "type",
          type: "string",
          prompt: "",
          default: "toggle",
          oneOf: ["toggle", "current", "all", "none"]
        }
      ]
    });
  }
  
  async run(interaction, { type }) {
    if (type === "toggle") {
      switch(interaction.guild.musicData.loop) {
        case "none":
          type = "current"
          break;
        case "current":
          type = "all"
          break;
        case "all":
          type = "none"
          break;
      }
    }

    interaction.guild.jukebox.loop = type;
    return interaction.reply(`Loop: ${type}`);
  }
};
