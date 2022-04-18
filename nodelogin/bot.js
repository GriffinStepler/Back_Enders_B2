// this is the code for the bot 
// this is the token lol OTYyMTA1NzE3MjMyMzg2MTM4.YlCsxg.3r2KcWiaWqqfGcI_KNtWMWcTpzw

const {Client, Intents} = require("discord.js");
const client = new Client( { intents: ['GUILDS', 'DIRECT_MESSAGES', 'GUILD_MESSAGES'], partials: ['MESSAGE', 'CHANNEL'] });
// const mysql = require('mysql');  // require mysql

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on("messageCreate", msg => {
  let user = msg.member.user.tag.substring(0, msg.member.user.tag.indexOf('#'));
  let nick = msg.member.displayName;
  let fname = nick.substring(0, nick.indexOf(' ')); // returns first name spliced from beginning to a space
  let lname = nick.substring(nick.indexOf(' ') + 1); // returns the last name spliced from space to end
  console.log(`${fname} ${lname}`);
  console.log(`${nick}: ${msg.content}`);
  msg.embeds.forEach(obj => console.log(obj));
})

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'meeting') {
    await interaction.reply('Creating a meeting!');
  }
});

client.login('OTYyMTA1NzE3MjMyMzg2MTM4.YlCsxg.3r2KcWiaWqqfGcI_KNtWMWcTpzw'); // don't share this token
