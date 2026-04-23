const path = require("path");
const fs = require("fs");

module.exports = (req, res) => {
  try {
    const linksPath = path.join(process.cwd(), "links.json");
    const links = JSON.parse(fs.readFileSync(linksPath, "utf8"));

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "s-maxage=30");
    res.status(200).json({ links, count: Object.keys(links).length });
  } catch (e) {
    res.status(500).json({ error: "Falha ao carregar links", detail: e.message });
  }
};
