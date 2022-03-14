const { SlashCommandBuilder } = require('@discordjs/builders');
const { getTips } = require("../../data/controllers/tipsController");

module.exports = module.exports = class Strahd extends Command {
  constructor(client) {
    super(client, {
      name: "tips",
      aliases: ["advice"],
      group: "gameplay",
      memberName: "tips",
      description: "Get some good advice.",
    });
  }

  async run(interaction) {
    const lastTip = interaction.guild?.lastTip || "";
    const tips = await getTips().whereNot({ text: lastTip });
    const randIndex = Math.floor(Math.random() * tips.length);
    interaction.channel.send(tips[randIndex].text);
  }
};
