// A lista de extensões de uma conta do Stremio ("addon collection") e as
// contas que se fazem com ela. Sem nada do navegador: a página e o teste
// (scripts/testar-ordem.mjs) usam as mesmas funções.
//
// Cada extensão da lista é { transportUrl, transportName, manifest, flags }.
// O Stremio usa esta ordem para as filas da página inicial, para os
// resultados da pesquisa e para escolher quem dá os detalhes de cada filme.

export const ID_CINEMETA = 'com.linvo.cinemeta';
export const URL_CINEMETA = 'https://v3-cinemeta.strem.io/manifest.json';

export const eCinemeta = (a) => a?.manifest?.id === ID_CINEMETA || /\/\/v3-cinemeta\.strem\.io\//.test(a?.transportUrl || '');

export const posicaoCinemeta = (lista) => lista.findIndex(eCinemeta);

// Tem pelo menos um catálogo que aceita pesquisa?
export const temPesquisa = (a) => (a?.manifest?.catalogs || []).some((c) =>
  (c.extra || []).some((e) => e?.name === 'search') || (c.extraSupported || []).includes('search'));

export const temCatalogos = (a) => (a?.manifest?.catalogs || []).length > 0;

export const eOficial = (a) => !!a?.flags?.official;

// Devolve uma lista nova; a original fica igual.
export function mover(lista, de, para) {
  const nova = lista.slice();
  if (de < 0 || de >= nova.length) return nova;
  const destino = Math.max(0, Math.min(nova.length - 1, para));
  const [item] = nova.splice(de, 1);
  nova.splice(destino, 0, item);
  return nova;
}

export const cinemetaPrimeiro = (lista) => mover(lista, posicaoCinemeta(lista), 0);

export const mesmaOrdem = (a, b) => a.length === b.length && a.every((x, i) => x.transportUrl === b[i].transportUrl);

// As duas listas têm exatamente as mesmas extensões (a ordem não interessa)?
export function mesmasExtensoes(a, b) {
  if (a.length !== b.length) return false;
  const contar = (lista) => lista.reduce((m, x) => m.set(x.transportUrl, (m.get(x.transportUrl) || 0) + 1), new Map());
  const ca = contar(a);
  const cb = contar(b);
  return ca.size === cb.size && [...ca].every(([url, n]) => cb.get(url) === n);
}

// Aplica a ordem de `ordem` às extensões de `atual` (a lista acabada de ler do
// Stremio), para guardar sempre as descrições mais recentes de cada extensão.
// Se as extensões não forem as mesmas devolve null: alguém instalou ou
// desinstalou alguma coisa entretanto e não se pode guardar por cima.
export function reordenar(atual, ordem) {
  if (!mesmasExtensoes(atual, ordem)) return null;
  const porUrl = new Map();
  for (const a of atual) porUrl.set(a.transportUrl, [...(porUrl.get(a.transportUrl) || []), a]);
  return ordem.map((x) => porUrl.get(x.transportUrl).shift());
}
