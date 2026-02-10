require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Client, Collection, GatewayIntentBits } = require("discord.js");

// Criação do client com a intent de membros habilitada
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers // 🔥 Necessário para guildMemberAdd
  ]
});

// Coleções para comandos e botões
client.commands = new Collection();
client.buttons = new Collection();

// Função para carregar arquivos de uma pasta
const loadFiles = (folder) => {
  return fs.readdirSync(folder).filter(file => file.endsWith(".js"));
};

// Carregar comandos
for (const file of loadFiles("./commands")) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// Carregar botões
for (const file of loadFiles("./buttons")) {
  const button = require(`./buttons/${file}`);
  client.buttons.set(button.customId || button.id, button); // customId ou id
}

// Carregar eventos
for (const file of loadFiles("./events")) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// Login do bot
client.login(process.env.TOKEN);
