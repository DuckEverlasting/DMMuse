const { SlashCommandBuilder } = require('@discordjs/builders');
const { insertTip } = require("../../data/controllers/tipsController");
const addUserIfNew = require('../../util/addUserIfNew');

module.exports = module.exports = class AddTip extends Command {
  constructor(client) {
    super(client, {
      name: "add-tip",
      aliases: ['add-advice', 'give-advice'],
      group: "gameplay",
      memberName: "add-tip",
      description: "Add a tip!",
      args: [
        {
          key: "text",
          type: "string",
          prompt: "What is the tip?"
        }
      ]
    });
  }

  async run(interaction, { text }) {
    await addUserIfNew(interaction.author);
    await insertTip(text, interaction.author.id);
    interaction.channel.send("Added!");
  }
};
