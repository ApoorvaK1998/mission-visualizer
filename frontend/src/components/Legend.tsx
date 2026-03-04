import { useState, useEffect } from "react";

interface LegendProps {
  className?: string;
}

interface LegendItem {
  label: string;
  color: string;
  symbol: "circle" | "line" | "square" | "diamond";
}

const legendItems: LegendItem[] = [
  { label: "Nodes", color: "#00d4aa", symbol: "circle" },
  { label: "Edges", color: "#22c55e", symbol: "line" },
  { label: "Poles", color: "#8b5cf6", symbol: "circle" },
  { label: "Fences", color: "#64748b", symbol: "line" },
  { label: "Obstacles", color: "#ef4444", symbol: "square" },
  { label: "Panels", color: "#eab308", symbol: "square" },
  { label: "Stations", color: "#ec4899", symbol: "diamond" },
  { label: "Compact Stations", color: "#f97316", symbol: "diamond" },
];

function Symbol({ type, color }: { type: LegendItem["symbol"]; color: string }) {
  const style: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "14px",
    height: "14px",
  };

  switch (type) {
    case "circle":
      return (
        <span style={{ ...style }}>
          <svg width="12" height="12" viewBox="0 0 12 12">
            <circle cx="6" cy="6" r="5" fill={color} opacity="0.9" />
          </svg>
        </span>
      );
    case "line":
      return (
        <span style={{ ...style }}>
          <svg width="14" height="6" viewBox="0 0 14 6">
            <line x1="0" y1="3" x2="14" y2="3" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </span>
      );
    case "square":
      return (
        <span style={{ ...style }}>
          <svg width="10" height="10" viewBox="0 0 10 10">
            <rect x="1" y="1" width="8" height="8" fill={color} opacity="0.85" rx="1" />
          </svg>
        </span>
      );
    case "diamond":
      return (
        <span style={{ ...style }}>
          <svg width="10" height="10" viewBox="0 0 10 10">
            <polygon points="5,0 10,5 5,10 0,5" fill={color} opacity="0.9" />
          </svg>
        </span>
      );
  }
}

export default function Legend({ className }: LegendProps): JSX.Element {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        bottom: "24px",
        left: "24px",
        zIndex: 1000,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
      }}
    >
      <div
        style={{
          background: "rgba(21, 29, 37, 0.95)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(30, 42, 54, 0.8)",
          borderRadius: "12px",
          padding: "16px 20px",
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.5)",
          minWidth: "160px",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#5a6a7a",
            marginBottom: "14px",
            paddingBottom: "10px",
            borderBottom: "1px solid rgba(30, 42, 54, 0.6)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #00d4aa, #0891b2)",
              boxShadow: "0 0 8px rgba(0, 212, 170, 0.5)",
            }}
          />
          Legend
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {legendItems.map((item, index) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateX(0)" : "translateX(-8px)",
                transition: `opacity 0.3s ease ${index * 0.05}s, transform 0.3s ease ${index * 0.05}s`,
              }}
            >
              <Symbol type={item.symbol} color={item.color} />
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#e8eef4",
                  letterSpacing: "0.02em",
                }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "14px",
            paddingTop: "10px",
            borderTop: "1px solid rgba(30, 42, 54, 0.6)",
            fontSize: "9px",
            color: "#5a6a7a",
            fontFamily: "'JetBrains Mono', monospace",
            textAlign: "center",
            letterSpacing: "0.05em",
          }}
        >
          HOVER FOR DETAILS
        </div>
      </div>
    </div>
  );
}
