const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildMemberAdd",
  async execute(member) {
    try {
      // IDs do .env
      const canalEntrada = member.guild.channels.cache.get(process.env.CANAL_ENTRADA);
      const canalSaida = member.guild.channels.cache.get(process.env.CANAL_SAIDA);
      const cargoGavFiel = process.env.CARGO_GAVIOES_FIEL;

      // =======================
      // ENTRADA
      // =======================
      if (cargoGavFiel) {
        await member.roles.add(cargoGavFiel);
      }

      if (canalEntrada) {
        const embedEntrada = new EmbedBuilder()
          .setTitle("⚫⚪ Bem-vindo(a) aos Gaviões da Fiel! ⚪⚫")
          .setDescription(
            `Olá <@${member.id}>!\nVocê recebeu automaticamente o cargo **Visitante**.\n\n` +
            "📌 Leia as regras e se apresente nos canais oficiais para não perder nada."
          )
          .setColor("#FFFFFF") // branco
          .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
          .addFields(
            { name: "Servidor", value: "Gaviões da Fiel", inline: true },
            { name: "Dica", value: "Participe dos eventos e aproveite a torcida!", inline: true }
          )
          .setImage("https://cdn.discordapp.com/attachments/1318679709474885642/1470263743513362599/image-112-768x419.png?ex=698aa950&is=698957d0&hm=6e5d2c26e8d75c3d83a7f9ac507d6774ca4207f55aafd59135b25d9836b1c56b&") // banner preto e branco (exemplo)
          .setFooter({ text: "Torcida Gaviões da Fiel – FiveM", iconURL: member.guild.iconURL() })
          .setTimestamp();

        await canalEntrada.send({ embeds: [embedEntrada] });
      }

      // =======================
      // SAÍDA
      // =======================
      member.client.on("guildMemberRemove", async (membro) => {
        if (!canalSaida) return;

        const embedSaida = new EmbedBuilder()
          .setTitle("⚫⚪ Um Gavião da Fiel deixou o servidor ⚪⚫")
          .setDescription(`<@${membro.id}> saiu do servidor.`)
          .setColor("#000000") // preto
          .setThumbnail(membro.user.displayAvatarURL({ dynamic: true }))
          .addFields(
            { name: "Sentiremos sua falta!", value: "Esperamos te ver novamente nos Gaviões da Fiel – FiveM!" }
          )
          .setImage("https://cdn.discordapp.com/attachments/1318679709474885642/1470263743513362599/image-112-768x419.png?ex=698aa950&is=698957d0&hm=6e5d2c26e8d75c3d83a7f9ac507d6774ca4207f55aafd59135b25d9836b1c56b&") // banner preto e branco (mesmo do entrada)
          .setFooter({ text: "Torcida Gaviões da Fiel – FiveM", iconURL: membro.guild.iconURL() })
          .setTimestamp();

        await canalSaida.send({ embeds: [embedSaida] });
      });

    } catch (err) {
      console.error("Erro no evento de membros:", err);
    }
  }
};
