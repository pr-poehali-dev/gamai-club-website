import { Server } from "./types";

interface Props {
  overlayServer: Server;
  onSelect: (server: Server) => void;
  onHoverEnter: (server: Server) => void;
  onHoverLeave: () => void;
}

export default function ServerOverlay({ overlayServer, onSelect, onHoverEnter, onHoverLeave }: Props) {
  const overlayNeon = overlayServer === "anarchy"
    ? { main: "#ff3c3c", glow: "rgba(255,60,60,0.15)", border: "#ff3c3c55" }
    : { main: "#39ff14", glow: "rgba(57,255,20,0.15)", border: "#39ff1455" };

  const servers = [
    { key: "anarchy" as Server, icon: "💀", name: "АНАРХИЯ", desc: "Никаких правил. Выживает сильнейший.", color: "#ff3c3c", glow: "rgba(255,60,60,0.3)" },
    { key: "classic" as Server, icon: "🌲", name: "КЛАССИКА", desc: "Выживание, стройка, дружное комьюнити.", color: "#39ff14", glow: "rgba(57,255,20,0.3)" },
  ];

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#050505", display: "flex",
      alignItems: "center", justifyContent: "center", flexDirection: "column",
      fontFamily: "'Rajdhani', 'Montserrat', sans-serif",
      transition: "background 0.8s ease"
    }}>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse at 50% 40%, ${overlayNeon.glow} 0%, transparent 70%)`,
        transition: "background 0.8s ease"
      }} />

      <div style={{
        fontSize: "clamp(36px, 8vw, 80px)", fontWeight: 900, letterSpacing: "0.2em",
        color: "#fff", marginBottom: 8, position: "relative",
        textShadow: "0 0 40px rgba(255,255,255,0.3)"
      }}>
        <span style={{ color: overlayNeon.main, textShadow: `0 0 20px ${overlayNeon.main}`, transition: "all 0.8s ease" }}>GAMAI</span>
        <span style={{ color: "#fff" }}> CLUB</span>
      </div>

      <div style={{ color: "#888", fontSize: 16, letterSpacing: "0.3em", marginBottom: 56, textTransform: "uppercase" }}>
        Выбери свой сервер
      </div>

      <div style={{ display: "flex", gap: 28, flexWrap: "wrap", justifyContent: "center", padding: "0 20px" }}>
        {servers.map((s) => (
          <button
            key={s.key}
            onClick={() => onSelect(s.key)}
            onMouseEnter={() => onHoverEnter(s.key)}
            onMouseLeave={onHoverLeave}
            style={{
              background: `linear-gradient(135deg, #0d0d0d 0%, rgba(${s.key === "anarchy" ? "255,60,60" : "57,255,20"},0.08) 100%)`,
              border: `2px solid ${overlayServer === s.key ? s.color : s.color + "33"}`,
              borderRadius: 16, padding: "36px 44px", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
              transition: "all 0.3s ease",
              boxShadow: overlayServer === s.key ? `0 0 40px ${s.glow}` : `0 0 10px ${s.glow}`,
              transform: overlayServer === s.key ? "translateY(-8px) scale(1.03)" : "none",
              minWidth: 220
            }}>
            <div style={{ fontSize: 56 }}>{s.icon}</div>
            <div style={{ color: s.color, fontSize: 22, fontWeight: 800, letterSpacing: "0.2em", textShadow: `0 0 12px ${s.color}` }}>{s.name}</div>
            <div style={{ color: "#aaa", fontSize: 13, textAlign: "center", maxWidth: 180, lineHeight: 1.5 }}>{s.desc}</div>
            <div style={{ color: "#555", fontSize: 12, marginTop: 4 }}>1.21.1 · mc.gamai.club</div>
          </button>
        ))}
      </div>

      <div style={{ marginTop: 48, display: "flex", gap: 8, alignItems: "center" }}>
        {(["anarchy", "classic"] as Server[]).map((s) => (
          <div key={s} style={{
            width: overlayServer === s ? 24 : 8, height: 8, borderRadius: 4,
            background: overlayServer === s ? overlayNeon.main : "#333",
            transition: "all 0.4s ease"
          }} />
        ))}
      </div>
    </div>
  );
}
