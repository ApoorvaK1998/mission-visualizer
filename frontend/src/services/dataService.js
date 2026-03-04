export async function fetchMission() {
  const res = await fetch("http://localhost:5000/api/data/mission");
  return res.json();
}

export async function fetchData() {
  const res = await fetch("http://localhost:5000/api/data/park/data");
  return res.json();
}
