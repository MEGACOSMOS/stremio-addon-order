// A página: entrar na conta do Stremio, ler a lista de extensões, mudar a
// ordem (arrastar, setas ou teclado) e guardá-la.

import { textos, linguaDe, LINGUAS } from './textos.js';
import { temPesquisa, temCatalogos, eOficial, mover, mesmaOrdem, reordenar } from './colecao.js';
import { DEMO } from './demo.js';

const $ = (s) => document.querySelector(s);
const API = 'https://api.strem.io/api/';
const LINK = 'https://link.stremio.com/api/v2/';
const CHAVE_SESSAO = 'ao-sessao';
const CHAVE_LINGUA = 'ao-lingua';
// A pasta onde está a página (no GitHub Pages é /stremio-addon-order/).
const BASE = new URL('./', import.meta.url);

const guardado = {
  ler(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  escrever(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sem espaço ou bloqueado */ } },
  apagar(k) { try { localStorage.removeItem(k); } catch { /* idem */ } },
};

const esc = (x) => String(x ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
const parametros = new URLSearchParams(location.search);

// ——— Língua ———

let t = textos(linguaDe(parametros.get('lang') || guardado.ler(CHAVE_LINGUA), navigator.languages || [navigator.language]));

const seletor = $('#lingua');
seletor.innerHTML = Object.entries(LINGUAS).map(([codigo, nome]) => `<option value="${codigo}" lang="${codigo}">${nome}</option>`).join('');

let ultimoErro = null;
let ultimaMensagem = null;

function aplicarTextos() {
  document.documentElement.lang = t.local;
  document.title = t.titulo;
  document.querySelector('meta[name="description"]').content = t.descricao_pagina;
  seletor.value = t.lingua;
  for (const el of document.querySelectorAll('[data-t]')) {
    const chave = el.dataset.t;
    if (chave.endsWith('_html')) el.innerHTML = t[chave];
    else el.textContent = t[chave];
  }
  for (const el of document.querySelectorAll('[data-t-aria]')) el.setAttribute('aria-label', t[el.dataset.tAria]);
  if (ultimoErro) erroEntrada(ultimoErro);
  if (ultimaMensagem) mensagem(...ultimaMensagem);
  if (estado.lista.length) desenhar();
}

seletor.addEventListener('change', () => {
  t = textos(seletor.value);
  guardado.escrever(CHAVE_LINGUA, t.lingua);
  aplicarTextos();
});

// ——— Estado e vistas ———

// lida: a ordem que o Stremio tem guardada. lista: a que está no ecrã.
// anterior: a ordem antes do último "Guardar", para a poder repor.
let estado = { modo: null, sessao: null, lida: [], lista: [], anterior: null, ocupado: false };

function mostrar(vista) {
  for (const v of ['entrada', 'carregar', 'lista']) $(`#vista-${v}`).hidden = v !== vista;
  $('#sair').hidden = vista !== 'lista' || estado.modo !== 'conta';
  if (vista === 'entrada') {
    $('#caixa-entrar').hidden = false;
    $('#caixa-codigo').hidden = true;
  }
  window.scrollTo(0, 0);
}

// Guarda a chave do erro para o voltar a escrever se a língua mudar.
function erroEntrada(chave) {
  ultimoErro = chave || null;
  const el = $('#erro-entrada');
  el.textContent = chave ? t[chave] : '';
  el.hidden = !chave;
}

function mensagem(chave, { erro = false, repor = false } = {}) {
  ultimaMensagem = chave ? [chave, { erro, repor }] : null;
  const caixa = $('#mensagem');
  caixa.hidden = !chave;
  if (!chave) return;
  caixa.classList.toggle('erro-msg', erro);
  $('#mensagem-texto').innerHTML = chave.endsWith('_html') ? t[chave] : esc(t[chave]);
  $('#repor').hidden = !repor;
}

const haAlteracoes = () => !mesmaOrdem(estado.lista, estado.lida);

// ——— Stremio ———

async function stremio(metodo, corpo) {
  const r = await fetch(API + metodo, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(corpo),
  });
  const j = await r.json();
  if (j.error) {
    const e = new Error(j.error.message);
    e.doStremio = true;
    throw e;
  }
  return j.result;
}

