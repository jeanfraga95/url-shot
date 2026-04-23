const path = require("path");
const fs = require("fs");

// Carrega links na inicialização do módulo (cache entre invocações warm)
const linksPath = path.join(process.cwd(), "links.json");
let links = {};

try {
  links = JSON.parse(fs.readFileSync(linksPath, "utf8"));
} catch (e) {
  console.error("Erro ao carregar links.json:", e.message);
}

module.exports = (req, res) => {
  const { slug } = req.query;

  // Ignora requisições de assets do browser
  if (!slug || slug === "favicon.ico" || slug === "robots.txt") {
    return res.status(404).send("Not found");
  }

  const target = links[slug];

  if (!target) {
    // Redireciona para home se o slug não existir
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(404).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Link não encontrado</title>
          <meta http-equiv="refresh" content="3;url=/">
          <style>
            body { font-family: monospace; background: #0a0a0a; color: #e0e0e0;
                   display: flex; align-items: center; justify-content: center;
                   height: 100vh; margin: 0; flex-direction: column; gap: 12px; }
            code { color: #ff5f5f; background: #1a1a1a; padding: 4px 10px; border-radius: 4px; }
            small { color: #555; }
          </style>
        </head>
        <body>
          <code>404</code>
          <p>Link <strong>/${slug}</strong> não encontrado.</p>
          <small>Redirecionando para o início em 3s…</small>
        </body>
      </html>
    `);
  }

  // Cache de 5 minutos na edge da Vercel para redirecionamentos 301
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=60");
  res.redirect(301, target);
};
