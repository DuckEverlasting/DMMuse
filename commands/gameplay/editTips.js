const { SlashCommandBuilder } = require('@discordjs/builders');
const { interactionEmbed } = require("discord.js");
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

  async run(interaction) {
    let tips;
    const user = await getUser(interaction.author.id);
    if (user.role == "ADMIN") {
      tips = await getTips();
    } else {
      tips = await getTipsByUser(user.id);
    }
    return this.editTipsDialog(interaction, tips);
  }

  async editTipsDialog(interaction, tips, pointerParam = 0) {
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
    let msgEmbed = await interaction.reply({ embed });

    try {
      const selectTipResponse = await interaction.channel.awaitMessages(
        (msg) => msg.author.id === interaction.author.id,
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
            return this.editTipsDialog(interaction, tips, pointer + 5);
          case "previous":
            msgEmbed.delete();
            return this.editTipsDialog(interaction, tips, pointer - 5);
        }
      } else {
        return interaction.reply("Invalid option, please try again.");
      }
    } catch (err) {
      console.error(err);
      msgEmbed.delete();
      return interaction.reply("Invalid option, please try again.");
    }

    const tipDisplayEmbed = new MessageEmbed()
      .setColor("#fafa32")
      .setTitle('Type "Edit", "Delete", or "Exit"')
      .addField("Current Text", tips[tipIndex].text);
    msgEmbed = await interaction.reply({ embed: tipDisplayEmbed });
    try {
      var selectActionResponse = await interaction.channel.awaitMessages(
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
      return interaction.reply("Invalid option, please try again.");
    }
    switch (selectActionResponse.first().content) {
      case "exit":
        return msgEmbed.delete();
      case "edit":
        return this.handleEditTip(interaction, tips[tipIndex]);
      case "delete":
        return this.handleDeleteTip(interaction, tips[tipIndex]);
    }
  }

  async handleEditTip(interaction, tip) {
    return interaction.reply("Well you can't! It's not implemented yet!");
  }

  async handleDeleteTip(interaction, tip) {
    await removeTip(tip.id);
    return interaction.reply("Tip deleted!");
  }
};
