const { Command } = require("discord.js-commando");
const { insertTip } = require("../../data/controllers/tipsController");
const addUserIfNew = require('../../util/addUserIfNew');

module.exports = class Remind extends Command {
  constructor(client) {
    super(client, {
      name: "remind",
      aliases: ['remind-me'],
      group: "miscellaneous",
      memberName: "remind",
      description: "Set up a reminder (or a series of them)",
    });
  }

  async run(message) {
    message.say("Not yet implemented!");
  }
};
