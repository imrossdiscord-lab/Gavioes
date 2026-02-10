const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const emSetagem = new Set();

module.exports = {
  customId: "iniciar_setagem",

  async execute(interaction) {
    if (emSetagem.has(interaction.user.id)) {
      return interaction.reply({ content: "⚠️ Você já está em uma setagem.", ephemeral: true });
    }

    emSetagem.add(interaction.user.id);

    // cria canal privado
    const canal = await interaction.guild.channels.create({
      name: process.env.NOME_CANAL_SETAGEM,
      type: 0, // texto
      permissionOverwrites: [
        { id: interaction.guild.id, deny: ["ViewChannel"] },
        { id: interaction.user.id, allow: ["ViewChannel", "SendMessages", "AttachFiles", "ReadMessageHistory"] }
      ]
    });

    await interaction.reply({
      content: `✅ Seu canal foi criado: ${canal}`,
      ephemeral: true
    });

    const perguntas = [
      "Qual é o seu **nick**?",
      "Qual é seu **ID do FiveM**?",
      "Qual é sua **idade**?",
      "Informe seu **telefone (Nárnia)**",
      "Quem foi seu **recrutador**?",
      "Em qual **servidor** você joga?",
      "Envie a **prova de manto (imagem mostrando manto, rosto e tela do pc)**"
    ];

    const respostas = [];
    let perguntaAtual = 0;

    await canal.send(perguntas[perguntaAtual]);

    const collector = canal.createMessageCollector({
      filter: m => m.author.id === interaction.user.id,
      time: 300000 // 5 minutos
    });

    collector.on("collect", async msg => {
      // última pergunta (imagem)
      if (perguntaAtual === 6) {
        const attachment = msg.attachments.first();
        if (!attachment) return msg.reply("❌ Envie **uma imagem** como prova de manto.");
        respostas.push(attachment.url);
        collector.stop();
        return;
      }

      respostas.push(msg.content);
      perguntaAtual++;
      await canal.send(perguntas[perguntaAtual]);
    });

    collector.on("end", async () => {
      const canalLogs = interaction.guild.channels.cache.get(process.env.CANAL_LOGS);
      if (!canalLogs) return console.log("❌ Canal de logs não encontrado!");

      const embed = new EmbedBuilder()
        .setTitle("📝 Nova Setagem - Gaviões")
        .setColor("Gold")
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
        .setDescription(`Setagem enviada por <@${interaction.user.id}>`)
        .addFields(
          { name: "Nome", value: respostas[0] || "N/A" },
          { name: "ID FiveM", value: respostas[1] || "N/A" },
          { name: "Idade", value: respostas[2] || "N/A" },
          { name: "Telefone", value: respostas[3] || "N/A" },
          { name: "Recrutador", value: respostas[4] || "N/A" },
          { name: "Servidor", value: respostas[5] || "N/A" }
        );

      if (respostas[6]) embed.setImage(respostas[6]);

      // Botões Aprovar/Reprovar, agora com ID do FiveM
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`aprovar_${interaction.user.id}_${respostas[0]}_${respostas[1]}`)
          .setLabel("Aprovar")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId(`reprovar_${interaction.user.id}`)
          .setLabel("Reprovar")
          .setStyle(ButtonStyle.Danger)
      );

      await canalLogs.send({ embeds: [embed], components: [row] });

      emSetagem.delete(interaction.user.id);
      await canal.send("✅ Setagem finalizada. Este canal será apagado em 10 segundos.");
      setTimeout(() => canal.delete(), 10000);
    });
  }
};
