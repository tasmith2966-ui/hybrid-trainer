(function (root) {
  function cleanCell(value) {
    return String(value ?? "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function extractMovementRows(doc) {
    if (!doc || typeof doc.querySelectorAll !== "function") return [];
    const rows = [];
    doc.querySelectorAll("table tr").forEach((row) => {
      const cells = Array.from(row.querySelectorAll("td, th")).map((cell) =>
        cleanCell(cell.textContent || ""),
      );
      if (cells.some((cell) => cell.length)) rows.push(cells);
    });
    return rows;
  }

  function buildMovementData(rows) {
    const accessoryMap = new Map();
    const nextMoves = new Set();
    if (!Array.isArray(rows)) return { accessoryMap, nextMoves };
    rows.forEach((cells) => {
      if (!Array.isArray(cells) || cells.length < 1) return;
      const [nameRaw = "", targetRaw = ""] = cells;
      const name = cleanCell(nameRaw);
      const target = cleanCell(targetRaw);
      if (!name || /name/i.test(name) || /muscle|target/i.test(target)) return;
      if (target) accessoryMap.set(name, target);
      nextMoves.add(name);
    });
    return { accessoryMap, nextMoves };
  }

  const api = { extractMovementRows, buildMovementData };
  root.MovementData = Object.assign(root.MovementData || {}, api);
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : window);
