TODOS
- Add guilds to db
- Guilds will determine which vars/tips/etc makeup the "pool" (assume this bot oculd be used in multiple guilds, even though it prob won't)
- This means for DM'd commands that would be guild specific:
    - check for overlap between user's guilds and client's guilds
    - ask user which guild if there are more than one

 - UPDATE TO DISCORDJS V13!!!
    - Buttons!!!
    - Slash commands!
    - BUTTTTOOOOONNNNNSSSSSS!!!!!!

- Preferred users!
    - GuildOnly commands need not be GuildOnly anymore. Use default guild for user and deny command only if there isn't one.

- Buttons.
- Create "jukebox", which will send a jukebox "message" to you with clickable buttons for play, pause, (volume?) etc.
    - Ideal plan:
    - Sends jukebox in DMs
    - One jukebox per person (deletes old one to make new one)
    - Only admins can use?
    - Once it leaves voice channel, deletes all
    - Updates now playing information, play/pause, volume, loop/shuffle type, etc
    - UI looks like:
    -----------------------
    NOW PLAYING INFORMATION
    ---       ---       ---
    play/     skip     clear
    pause     
    ---       ---       ---
    shuffle   loop     set volume
    on/off   toggle   (text input)
    -----------------------

- Reconfigure a bunch of commands that would be better with buttons
    - Choosing a song from a search term
    - Picking a tip to edit/delete
    - um... that may be it.

- Implement full logging (including errors)