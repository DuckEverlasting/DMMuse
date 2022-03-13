const { Command } = require("discord.js-commando");

module.exports = class RemoveCommand extends Command {
  constructor(client) {
    super(client, {
      name: "remove-track",
      aliases: ["remove-song", "remove"],
      memberName: "remove-track",
      group: "music",
      description: "Remove track at specified index from the song queue",
      guildOnly: true,
      args: [
        {
          key: "target",
          type: "integer",
          prompt: "Which song would you like to remove?"
        }
      ]
    });
  }
  
  async run(message, { target }) {
    const response = message.guild.jukebox.remove(target)
    return message.say(response);
  }
};
