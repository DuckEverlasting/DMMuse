const { SlashCommandBuilder } = require("@discordjs/builders");
const getSongsFromInput = require("../../util/getSongsFromInput");

module.exports = class AddCommand extends Command {
    constructor(client) {
        super(client, {
            name: "add-to-queue",
            aliases: ["add", "enqueue"],
            memberName: "add-to-queue",
            group: "music",
            description: "Add song to the queue.",
            guildOnly: true,
            clientPermissions: ["SPEAK", "CONNECT"],
            args: [
                {
                    key: "query",
                    prompt: "What do you want to listen to?",
                    type: "musicrequest",
                },
            ],
        });
    }

    async run(interaction, { query }) {
        const voiceChannel = interaction.member.voice.channel;
        let { input, flags } = query;
        input = input.trim();

        if (!voiceChannel) {
            interaction.reply(
                "I can only play music in voice channels. Join a voice channel and try again."
            );
            return;
        }

        const songs = await getSongsFromInput(interaction, input);
        if (songs) {
            if (!interaction.guild.jukebox.queue.length) {
                interaction.guild.jukebox.enqueue(songs);
                interaction.guild.jukebox.play(interaction);
            } else {
                interaction.guild.jukebox.enqueue(songs);
            }
            interaction.reply(
                `${songs.length ? "Songs" : "Song"} added to queue!`
            );
        }
    }
};
