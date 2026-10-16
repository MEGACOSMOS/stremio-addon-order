// Um servidor local, só para experimentar: node scripts/servir.mjs
// Serve a pasta como o GitHub Pages (pastas abrem o seu index.html).

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = fileURLToPath(new URL('..', import.meta.url));
const PORTA = Number(process.env.PORT) || 8020;
const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
};

createServer(async (pedido, resposta) => {
  const caminho = decodeURIComponent(new URL(pedido.url, 'http://x').pathname);
  let ficheiro = normalize(join(RAIZ, caminho));
  if (!ficheiro.startsWith(RAIZ)) return resposta.writeHead(403).end();
  try {
    if ((await stat(ficheiro)).isDirectory()) {
      if (!caminho.endsWith('/')) return resposta.writeHead(301, { Location: `${caminho}/` }).end();
      ficheiro = join(ficheiro, 'index.html');
    }
    resposta.writeHead(200, { 'Content-Type': TIPOS[extname(ficheiro)] || 'application/octet-stream', 'Access-Control-Allow-Origin': '*' });
    resposta.end(await readFile(ficheiro));
  } catch {
    resposta.writeHead(404).end('Não encontrado');
  }
}).listen(PORTA, () => console.log(`http://localhost:${PORTA}`));
