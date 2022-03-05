const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");
const {
  getTips,
  getTipsByUser,
  updateTip,
  removeTip,
} = require("../../data/controllers/tipsController");
const { getUser } = require("../../data/controllers/usersController");

module.exports = module.exports = class EditTips extends Command {
  constructor(client) {
    super(client, {
      name: "edit-tips",
      aliases: ["edit-my-tips", "delete-tips", "delete-my-tips"],
      group: "gameplay",
      memberName: "edit-tips",
      description: "Get some good advice.",
    });
  }

  async run(message) {
    let tips;
    const user = await getUser(message.author.id);
    if (user.role == "ADMIN") {
      tips = await getTips();
    } else {
      tips = await getTipsByUser(user.id);
    }
    return this.editTipsDialog(message, tips);
  }

  async editTipsDialog(message, tips, pointerParam = 0) {
    let pointer = pointerParam;
    let tipIndex;
    const acceptableResponses = ['exit'];
    const embed = new MessageEmbed()
      .setColor("#fafa32")
      .setTitle(
        'Comment the number of the tip you want \n(Or say "next", "previous", or "exit")'
      );
    for (let i = pointer; i < pointer + 5; i++) {
      if (tips[i]) {
        const tipPreview =
          tips[i].text.length < 50
            ? tips[i].text
            : tips[i].text.substring(0, 49) + "...";
        embed.addField((i + 1).toString(), tipPreview);
      }
    }
    if (pointer > 0) {
        acceptableResponses.push("previous");
    }
    if (pointer + 5 < tips.length) {
        acceptableResponses.push("next");
    }
    let msgEmbed = await message.say({ embed });

    try {
      const selectTipResponse = await message.channel.awaitMessages(
        (msg) => msg.author.id === message.author.id,
        {
          max: 1,
          maxProcessed: 1,
          time: 60000,
          errors: ["time"],
        }
      );
      const tipSelection = selectTipResponse.first().content;
      if (tipSelection > pointer && tipSelection < pointer + 5) {
        tipIndex = parseInt(selectTipResponse.first().content) - 1;
      } else if (acceptableResponses.includes(tipSelection)) {
        switch (selectTipResponse.first().content) {
          case "exit":
            return msgEmbed.delete();
          case "next":
            msgEmbed.delete();
            return this.editTipsDialog(message, tips, pointer + 5);
          case "previous":
            msgEmbed.delete();
            return this.editTipsDialog(message, tips, pointer - 5);
        }
      } else {
        return message.say("Invalid option, please try again.");
      }
    } catch (err) {
      console.error(err);
      msgEmbed.delete();
      return message.say("Invalid option, please try again.");
    }

    const tipDisplayEmbed = new MessageEmbed()
      .setColor("#fafa32")
      .setTitle('Type "Edit", "Delete", or "Exit"')
      .addField("Current Text", tips[tipIndex].text);
    msgEmbed = await message.say({ embed: tipDisplayEmbed });
    try {
      var selectActionResponse = await message.channel.awaitMessages(
        (msg) => ["edit", "delete", "exit"].includes(msg.content.toLowerCase()),
        {
          max: 1,
          maxProcessed: 1,
          time: 60000,
          errors: ["time"],
        }
      );
    } catch {
      console.error(err);
      msgEmbed.delete();
      return message.say("Invalid option, please try again.");
    }
    switch (selectActionResponse.first().content) {
      case "exit":
        return msgEmbed.delete();
      case "edit":
        return this.handleEditTip(message, tips[tipIndex]);
      case "delete":
        return this.handleDeleteTip(message, tips[tipIndex]);
    }
  }

  async handleEditTip(message, tip) {
    return message.say("Well you can't! It's not implemented yet!");
  }

  async handleDeleteTip(message, tip) {
    await removeTip(tip.id);
    return message.say("Tip deleted!");
  }
};
