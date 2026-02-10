const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

module.exports = {
  customId: "aprovarReprovar",

  async execute(interaction) {
    // Verifica se o usuário tem permissão
    const cargoAprovador = interaction.guild.roles.cache.get(process.env.CARGO_APROVADOR);
    if (!interaction.member.roles.cache.has(cargoAprovador?.id)) {
      return interaction.reply({
        content: "❌ Você não tem permissão para aprovar ou reprovar.",
        ephemeral: true
      });
    }

    const [action, userId, nome, fivemId] = interaction.customId.split("_");

    if (action === "reprovar") {
      const member = await interaction.guild.members.fetch(userId);
      await member.send("❌ Sua setagem foi reprovada.");

      return interaction.update({
        content: "❌ Setagem reprovada.",
        components: []
      });
    }

    if (action === "aprovar") {
      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId(`escolherCargoExtra_${userId}_${nome}_${fivemId}`)
        .setPlaceholder("Escolha o servidor do usuário:")
        .addOptions([
          { label: "🦅 - Fanáticos", value: process.env.CARGO_EXTRA_1 },
          { label: "🦅 - Hoolibras", value: process.env.CARGO_EXTRA_2 }
        ]);

      const row = new ActionRowBuilder().addComponents(selectMenu);

      return interaction.reply({
        content: "Selecione o servidor:",
        components: [row],
        ephemeral: true
      });
    }
  }
};
