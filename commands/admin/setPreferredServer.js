const { Command } = require("discord.js-commando");
const { setPreferredServer } = require("../../data/controllers/usersController");
const addUserIfNew = require('../../util/addUserIfNew');

module.exports = module.exports = class SetPreferredServer extends Command {
  constructor(client) {
    super(client, {
      name: "set-preferred-server",
      group: "admin",
      memberName: "set-preferred-server",
      description: "Set preferred server for this user.",
      args: [
        {
          key: "serverName",
          type: "string",
          prompt: "What is the name of your preferred server?"
        }
      ]
    });
  }

  async run(message, { serverName }) {
    await addUserIfNew(message.author);
    const guild = message.client.guilds.cache.find(g => g.name == serverName);
    if (guild) {
        await setPreferredServer(message.author.id, guild.id);
        message.say("Preferred server set!");
    } else {
        message.say("Sorry, I'm not a member of any server with that name.");
    }
  }
};
