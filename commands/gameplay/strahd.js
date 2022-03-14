const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = module.exports = class Strahd extends Command {
  constructor(client) {
    super(client, {
      name: "strahd",
      group: "gameplay",
      memberName: "strahd",
      description: "Call upon a bad dude.",
    });
  }

  run(interaction) {
        interaction.channel.send("BLEH!");
  }
};
