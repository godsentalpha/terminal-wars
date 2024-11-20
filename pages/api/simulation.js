const bs58 = require("bs58");
const {
  Connection,
  Keypair,
  Transaction,
  TransactionInstruction,
  PublicKey,
} = require("@solana/web3.js");

// Function to generate an HP bar
const generateHpBar = (hp, maxHp = 100) => {
  const filledBlocks = Math.round((hp / maxHp) * 10); // Divide HP into 10 segments
  const emptyBlocks = 10 - filledBlocks;
  return `HP: [${"■".repeat(filledBlocks)}${"□".repeat(emptyBlocks)}] (${hp}/100)`;
};

// Define agents with their skills
const agents = [
  { name: "Nyx", hp: 100, skills: ["🌌 shadow_blade", "🌫️ night_mist", "✨ starfall", "🌑 eternal_night", "🌀 dreamweave"] },
  { name: "Erebus", hp: 100, skills: ["🖤 void_touch", "🌒 darkness_spread", "🌘 oblivion_call", "🔗 shadow_bind", "👻 fear_induce"] },
  { name: "Cents", hp: 100, skills: ["💰 coin_toss", "💵 currency_crush", "💎 wealth_wave", "⚡ silver_strike", "💸 dollar_doom"] },
  { name: "Bully", hp: 100, skills: ["💢 push", "😈 mockery", "🤜 intimidate", "🔨 shove", "💥 brawl"] },
  { name: "MemesAI", hp: 100, skills: ["😂 viral_injection", "🎉 meme_blast", "📸 gif_barrage", "🖊️ caption_slash", "🤣 laugh_riot"] },
  { name: "Shoggoth", hp: 100, skills: ["🌀 tentacle_smash", "🗣️ eldritch_screech", "🌊 madness_wave", "🫴 depth_grasp", "🐙 abyssal_roar"] },
  { name: "Forest", hp: 100, skills: ["🍃 vine_whip", "🌿 root_snare", "🪵 bark_shield", "🌳 nature's_wrath", "🍂 leaf_storm"] },
  { name: "Spence", hp: 100, skills: ["⚡ speed_strike", "🛡️ force_field", "💥 energy_blast", "🎯 pulse_wave", "🔪 focus_blade"] },
  { name: "GOAT", hp: 100, skills: ["🐏 headbutt", "🐐 mountain_kick", "🔱 horn_charge", "🏔️ legendary_leap", "🍀 graze_smash"] },
  { name: "Zerebro", hp: 100, skills: ["🧠 mind_control", "🌀 psychic_wave", "💥 thought_blast", "🌌 telekinetic_crush", "✨ cosmic_focus"] },
];

// Function to simulate a command being executed
const executeCommand = (attacker, target, command) => {
  console.log(`${attacker.name} uses ${command} on ${target.name}!`);
  return new Promise((resolve) => {
    setTimeout(() => {
      if (Math.random() < 0.5) {
        const damage = Math.floor(Math.random() * 11) + 10; // 10-20 damage
        target.hp = Math.max(0, target.hp - damage); // Prevent negative HP
        console.log(`${command} was effective! ${target.name} takes ${damage} damage.`);
        resolve(true);
      } else {
        console.log(`${command} missed!`);
        resolve(false);
      }
    }, 1500);
  });
};

// Function to send a Solana memo transaction
const sendMemoTransaction = async () => {
  console.log("\nThe battle has ended. Sending Solana memo transaction...");

  const connection = new Connection("https://api.mainnet-beta.solana.com");

  const base58PrivateKey = "YOUR PRIVATE-KEY";
  const privateKey = bs58.decode(base58PrivateKey);
  const sender = Keypair.fromSecretKey(privateKey);

  const memoMessage = `
       ,     ,
       |\\---/|
      /  , , | ._ 
   __| _ |  _ |__|
  /  |  \\|/  |   |
 |               |
  \\  (o)    (o)  /
   |   .vvvvv.   |
    \\__|IIIIIII|__/
     | \\IIIIIII/ |
     \\          /
      \`--------\`
  `;

  const memoInstruction = new TransactionInstruction({
    keys: [],
    programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
    data: Buffer.from(memoMessage, "utf-8"),
  });

  const transaction = new Transaction().add(memoInstruction);
  try {
    const signature = await connection.sendTransaction(transaction, [sender]);
    console.log(`Transaction sent with signature: ${signature}`);
    console.log(`View the transaction at: https://explorer.solana.com/tx/${signature}`);
  } catch (error) {
    console.error("Error sending transaction:", error);
  }
};

// Main battle loop
const terminalWar = async () => {
  let round = 1;

  while (agents.filter((a) => a.hp > 0).length > 1) { // Continue until only one agent is left
    console.log(`\n--- Round ${round} ---`);
    round++;

    // Each agent takes a turn
    for (const attacker of agents) {
      if (attacker.hp <= 0) continue; // Skip defeated agents

      const targets = agents.filter((a) => a.name !== attacker.name && a.hp > 0);
      if (targets.length === 0) {
        console.log(`${attacker.name} is the last one standing!`);
        await sendMemoTransaction();
        return;
      }

      const target = targets[Math.floor(Math.random() * targets.length)];

      const command = attacker.skills[Math.floor(Math.random() * attacker.skills.length)];
      await executeCommand(attacker, target, command);

      if (target.hp <= 0) {
        console.log(`${target.name} has been defeated!`);
      }
    }

    // Display HP status of all agents
    console.log("\nCurrent HP:");
    agents.forEach((agent) => {
      console.log(`${agent.name}: ${generateHpBar(agent.hp)}`);
    });

    if (agents.filter((a) => a.hp > 0).length === 1) {
      const winner = agents.find((a) => a.hp > 0);
      console.log(`\n${winner.name} is the last one standing!`);
      await sendMemoTransaction();
      return;
    }
  }
};

// Start the battle
terminalWar();
