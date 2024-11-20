import { useState } from "react";

export default function BattlePage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const startBattle = async () => {
    setLoading(true);
    setLogs([]);
    try {
      const response = await fetch("/api/simulation");
      if (!response.ok) throw new Error(`API error: ${response.statusText}`);
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
    <div
      style={{
        fontFamily: "monospace",
        color: "#00FF00", // Terminal green
        backgroundColor: "#000000", // Terminal black
        padding: "20px",
        height: "100vh",
        overflowY: "scroll",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1 style={{ color: "#00FF00", marginBottom: "20px" }}>Battle Simulation</h1>
      <button
        onClick={startBattle}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#333333",
          color: "#00FF00",
          border: "1px solid #00FF00",
          borderRadius: "5px",
          marginBottom: "20px",
        }}
      >
        Start Battle
      </button>
      {loading && <p>Battle in progress... This might take some time!</p>}
      <pre
        style={{
          marginTop: "20px",
          whiteSpace: "pre-wrap",
          textAlign: "left",
          width: "100%",
          maxWidth: "800px",
        }}
      >
        {logs.join("\n")}
      </pre>
    </div>
  );
}
