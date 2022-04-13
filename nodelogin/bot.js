// this is the code for the bot 
// this is the token lol OTYyMTA1NzE3MjMyMzg2MTM4.YlCsxg.3r2KcWiaWqqfGcI_KNtWMWcTpzw

const Client = require("discord.js");
const client = new Client( { intents: ['GUILDS', 'DIRECT_MESSAGES', 'GUILD_MESSAGES'], partials: ['MESSAGE', 'CHANNEL'] });

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on("messageCreate", msg => {
    console.log(`message received: ${msg.content}`)
    if (msg.content === "ping") {
        msg.reply("pong");
    }
})

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
});

client.login('OTYyMTA1NzE3MjMyMzg2MTM4.YlCsxg.3r2KcWiaWqqfGcI_KNtWMWcTpzw'); // don't share this token
