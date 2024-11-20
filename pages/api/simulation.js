import { Connection, Keypair, Transaction, TransactionInstruction, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";

const agents = [
  { name: "Nyx", hp: 100, skills: ["🌌 shadow_blade", "🌫️ night_mist", "✨ starfall", "🌑 eternal_night", "🌀 dreamweave"] },
  { name: "Erebus", hp: 100, skills: ["🖤 void_touch", "🌒 darkness_spread", "🌘 oblivion_call", "🔗 shadow_bind", "👻 fear_induce"] },
  // Add other agents here
];

const generateHpBar = (hp, maxHp = 100) => {
  const filledBlocks = Math.round((hp / maxHp) * 10);
  const emptyBlocks = 10 - filledBlocks;
  return `HP: [${"■".repeat(filledBlocks)}${"□".repeat(emptyBlocks)}] (${hp}/100)`;
};

const executeCommand = async (attacker, target, command) => {
  if (Math.random() < 0.5) {
    const damage = Math.floor(Math.random() * 11) + 10;
    target.hp = Math.max(0, target.hp - damage);
    return `${attacker.name} uses ${command}! ${command} was effective! ${target.name} takes ${damage} damage.`;
  }
  return `${attacker.name} uses ${command}! ${command} missed!`;
};

export default async function handler(req, res) {
  if (req.method === "GET") {
    let round = 1;
    const logs = [];

    while (agents.filter((a) => a.hp > 0).length > 1) {
      logs.push(`--- Round ${round} ---`);
      round++;

      for (const attacker of agents) {
        if (attacker.hp <= 0) continue;

        const targets = agents.filter((a) => a.name !== attacker.name && a.hp > 0);
        const target = targets[Math.floor(Math.random() * targets.length)];
        const command = attacker.skills[Math.floor(Math.random() * attacker.skills.length)];
        logs.push(await executeCommand(attacker, target, command));

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
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