async function lerExtensoes() {
  if (estado.modo === 'demo') return estado.lida;
  const r = await stremio('addonCollectionGet', { type: 'AddonCollectionGet', authKey: estado.sessao.authKey, update: true });
  if (!Array.isArray(r?.addons)) throw new Error('resposta sem extensões');
  return r.addons;
}

let cancelarLink = null;

async function entrarComLink() {
  erroEntrada(null);
  const botao = $('#entrar-link');
  botao.disabled = true;
  let codigo;
  try {
    const r = await fetch(`${LINK}create?type=Create`).then((x) => x.json());
    codigo = r.result;
    if (!codigo?.code) throw new Error('sem código');
  } catch {
    erroEntrada('erro_ligacao');
    return;
  } finally {
    botao.disabled = false;
  }
  $('#codigo').textContent = codigo.code;
  $('#abrir-link').href = codigo.link;
  $('#caixa-entrar').hidden = true;
  $('#caixa-codigo').hidden = false;
  $('#abrir-link').focus();

  let cancelado = false;
  cancelarLink = () => { cancelado = true; };
  const limite = Date.now() + 5 * 60 * 1000;
  while (!cancelado && Date.now() < limite) {
    await esperar(2500);
    if (cancelado) return;
    try {
      const r = await fetch(`${LINK}read?type=Read&code=${encodeURIComponent(codigo.code)}`).then((x) => x.json());
      // Enquanto ninguém confirma, o Stremio responde com um erro; é só esperar.
      if (r.result?.authKey) return entrou(r.result.authKey);
    } catch { /* tenta outra vez daqui a pouco */ }
  }
  if (!cancelado) {
    mostrar('entrada');
    erroEntrada('erro_codigo');
  }
}

async function entrarComPalavraPasse(evento) {
  evento.preventDefault();
  erroEntrada(null);
  const form = evento.target;
  const botao = form.querySelector('button');
  botao.disabled = true;
  try {
    const r = await stremio('login', {
      type: 'Login', email: form.email.value.trim(), password: form.password.value, facebook: false,
    });
    form.reset();
    await entrou(r.authKey, r.user);
  } catch (e) {
    erroEntrada(e.doStremio ? 'erro_senha' : 'erro_ligacao');
  } finally {
    botao.disabled = false;
  }
}

async function entrou(authKey, utilizador) {
  if (!utilizador) {
    try { utilizador = await stremio('getUser', { type: 'GetUser', authKey }); } catch { /* o nome é só simpatia */ }
  }
  const nome = (utilizador?.fullname || '').trim().split(/\s+/)[0] || '';
  estado = { ...estado, modo: 'conta', sessao: { authKey, nome } };
  guardado.escrever(CHAVE_SESSAO, estado.sessao);
  if (location.search) history.replaceState(null, '', location.pathname);
  await carregarConta();
}

async function carregarConta() {
  mostrar('carregar');
  let extensoes;
  try {
    extensoes = await lerExtensoes();
  } catch (e) {
    if (e.doStremio) {
      guardado.apagar(CHAVE_SESSAO);
      estado = { ...estado, modo: null, sessao: null };
      mostrar('entrada');
      erroEntrada('erro_sessao');
    } else {
      mostrar('entrada');
      erroEntrada('erro_ligacao');
    }
    return;
  }
  abrirLista(extensoes);
}

function abrirExemplo() {
  estado = { ...estado, modo: 'demo', sessao: null };
  abrirLista(DEMO);
}

function abrirLista(extensoes) {
  estado = { ...estado, lida: extensoes, lista: extensoes.slice(), anterior: null };
  mensagem(null);
  $('#aviso-demo').hidden = estado.modo !== 'demo';
  mostrar('lista');
  desenhar();
}

// ——— Desenhar ———

