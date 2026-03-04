export default function Legend(): JSX.Element {
  return (
    <div style={{
      position: "absolute",
      bottom: 20,
      left: 20,
      background: "rgba(255,255,255,0.92)",
      padding: "14px",
      borderRadius: "8px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
      fontSize: "13px",
      zIndex: 1000,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      <div style={{marginBottom:"8px", fontWeight:"600", color:"#333", borderBottom:"1px solid #eee", paddingBottom:"6px"}}>Legend</div>
      <div><span style={{color:"#1565C0", fontWeight:"bold"}}>●</span> Nodes</div>
      <div><span style={{color:"#2E7D32", fontWeight:"bold"}}>―</span> Edges</div>
      <div><span style={{color:"#6A1B9A", fontWeight:"bold"}}>●</span> Poles</div>
      <div><span style={{color:"#546E7A", fontWeight:"bold"}}>≡</span> Fences</div>
      <div><span style={{color:"#C62828", fontWeight:"bold"}}>■</span> Obstacles</div>
      <div><span style={{color:"#5D4037", fontWeight:"bold"}}>■</span> Panels</div>
      <div><span style={{color:"#EF6C00", fontWeight:"bold"}}>●</span> Station</div>
    </div>
  );
}
