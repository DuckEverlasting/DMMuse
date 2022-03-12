const { Command } = require("discord.js-commando");

module.exports = class Uptime extends Command {
  constructor(client) {
    super(client, {
      name: "uptime",
      aliases: [],
      group: "admin",
      memberName: "uptime",
      description: "Displays how long the bot has been logged into this server.",
    });
  }

  async run(message) {
    const uptimeMs = Date.now() - message.guild.sessionStart;
    const uptimeHr = Math.floor(uptimeMs / (1000 * 60 * 60));
    const uptimeMin = Math.floor((uptimeMs / (1000 * 60)) % 60);
    message.channel.send(`Uptime: ${uptimeHr} hour${uptimeHr == 1 ? 's' : ''}, ${uptimeMin} minute${uptimeMin == 1 ? 's' : ''}`);
  }
};
