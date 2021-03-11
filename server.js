const { prefix } = require("./config.json");
const { token } = require("./config.json");
const { config } = require("dotenv");
const discord = require("discord.js");
const client = new discord.Client({
  disableEveryone: false
});

client.queue = new Map();
client.vote = new Map();
const { ready } = require("./handlers/ready.js")



client.commands = new discord.Collection();
client.aliases = new discord.Collection();

["command"].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});

client.on("message", async message => {
  const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
  if (message.content.match(prefixMention)) {
    return message.reply(`My prefix is \`${prefix}\``);
  }

  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.content.startsWith(prefix)) return;

  if (!message.member)
    message.member = await message.guild.fetchMember(message);

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;

  let command = client.commands.get(cmd);

  if (!command) command = client.commands.get(client.aliases.get(cmd));

  if (command) command.run(client, message, args);
});

// Set the bot's online/idle/dnd/invisible status
client.on("ready", () => {
    client.user.setStatus("online");
    console.log("The bot is online")
});


client.on("ready", () => {
    client.user.setActivity(`${prefix}help in ${client.guilds.cache.size} servers`, { type: "WATCHING"})
})
client.login(token);