const ICONES = {
  pega: '<svg viewBox="0 0 14 20" aria-hidden="true"><g fill="currentColor"><circle cx="4" cy="4" r="1.6"/><circle cx="10" cy="4" r="1.6"/><circle cx="4" cy="10" r="1.6"/><circle cx="10" cy="10" r="1.6"/><circle cx="4" cy="16" r="1.6"/><circle cx="10" cy="16" r="1.6"/></g></svg>',
  subir: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 10 8 5.5 12.5 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  descer: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 6 8 10.5 12.5 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  topo: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3h10M4 10.5 8 6.5l4 4M8 7v6.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

const nomeDe = (a) => a.manifest?.name || a.transportUrl;

function icone(a) {
  const logo = a.manifest?.logo;
  const inicial = esc((nomeDe(a).match(/\p{L}|\p{N}/u) || ['?'])[0].toUpperCase());
  // Só imagens https: um http dentro de uma página https não carregava.
  if (typeof logo === 'string' && /^https:\/\//i.test(logo)) {
    return `<span class="icone" data-inicial="${inicial}"><img src="${esc(logo)}" alt="" loading="lazy" referrerpolicy="no-referrer"></span>`;
  }
  return `<span class="icone">${inicial}</span>`;
}

function linhaExtensao(a, i, total) {
  const nome = nomeDe(a);
  const etiquetas = [
    eOficial(a) ? `<span class="etiqueta">${esc(t.etiqueta_oficial)}</span>` : '',
    temPesquisa(a) ? `<span class="etiqueta pesquisa">${esc(t.etiqueta_pesquisa)}</span>` : '',
    temCatalogos(a) ? `<span class="etiqueta">${esc(t.etiqueta_catalogos)}</span>` : '',
  ].join('');
  return `<li class="extensao" data-i="${i}">
    <button type="button" class="pega" data-acao="pega" aria-label="${esc(t.arrastar(nome))}">${ICONES.pega}</button>
    <span class="n">${i + 1}</span>
    ${icone(a)}
    <div class="info">
      <div class="nome">${esc(nome)}${etiquetas}</div>
      <div class="desc" title="${esc(a.manifest?.description)}">${esc(a.manifest?.description || a.transportUrl)}</div>
    </div>
    <div class="setas">
      <button type="button" class="topo-btn" data-acao="topo" aria-label="${esc(t.topo(nome))}" title="${esc(t.topo(nome))}"${i === 0 ? ' disabled' : ''}>${ICONES.topo}</button>
      <button type="button" data-acao="subir" aria-label="${esc(t.subir(nome))}"${i === 0 ? ' disabled' : ''}>${ICONES.subir}</button>
      <button type="button" data-acao="descer" aria-label="${esc(t.descer(nome))}"${i === total - 1 ? ' disabled' : ''}>${ICONES.descer}</button>
    </div>
  </li>`;
}

function desenhar(mexida = null, focar = null) {
  $('#ola').textContent = estado.sessao?.nome ? t.ola(estado.sessao.nome) : t.ola_sem_nome;

  const ol = $('#lista');
  ol.innerHTML = estado.lista.map((a, i) => linhaExtensao(a, i, estado.lista.length)).join('');
  for (const img of ol.querySelectorAll('.icone img')) {
    img.addEventListener('error', () => { img.parentElement.textContent = img.parentElement.dataset.inicial; }, { once: true });
  }
  if (mexida != null) {
    const li = ol.children[mexida];
    li?.classList.add('mexida');
    if (focar) li?.querySelector(`[data-acao="${focar}"]:not(:disabled)`)?.focus();
  }
  $('#barra-guardar').hidden = !haAlteracoes();
}

// ——— Mudar a ordem ———

function moverPara(de, para, focar) {
  if (estado.ocupado || para === de || para < 0 || para >= estado.lista.length) return;
  estado.lista = mover(estado.lista, de, para);
  if (ultimaMensagem && !ultimaMensagem[1].erro) mensagem(null);
  desenhar(para, focar);
}

$('#lista').addEventListener('click', (ev) => {
  const botao = ev.target.closest('button[data-acao]');
  if (!botao || botao.dataset.acao === 'pega') return;
  const i = Number(botao.closest('.extensao').dataset.i);
  const acao = botao.dataset.acao;
  moverPara(i, acao === 'topo' ? 0 : acao === 'subir' ? i - 1 : i + 1, acao === 'topo' ? 'pega' : acao);
});

// Com o teclado: a pega sobe e desce com as setas.
$('#lista').addEventListener('keydown', (ev) => {
  const pega = ev.target.closest('.pega');
  if (!pega || !['ArrowUp', 'ArrowDown', 'Home'].includes(ev.key)) return;
  ev.preventDefault();
  const i = Number(pega.closest('.extensao').dataset.i);
  moverPara(i, ev.key === 'Home' ? 0 : ev.key === 'ArrowUp' ? i - 1 : i + 1, 'pega');
});

// Arrastar pela pega (rato, toque ou caneta).
$('#lista').addEventListener('pointerdown', (ev) => {
  const pega = ev.target.closest('.pega');
  if (!pega || ev.button > 0 || estado.ocupado) return;
  ev.preventDefault();
  const ol = $('#lista');
  const li = pega.closest('.extensao');
  const itens = [...ol.children];
  const de = itens.indexOf(li);
  // Posições na página (não no ecrã), para continuarem certas se a página andar.
  const caixas = itens.map((x) => { const c = x.getBoundingClientRect(); return { topo: c.top + scrollY, altura: c.height }; });
  const intervalo = parseFloat(getComputedStyle(ol).rowGap) || 0;
  const passo = caixas[de].altura + intervalo;
  const inicio = ev.clientY + scrollY;
  let alvo = de;

  pega.setPointerCapture(ev.pointerId);
  li.classList.add('a-arrastar');
  ol.classList.add('arrastando');

  const mexer = (e) => {
    if (e.clientY < 70) scrollBy(0, -12);
    else if (e.clientY > innerHeight - 70) scrollBy(0, 12);
    const dy = e.clientY + scrollY - inicio;
    li.style.transform = `translateY(${dy}px)`;
    const centro = caixas[de].topo + caixas[de].altura / 2 + dy;
    alvo = caixas.filter((c, i) => i !== de && c.topo + c.altura / 2 < centro).length;
    itens.forEach((x, i) => {
      if (i === de) return;
      const desvio = i > de && i <= alvo ? -passo : i < de && i >= alvo ? passo : 0;
      x.style.transform = desvio ? `translateY(${desvio}px)` : '';
    });
  };
  const largar = () => {
    pega.removeEventListener('pointermove', mexer);
    pega.removeEventListener('pointerup', largar);
    pega.removeEventListener('pointercancel', largar);
    ol.classList.remove('arrastando');
    for (const x of itens) x.style.transform = '';
    li.classList.remove('a-arrastar');
    if (alvo !== de) moverPara(de, alvo, 'pega');
  };
  pega.addEventListener('pointermove', mexer);
  pega.addEventListener('pointerup', largar);
  pega.addEventListener('pointercancel', largar);
});

// ——— Guardar ———

function ocupado(sim, botao) {
  estado.ocupado = sim;
  for (const b of document.querySelectorAll('#vista-lista button')) b.disabled = sim;
  if (botao) botao.textContent = sim ? t.a_guardar : t[botao.dataset.t];
}

// Guarda `ordem` no Stremio. Lê a lista outra vez mesmo antes de guardar, para
// nunca escrever por cima de uma extensão instalada ou removida entretanto, e
// outra vez depois, para confirmar que ficou mesmo assim.
async function guardar(ordem, { botao, repondo = false, realcar = null } = {}) {
  ocupado(true, botao);
  mensagem(null);
  try {
    if (estado.modo === 'demo') {
      await esperar(500);
      estado = { ...estado, anterior: repondo ? null : estado.lida, lida: ordem, lista: ordem.slice() };
      mensagem(repondo ? null : 'guardado_demo_html', { repor: !repondo });
      return;
    }
    const atual = await lerExtensoes();
    const final = reordenar(atual, ordem);
    if (!final) {
      estado = { ...estado, lida: atual, lista: atual.slice(), anterior: null };
      mensagem('erro_mudou', { erro: true });
      return;
    }
    await stremio('addonCollectionSet', { type: 'AddonCollectionSet', authKey: estado.sessao.authKey, addons: final });
    const depois = await lerExtensoes();
    if (!mesmaOrdem(depois, final)) {
      estado = { ...estado, lida: depois, lista: depois.slice(), anterior: null };
      mensagem('erro_guardar', { erro: true });
      return;
    }
    const anterior = repondo ? null : atual;
    estado = { ...estado, lida: depois, lista: depois.slice(), anterior };
    mensagem(repondo ? null : 'guardado_html', { repor: !!anterior && !mesmaOrdem(anterior, depois) });
  } catch (e) {
    mensagem(e.doStremio ? 'erro_guardar' : 'erro_ligacao', { erro: true });
  } finally {
    ocupado(false, botao);
    desenhar(realcar);
  }
}

$('#guardar').addEventListener('click', (ev) => guardar(estado.lista, { botao: ev.currentTarget }));
$('#desfazer').addEventListener('click', () => { estado.lista = estado.lida.slice(); desenhar(); });
$('#repor').addEventListener('click', (ev) => estado.anterior && guardar(estado.anterior, { botao: ev.currentTarget, repondo: true }));

addEventListener('beforeunload', (ev) => {
  if (!$('#vista-lista').hidden && haAlteracoes()) ev.preventDefault();
});

// ——— Entrar e sair ———

$('#entrar-link').addEventListener('click', entrarComLink);
$('#cancelar-link').addEventListener('click', () => { cancelarLink?.(); mostrar('entrada'); });
$('#form-login').addEventListener('submit', entrarComPalavraPasse);
$('#ver-exemplo').addEventListener('click', () => {
  history.replaceState(null, '', `${location.pathname}?exemplo`);
  abrirExemplo();
});
$('#demo-entrar').addEventListener('click', () => {
  history.replaceState(null, '', location.pathname);
  const sessao = guardado.ler(CHAVE_SESSAO);
  if (sessao?.authKey) {
    estado = { ...estado, modo: 'conta', sessao };
    carregarConta();
  } else {
    estado = { ...estado, modo: null, lista: [], lida: [] };
    mostrar('entrada');
  }
});
$('#sair').addEventListener('click', () => {
  if (haAlteracoes() && !confirm(t.sair_alteracoes)) return;
  guardado.apagar(CHAVE_SESSAO);
  estado = { modo: null, sessao: null, lida: [], lista: [], anterior: null, ocupado: false };
  mensagem(null);
  mostrar('entrada');
});

// ——— Instalar a extensão ———

const urlManifesto = new URL('manifest.json', BASE).href;

$('#instalar').addEventListener('click', () => {
  $('#instalar-url').value = urlManifesto;
  $('#instalar-abrir').href = urlManifesto.replace(/^https?:\/\//, 'stremio://');
  // O Stremio troca stremio:// por https://, que não existe num endereço local.
  const local = /^(localhost|127\.|\[::1\])/.test(location.hostname);
  $('#instalar-abrir').hidden = local;
  $('#instalar-local').hidden = !local;
  $('#janela-instalar').showModal();
});
$('#instalar-fechar').addEventListener('click', () => $('#janela-instalar').close());
$('#instalar-copiar').addEventListener('click', async () => {
  const campo = $('#instalar-url');
  try { await navigator.clipboard.writeText(campo.value); } catch { campo.select(); document.execCommand('copy'); }
  $('#instalar-copiar').textContent = t.copiado;
  setTimeout(() => { $('#instalar-copiar').textContent = t.copiar; }, 2000);
});

// ——— Arranque ———

aplicarTextos();
const sessaoGuardada = guardado.ler(CHAVE_SESSAO);
if (parametros.has('exemplo')) abrirExemplo();
else if (sessaoGuardada?.authKey) {
  estado = { ...estado, modo: 'conta', sessao: sessaoGuardada };
  carregarConta();
} else mostrar('entrada');
