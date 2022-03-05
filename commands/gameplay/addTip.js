const { Command } = require("discord.js-commando");
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

  async run(message, { text }) {
    await addUserIfNew(message.author);
    await insertTip(text, message.author.id);
    message.channel.send("Added!");
  }
};
