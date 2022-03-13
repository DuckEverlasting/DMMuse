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
    message.guild.jukebox.skip(message);
  }
};
