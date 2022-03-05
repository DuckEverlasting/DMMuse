const { Command } = require("discord.js-commando");
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

  async run(message) {
    const tips = await getTips().whereNot({ text: message.guild.lastTip });
    const randIndex = Math.floor(Math.random() * tips.length);
    message.channel.send(tips[randIndex].text);
  }
};
