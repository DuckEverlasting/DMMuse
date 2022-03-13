const { Command } = require("discord.js-commando");

module.exports = module.exports = class Strahd extends Command {
  constructor(client) {
    super(client, {
      name: "strahd",
      group: "gameplay",
      memberName: "strahd",
      description: "Call upon a bad dude.",
    });
  }

  run(message) {
        message.channel.send("BLEH!");
  }
};
