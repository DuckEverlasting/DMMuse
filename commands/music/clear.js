const { Command } = require("discord.js-commando");

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
  
  async run(message) {
    message.guild.jukebox.clear(message);
  }
};
