import { useState } from "react";

export default function BattlePage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const startBattle = async () => {
    setLoading(true);
    setLogs([]);
    try {
      const response = await fetch("/api/simulation");
      const data = await response.json();
      setLogs(data.logs);
    } catch (error) {
      setLogs(["Error fetching battle logs. Please try again."]);
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "monospace", padding: "20px" }}>
      <h1>Battle Simulation</h1>
      <button
        onClick={startBattle}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Start Battle
      </button>
      {loading && <p>Battle in progress... This might take some time!</p>}
      <pre style={{ marginTop: "20px", whiteSpace: "pre-wrap" }}>
        {logs.join("\n")}
      </pre>
    </div>
  );
}
