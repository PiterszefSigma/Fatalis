const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const commands = [
  new SlashCommandBuilder()
    .setName("panel")
    .setDescription("Wyświetla panel weryfikacji")
];

client.once("ready", () => {
  console.log(`Fatalis online jako ${client.user.tag}`);
});

client.on("interactionCreate", async interaction => {
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === "panel") {
      const embed = new EmbedBuilder()
        .setColor("#5865F2")
        .setTitle("FATALIS SECURITY")
        .setDescription(
          "Witaj na serwerze!\n\n" +
          "Kliknij przycisk poniżej, aby przejść weryfikację."
        )
        .setFooter({ text: "Fatalis Verification System" });

      const button = new ButtonBuilder()
        .setCustomId("fatalis_verify")
        .setLabel("Zweryfikuj się")
        .setEmoji("🛡️")
        .setStyle(ButtonStyle.Primary);

      const row = new ActionRowBuilder().addComponents(button);

      await interaction.reply({
        embeds: [embed],
        components: [row]
      });
    }
  }

  if (interaction.isButton()) {
    if (interaction.customId === "fatalis_verify") {
const roleId = "1547004511413862400"; // tutaj wklej VERIFIED_ROLE_ID

      if (!roleId) {
        return interaction.reply({
          content: "Administrator nie skonfigurował roli weryfikacji.",
          ephemeral: true
        });
      }

      try {
        const role = await interaction.guild.roles.fetch(roleId);

        if (!role) throw new Error("Nie znaleziono roli.");

        await interaction.member.roles.add(role);

        await interaction.reply({
          content: "✅ Pomyślnie zweryfikowano!",
          ephemeral: true
        });
      } catch (error) {
        console.error(error);

        await interaction.reply({
          content: "Nie udało się nadać roli. Skontaktuj się z administratorem.",
          ephemeral: true
        });
      }
    }
  }
});

async function start() {
  const token = "MTU2Njc4NDM5ODQ3OTU5NzYxOQ.GEdMur.6_QGo2D-jFY75DOwSojKQ3KFrrfg6OOzJltzyM";
  const clientId = "1566784398479597619"; 
  const guildId = "1547003016995934218";

  if (!token || !clientId || !guildId) {
    throw new Error("Brakuje wymaganych zmiennych środowiskowych.");
  }

  const rest = new REST({ version: "10" }).setToken(token);

  await rest.put(
    Routes.applicationGuildCommands(clientId, guildId),
    { body: commands.map(command => command.toJSON()) }
  );

  await client.login(token);
}

start().catch(console.error);
