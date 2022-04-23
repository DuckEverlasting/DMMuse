const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'uptime',
    slashCommand: new SlashCommandBuilder()
        .setName("uptime")
        .setDescription("Displays how long the bot has been logged into this server."),
    run: async function(interaction) {
        const uptimeMs = interaction.client.uptime;
        const uptimeHr = Math.floor(uptimeMs / (1000 * 60 * 60));
        const uptimeMin = Math.floor((uptimeMs / (1000 * 60)) % 60);
        const uptimeSec = Math.floor((uptimeMs / 1000) % 60);
        interaction.reply(`Uptime: ${uptimeHr} hour${uptimeHr == 1 ? '' : 's'}, ${uptimeMin} minute${uptimeMin == 1 ? '' : 's'}, ${uptimeSec} second${uptimeSec == 1 ? '' : 's'}`);
    }
}
