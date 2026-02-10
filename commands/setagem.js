const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setagem")
    .setDescription("Envia a embed de setagem com o botão"),

  async execute(interaction) {
    // ID do cargo que terá permissão
    const cargoPermitidoId = "1461138083629105418"; // substitua pelo ID real do cargo

    // Verifica se o membro tem o cargo
    if (!interaction.member.roles.cache.has(cargoPermitidoId)) {
      return interaction.reply({
        content: "❌ Você não tem permissão para usar este comando.",
        ephemeral: true
      });
    }

    // Embed que será enviada
    const embed = new EmbedBuilder()
      .setTitle("📋 Setagem - Gaviões")
      .setDescription("Clique no botão abaixo para iniciar sua setagem.")
      .setColor("Gold");

    // Botão da embed
    const botao = new ButtonBuilder()
      .setCustomId("iniciar_setagem")
      .setLabel("Iniciar Setagem")
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(botao);

    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: false
    });
  }
};
