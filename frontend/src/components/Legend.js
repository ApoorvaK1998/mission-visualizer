export default function Legend() {
  return (
    <div style={{
      position: "absolute",
      bottom: 20,
      left: 20,
      background: "white",
      padding: "12px",
      borderRadius: "6px",
      boxShadow: "0 0 6px rgba(0,0,0,0.2)",
      fontSize: "14px",
      zIndex: 1000
    }}>
      <div><span style={{color:"blue"}}>●</span> Mission Nodes</div>
      <div><span style={{color:"green"}}>―</span> Mission Edges</div>
      <div><span style={{color:"purple"}}>●</span> Poles</div>
      <div><span style={{color:"gray"}}>■</span> Fences</div>
      <div><span style={{color:"red"}}>■</span> Obstacles</div>
      <div><span style={{color:"brown"}}>■</span> Panels</div>
      <div><span style={{color:"orange"}}>●</span> Stations</div>
      <div><span style={{color:"magenta"}}>●</span> Compact Stations</div>
    </div>
  );
}
