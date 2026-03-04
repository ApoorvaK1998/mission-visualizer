import { useState, useEffect } from "react";
import MapView from "./components/MapView";
import Legend from "./components/Legend";

function App(): JSX.Element {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ 
      width: "100vw", 
      height: "100vh", 
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      background: "#0a0f14",
    }}>
      {/* Header */}
      <header
        style={{
          flexShrink: 0,
          padding: "14px 24px",
          background: "#0a0f14",
          borderBottom: "1px solid #1e2a36",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px"}}>
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 32 32" 
            style={{ 
              filter: "drop-shadow(0 0 8px rgba(0, 212, 170, 0.4))"
            }}
          >
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#00d4aa" }} />
                <stop offset="100%" style={{ stopColor: "#0891b2" }} />
              </linearGradient>
            </defs>
            <circle cx="16" cy="16" r="14" fill="#0a0f14" stroke="url(#logoGrad)" strokeWidth="2"/>
            <circle cx="16" cy="14" r="5" fill="url(#logoGrad)"/>
            <path d="M16 19 L16 26 M14 24 L16 26 L18 24" stroke="url(#logoGrad)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <h1
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#e8eef4",
                letterSpacing: "0.02em",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Mission Visualizer
            </h1>
            <p
              style={{
                fontSize: "11px",
                fontWeight: 400,
                color: "#5a6a7a",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                margin: 0,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              Park Planning System
            </p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "11px",
            color: "#5a6a7a",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#00d4aa",
                boxShadow: "0 0 8px rgba(0, 212, 170, 0.6)",
                animation: "pulse 2s ease-in-out infinite",
              }}
            />
            LIVE
          </span>
          <span>v1.0.0</span>
        </div>
      </header>

      <MapView />
      <Legend />
    </div>
  );
}

export default App;
