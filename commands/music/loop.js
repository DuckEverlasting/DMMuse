const { Command } = require("discord.js-commando");

module.exports = class SkipCommand extends Command {
  constructor(client) {
    super(client, {
      name: "loop-music",
      aliases: ["loop"],
      memberName: "loop-music",
      group: "music",
      description: "Set the music player to repeat either the current song (\"current\") or the entire song queue (\"all\")",
      guildOnly: true,
      args: [
        {
          key: "type",
          type: "string",
          prompt: "",
          default: "toggle",
          oneOf: ["toggle", "current", "all", "none"]
        }
      ]
    });
  }
  
  async run(message, { type }) {
    if (type === "toggle") {
      switch(message.guild.musicData.loop) {
        case "none":
          type = "current"
          break;
        case "current":
          type = "all"
          break;
        case "all":
          type = "none"
          break;
      }
    }

    message.guild.musicData.loop = type;

    return message.say(`Loop: ${type}`);
  }
};
