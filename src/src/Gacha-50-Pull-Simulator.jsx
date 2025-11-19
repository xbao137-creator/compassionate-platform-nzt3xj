import React, { useState, useEffect } from "react";

// Gacha-50-Pull-Simulator.jsx
// 扭蛋机 50 连抽模拟器

const RARITIES = [
  { id: "SSR", chance: 0.03, color: "text-yellow-400", emoji: "🌟" },
  { id: "SR", chance: 0.12, color: "text-purple-400", emoji: "✨" },
  { id: "R", chance: 0.85, color: "text-gray-300", emoji: "🔹" },
];

function pickRarity() {
  const p = Math.random();
  let cum = 0;
  for (const r of RARITIES) {
    cum += r.chance;
    if (p <= cum) return r;
  }
  return RARITIES[RARITIES.length - 1];
}

// 示例奖池
const POOL = {
  SSR: [
    { name: "赤焰王", id: "ssr1" },
    { name: "月影姬", id: "ssr2" },
    { name: "天启使者", id: "ssr3" },
  ],
  SR: [
    { name: "疾风骑士", id: "sr1" },
    { name: "冰霜术士", id: "sr2" },
    { name: "光辉祭司", id: "sr3" },
    { name: "秘术游侠", id: "sr4" },
  ],
  R: [
    { name: "步兵", id: "r1" },
    { name: "弓手", id: "r2" },
    { name: "魔导士学徒", id: "r3" },
    { name: "盾卫", id: "r4" },
    { name: "斥候", id: "r5" },
  ],
};

function pickItemByRarity(rarityId) {
  const pool = POOL[rarityId];
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function Gacha50Pulls() {
  const [results, setResults] = useState([]);
  const [isRolling, setIsRolling] = useState(false);
  const [animationIndex, setAnimationIndex] = useState(-1);
  const [summary, setSummary] = useState({ SSR: 0, SR: 0, R: 0 });

  useEffect(() => {
    if (animationIndex >= 0 && animationIndex < results.length) {
      const t = setTimeout(() => setAnimationIndex(animationIndex + 1), 80);
      return () => clearTimeout(t);
    }
    if (animationIndex === results.length) {
      setIsRolling(false);
      setAnimationIndex(-1);
    }
  }, [animationIndex, results.length]);

  function singlePull() {
    const r = pickRarity();
    const item = pickItemByRarity(r.id);
    return { ...item, rarity: r.id, emoji: r.emoji, color: r.color };
  }

  function do50Pulls() {
    if (isRolling) return;
    setIsRolling(true);
    setResults([]);
    setSummary({ SSR: 0, SR: 0, R: 0 });

    const temp = [];
    let hasSRplus = false;

    for (let i = 0; i < 50; i++) {
      const item = singlePull();
      if (item.rarity !== "R") hasSRplus = true;
      temp.push(item);
    }

    if (!hasSRplus) {
      const idx = Math.floor(Math.random() * 50);
      const replacement = pickItemByRarity("SR");
      temp[idx] = {
        ...replacement,
        rarity: "SR",
        emoji: "✨",
        color: "text-purple-400",
      };
    }

    const s = { SSR: 0, SR: 0, R: 0 };
    temp.forEach((it) => s[it.rarity]++);
    setSummary(s);

    setResults(temp);
    setTimeout(() => setAnimationIndex(0), 300);
  }

  function quick50Pulls() {
    if (isRolling) return;
    const temp = [];
    let hasSRplus = false;
    for (let i = 0; i < 50; i++) {
      const item = singlePull();
      if (item.rarity !== "R") hasSRplus = true;
      temp.push(item);
    }

    if (!hasSRplus) {
      const idx = Math.floor(Math.random() * 50);
      const replacement = pickItemByRarity("SR");
      temp[idx] = {
        ...replacement,
        rarity: "SR",
        emoji: "✨",
        color: "text-purple-400",
      };
    }

    const s = { SSR: 0, SR: 0, R: 0 };
    temp.forEach((it) => s[it.rarity]++);
    setSummary(s);
    setResults(temp);
    setIsRolling(false);
    setAnimationIndex(-1);
  }

  function clearResults() {
    if (isRolling) return;
    setResults([]);
    setSummary({ SSR: 0, SR: 0, R: 0 });
  }

  return (
    <div style={{ padding: 20, color: "#fff", background: "#1e1e1e" }}>
      <h1 style={{ fontSize: 24, marginBottom: 10 }}>扭蛋机 — 50 连抽模拟器</h1>

      <button onClick={do50Pulls}>动画 50 抽</button>
      <button onClick={quick50Pulls} style={{ marginLeft: 10 }}>
        快速 50 抽
      </button>
      <button onClick={clearResults} style={{ marginLeft: 10 }}>
        清空
      </button>

      <h3 style={{ marginTop: 20 }}>
        统计：SSR {summary.SSR} ｜ SR {summary.SR} ｜ R {summary.R}
      </h3>

      <div
        style={{
          marginTop: 20,
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 10,
        }}
      >
        {results.map((it, idx) => {
          const active = animationIndex >= 0 && idx <= animationIndex;
          return (
            <div
              key={idx}
              style={{
                padding: 10,
                border: "1px solid #444",
                borderRadius: 8,
                background: active ? "#333" : "#222",
                transform: active ? "scale(1.05)" : "scale(1)",
                transition: "0.15s",
              }}
            >
              <div>
                {it.emoji} {it.rarity}
              </div>
              <div>{it.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
