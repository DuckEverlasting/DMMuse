const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'uptime',
    aliases: [],
    slashCommand: new SlashCommandBuilder()
        .setName("uptime")
        .setDescription("Displays how long the bot has been logged into this server."),
    run: async function(interaction) {
        const uptimeMs = Date.now() - interaction.guild.sessionStart;
        const uptimeHr = Math.floor(uptimeMs / (1000 * 60 * 60));
        const uptimeMin = Math.floor((uptimeMs / (1000 * 60)) % 60);
        interaction.channel.send(`Uptime: ${uptimeHr} hour${uptimeHr == 1 ? 's' : ''}, ${uptimeMin} minute${uptimeMin == 1 ? 's' : ''}`);
    }
}
