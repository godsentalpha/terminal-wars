export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
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

      const executeCommand = (attacker, target, command) => {
        if (Math.random() < 0.5) {
          const damage = Math.floor(Math.random() * 11) + 10; // 10-20 damage
          target.hp = Math.max(0, target.hp - damage); // Prevent negative HP
          return `${attacker.name} uses ${command} on ${target.name}! It was effective! ${target.name} takes ${damage} damage.`;
        }
        return `${attacker.name} uses ${command} on ${target.name}! It missed!`;
      };

      const logs = [];
      let round = 1;

      while (agents.filter((a) => a.hp > 0).length > 1) {
        logs.push(`--- Round ${round} ---`);
        round++;

        for (const attacker of agents) {
          if (attacker.hp <= 0) continue;

          const targets = agents.filter((a) => a.name !== attacker.name && a.hp > 0);
          if (targets.length === 0) break;

          const target = targets[Math.floor(Math.random() * targets.length)];
          const command = attacker.skills[Math.floor(Math.random() * attacker.skills.length)];
          logs.push(executeCommand(attacker, target, command));

          if (target.hp <= 0) {
            logs.push(`${target.name} has been defeated!`);
          }
        }

        logs.push("\nCurrent HP:");
        agents.forEach((agent) => {
          logs.push(`${agent.name}: ${generateHpBar(agent.hp)}`);
        });
      }

      const winner = agents.find((a) => a.hp > 0);
      logs.push(`\n${winner.name} is the last one standing!`);

      res.status(200).json({ logs });
    } catch (error) {
      console.error("Error in simulation:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
