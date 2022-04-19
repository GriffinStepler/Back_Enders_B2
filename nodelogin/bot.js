// this is the code for the bot 
// this is the token lol OTYyMTA1NzE3MjMyMzg2MTM4.YlCsxg.3r2KcWiaWqqfGcI_KNtWMWcTpzw

const {Client, Intents} = require("discord.js");
const client = new Client( { intents: ['GUILDS', 'DIRECT_MESSAGES', 'GUILD_MESSAGES'], partials: ['MESSAGE', 'CHANNEL'] });
// const mysql = require('mysql');  // require mysql

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

// 
client.on("messageCreate", msg => {
  let user = msg.member.user.tag.substring(0, msg.member.user.tag.indexOf('#')); // username until the hash
  let nick = msg.member.displayName;
  // let fname = nick.substring(0, nick.indexOf(' ')); // returns first name spliced from beginning to a space
  // let lname = nick.substring(nick.indexOf(' ') + 1); // returns the last name spliced from space to end
  // console.log(`${fname} ${lname}`);
  console.log(`${nick}: ${msg.content}`);
  // msg.embeds.forEach(obj => console.log(obj));
  // splice from embedded the name of the user who sent the request, then tell the user the bot added the
  // meeting to the database

  // check who messages are sent from, collect message from sesh
  if (user == 'sesh') {
    console.log('sesh message captured, commensing operations');

    // take embed contents, log to console
    msg.embeds.forEach(obj => console.log(obj));

    // parse out meeting creator
    // this crashes the bot for some reason? 
    let MessageEmbed = msg.embeds[0];
    let prune1 = MessageEmbed.footer.text.substring(MessageEmbed.footer.text.indexOf('|') + 1); // prunes "RSVP"
    let prune2 = prune1.substring(prune1.indexOf('|') + 1); // prunes "Settings"
    let creatorFullName = prune2.substring(prune2.indexOf('y') + 2); // this should yield solely the name following "Created by"
    console.log(`Meeting Creator: ${creatorFullName}`);

    // log the meeting date to the database tied to the creator's ID


    msg.reply(`Added this event to your calendar!`);
  }
})

// command structure
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'meeting') {
    await interaction.reply('Creating a meeting!');
  }
});

client.login('OTYyMTA1NzE3MjMyMzg2MTM4.YlCsxg.3r2KcWiaWqqfGcI_KNtWMWcTpzw'); // don't share this token
