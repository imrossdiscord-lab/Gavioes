# Bot base (JavaScript)

Pequeno bot base usando `discord.js`.

Instalação e execução:

```bash
cd bot-starter
npm install
# copie o arquivo de exemplo e defina o token
copy .env.example .env    # no Windows CMD
# ou no PowerShell
Copy-Item .env.example .env
# edite .env e coloque seu token em DISCORD_TOKEN
npm start
```

Coloque comandos em `commands/`. Este repositório não registra comandos no Discord automaticamente — use um deploy script (ou a sua cópia de `deploy-commands.js`) para registrar `slash` commands.
