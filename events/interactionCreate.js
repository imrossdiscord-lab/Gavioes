module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    try {
      if (interaction.isButton()) {
        // Botão iniciar setagem
        if (interaction.customId === "iniciar_setagem") {
          const iniciarSetagem = require("../buttons/iniciarSetagem");
          await iniciarSetagem.execute(interaction);
          return;
        }

        // Botões Aprovar / Reprovar
        if (interaction.customId.startsWith("aprovar") || interaction.customId.startsWith("reprovar")) {
          const aprovarReprovar = require("../buttons/aprovarReprovar");
          await aprovarReprovar.execute(interaction);
          return;
        }
      }

      if (interaction.isStringSelectMenu()) {
        // Menu de seleção de cargo extra
        if (interaction.customId.startsWith("escolherCargoExtra")) {
          const escolherCargoExtra = require("../buttons/escolherCargoExtra");
          await escolherCargoExtra.execute(interaction);
          return;
        }
      }

      if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);
        if (command) await command.execute(interaction);
        return;
      }
    } catch (error) {
      console.error("Erro na interação:", error);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ content: "❌ Ocorreu um erro ao processar a interação.", ephemeral: true });
      }
    }
  }
};
