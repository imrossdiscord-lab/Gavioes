const { EmbedBuilder } = require("discord.js");

module.exports = {
  customId: "escolherCargoExtra",

  async execute(interaction) {
    try {
      const [_, userId, nome, fivemId] = interaction.customId.split("_");
      const member = await interaction.guild.members.fetch(userId);

      // ===== RESPONDE IMEDIATAMENTE E REMOVE SELECT MENU =====
      await interaction.update({ content: "✅ Servidor selecionado e setagem finalizada!", components: [] });

      // ===== REMOVE CARGO ANTIGO =====
      const cargoParaRemover = process.env.CARGO_REMOVER;
      if (member.roles.cache.has(cargoParaRemover)) await member.roles.remove(cargoParaRemover);

      // ===== CARGOS EXTRAS =====
      const cargoExtra1 = process.env.CARGO_EXTRA_1;
      const cargoExtra2 = process.env.CARGO_EXTRA_2;
      const cargoEscolhido = interaction.values[0];

      // Remove ambos os extras antes de adicionar o escolhido
      for (const cargo of [cargoExtra1, cargoExtra2]) {
        if (member.roles.cache.has(cargo)) await member.roles.remove(cargo);
      }
      await member.roles.add(cargoEscolhido);

      // ===== CARGOS FIXOS =====
      const cargosFixos = [process.env.CARGO_FIXO_1, process.env.CARGO_FIXO_2, process.env.CARGO_FIXO_3];
      for (const cargo of cargosFixos) await member.roles.add(cargo);

      // ===== NICKNAME =====
      const prefixo = "S GDF |";
      let novoNick = `${prefixo} ${nome} | ${fivemId}`;
      if (novoNick.length > 32) novoNick = novoNick.slice(0, 32);
      await member.setNickname(novoNick);

      // ===== ATUALIZA EMBED DE LOGS =====
      const canalLogs = interaction.guild.channels.cache.get(process.env.CANAL_LOGS);
      if (canalLogs) {
        const mensagens = await canalLogs.messages.fetch({ limit: 50 });
        const mensagemLogs = mensagens.find(
          m => m.embeds.length > 0 && m.embeds[0].description?.includes(`<@${userId}>`)
        );

        if (mensagemLogs) {
          const embedAtualizada = EmbedBuilder.from(mensagemLogs.embeds[0])
            .setColor("#000000")
            .addFields(
              { name: "Status", value: "✅ Aprovado", inline: true },
              { name: "Aprovado por", value: `<@${interaction.user.id}>`, inline: true }
            )
            .setFooter({
              text: `Servidor escolhido: ${interaction.guild.roles.cache.get(cargoEscolhido)?.name || "N/A"}`
            });

          // Remove todos os componentes (botões e select menu)
          await mensagemLogs.edit({ embeds: [embedAtualizada], components: [] });
        }
      }

      // ===== ENVIA DM COM LINK DO WHATSAPP =====
      let linkGrupo = "";
      if (cargoEscolhido === process.env.CARGO_EXTRA_1) linkGrupo = process.env.LINK_WHATSAPP_FANATICOS;
      else if (cargoEscolhido === process.env.CARGO_EXTRA_2) linkGrupo = process.env.LINK_WHATSAPP_HOOLIBRAS;

      await member.send(
        `✅ Olá ${nome}, sua setagem foi aprovada!\n` +
        `🎉 Bem-vindo(a) à gaviões!\n` +
        `🔗 Link do grupo do WhatsApp: ${linkGrupo}`
      );

    } catch (err) {
      console.error("ERRO SETAGEM:", err);
      if (!interaction.replied) {
        await interaction.followUp({
          content: "❌ Ocorreu um erro ao processar a setagem.",
          ephemeral: true
        });
      }
    }
  }
};
