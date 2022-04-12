// this is the code for the bot 
// this is the token lol OTYyMTA1NzE3MjMyMzg2MTM4.YlCsxg.3r2KcWiaWqqfGcI_KNtWMWcTpzw

const Discord = require('discord.js');
const { REST } = require('discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const commands = [{
    name: 'ping',
    description: 'Replies with Pong!'
}];

const rest = new REST({ version: '9' }).setToken('token');

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands },
        );
    } catch (error) {
        console.error(error);
    }
})();
