// Todos os textos da página, em português e em inglês.
// As chaves que acabam em _html levam marcação; as funções recebem valores.

export const LINGUAS = { pt: 'Português', en: 'English' };

const pt = {
  lingua: 'pt',
  local: 'pt-PT',
  titulo: 'Addon Order',
  descricao_pagina: 'Muda a ordem das tuas extensões do Stremio: na página inicial, no Descobrir e na pesquisa.',
  lingua_rotulo: 'Língua',
  instalar: 'Instalar no Stremio',
  sair: 'Sair',

  entrada_titulo: 'As tuas extensões, pela ordem que quiseres.',
  entrada_texto: 'O Stremio mostra as filas e os resultados da pesquisa pela ordem das extensões, mas não te deixa mudá-la. Aqui deixa: arrasta as extensões para a ordem que quiseres e guarda.',
  entrar_link: 'Entrar com a minha conta do Stremio',
  ver_exemplo: 'Ver um exemplo',
  alternativa: 'Prefiro escrever o email e a palavra-passe',
  campo_email: 'Email da conta do Stremio',
  campo_senha: 'Palavra-passe',
  entrar: 'Entrar',
  passo1: 'Abre a página de confirmação do Stremio (entra na tua conta se ele pedir).',
  passo2: 'Confirma que o código é este:',
  abrir_confirmacao: 'Abrir a página de confirmação',
  cancelar: 'Cancelar',
  a_espera: 'À espera da confirmação… esta página continua sozinha.',
  privacidade: 'A palavra-passe nunca passa por aqui: vai diretamente para o Stremio. Esta página só guarda, neste navegador, a chave que o Stremio lhe dá para ler e ordenar as tuas extensões. Para a apagar, carrega em “Sair”.',

  a_ler: 'A ler as tuas extensões do Stremio…',

  aviso_demo_html: 'Isto é um <strong>exemplo</strong>. Podes mexer à vontade: nada é guardado.',
  demo_entrar: 'Ordenar as minhas extensões',

  ola: (nome) => `Olá, ${nome}.`,
  ola_sem_nome: 'As tuas extensões',
  heroi_titulo: 'Muda a ordem das tuas extensões.',
  heroi_texto: 'O Stremio mostra as filas da página inicial e os resultados da pesquisa pela ordem das extensões. Aqui escolhes essa ordem: arrasta as extensões ou usa as setas, e guarda.',

  lista_titulo: 'Todas as extensões',
  lista_sub: 'Arrasta pela pega ou usa as setas. De cima para baixo é a ordem do Stremio.',
  etiqueta_oficial: 'Oficial',
  etiqueta_pesquisa: 'Pesquisa',
  etiqueta_catalogos: 'Filas no início',
  arrastar: (nome) => `Arrastar ${nome}`,
  subir: (nome) => `Subir ${nome}`,
  descer: (nome) => `Descer ${nome}`,
  topo: (nome) => `Pôr ${nome} em primeiro`,

  por_guardar: 'Tens alterações por guardar.',
  guardar: 'Guardar no Stremio',
  desfazer: 'Desfazer',
  a_guardar: 'A guardar…',
  guardado_html: '<strong>Guardado.</strong> Fecha e volta a abrir o Stremio (em todos os aparelhos) para veres a nova ordem.',
  guardado_demo_html: '<strong>No exemplo nada é guardado</strong>, mas com a tua conta seria assim: fechavas e voltavas a abrir o Stremio e já estava.',
  repor: 'Repor a ordem anterior',
  erro_mudou: 'As tuas extensões mudaram entretanto (noutro aparelho?). Carreguei a lista outra vez: confirma a ordem e guarda de novo.',
  erro_guardar: 'O Stremio não aceitou a nova ordem. Nada foi alterado. Tenta outra vez daqui a pouco.',
  erro_ligacao: 'Não foi possível falar com o Stremio. Verifica a ligação à Internet e tenta outra vez.',
  erro_codigo: 'O código expirou antes de ser confirmado. Carrega outra vez em “Entrar” para receberes um novo.',
  erro_senha: 'O Stremio não aceitou esse email e palavra-passe. Se entras no Stremio com o Facebook, a Google ou a Apple, usa o botão “Entrar com a minha conta do Stremio”.',
  erro_sessao: 'A tua sessão do Stremio terminou. Entra outra vez.',
  sair_alteracoes: 'Tens alterações por guardar. Sair mesmo assim?',

  como_titulo: 'Para que serve a ordem',
  como_1_html: '<strong>Página inicial e Descobrir</strong> — as filas aparecem pela ordem das extensões (a não ser que as tenhas reordenado à mão nas definições do Stremio).',
  como_2_html: '<strong>Pesquisa</strong> — os resultados de cada extensão com pesquisa aparecem pela mesma ordem. As que têm a etiqueta “Pesquisa” são as que contam.',
  como_3_html: '<strong>Detalhes dos filmes e séries</strong> — se tiveres mais do que uma extensão de metadados, o Stremio usa a primeira da lista para as sinopses, os elencos e as imagens.',

  rodape: 'Esta página não é do Stremio. Só muda a ordem das tuas extensões; não instala nem remove nenhuma.',

  janela_titulo: 'Instalar no Stremio',
  janela_texto_html: 'A extensão não acrescenta filas nem catálogos: serve para teres esta página à mão. No Stremio, abre as extensões e carrega em <strong>Configurar</strong> no Addon Order.',
  janela_local_html: '<strong>Neste computador:</strong> carrega em “Copiar”, abre as extensões do Stremio (o ícone da peça de puzzle) e cola o link na caixa de pesquisa, no topo.',
  abrir_no_stremio: 'Abrir no Stremio',
  fechar: 'Fechar',
  janela_se_nao: 'Se o botão não abrir o Stremio, copia este link e cola-o na pesquisa da página de extensões do Stremio:',
  link_aria: 'Link da extensão',
  copiar: 'Copiar',
  copiado: 'Copiado',
};

const en = {
  lingua: 'en',
  local: 'en',
  titulo: 'Addon Order',
  descricao_pagina: 'Change the order of your Stremio add-ons: on the home screen, in Discover and in search.',
  lingua_rotulo: 'Language',
  instalar: 'Install in Stremio',
  sair: 'Sign out',

  entrada_titulo: 'Your add-ons, in the order you want.',
  entrada_texto: 'Stremio shows its rows and search results in the order of your add-ons, but won’t let you change it. This page does: drag your add-ons into any order you like and save.',
  entrar_link: 'Sign in with my Stremio account',
  ver_exemplo: 'See an example',
  alternativa: 'I’d rather type my email and password',
  campo_email: 'Stremio account email',
  campo_senha: 'Password',
  entrar: 'Sign in',
  passo1: 'Open Stremio’s confirmation page (sign in to your account if it asks).',
  passo2: 'Check that the code is this one:',
  abrir_confirmacao: 'Open the confirmation page',
  cancelar: 'Cancel',
  a_espera: 'Waiting for confirmation… this page carries on by itself.',
  privacidade: 'Your password never goes through here: it goes straight to Stremio. This page only keeps, in this browser, the key Stremio gives it to read and reorder your add-ons. To delete it, click “Sign out”.',

  a_ler: 'Reading your Stremio add-ons…',

  aviso_demo_html: 'This is an <strong>example</strong>. Play around as much as you like: nothing is saved.',
  demo_entrar: 'Reorder my add-ons',

  ola: (nome) => `Hi, ${nome}.`,
  ola_sem_nome: 'Your add-ons',
  heroi_titulo: 'Change the order of your add-ons.',
  heroi_texto: 'Stremio shows home-screen rows and search results in the order of your add-ons. Here you choose that order: drag your add-ons or use the arrows, and save.',

  lista_titulo: 'All add-ons',
  lista_sub: 'Drag by the handle or use the arrows. Top to bottom is Stremio’s order.',
  etiqueta_oficial: 'Official',
  etiqueta_pesquisa: 'Search',
  etiqueta_catalogos: 'Home rows',
  arrastar: (nome) => `Drag ${nome}`,
  subir: (nome) => `Move ${nome} up`,
  descer: (nome) => `Move ${nome} down`,
  topo: (nome) => `Move ${nome} to the top`,

  por_guardar: 'You have unsaved changes.',
  guardar: 'Save to Stremio',
  desfazer: 'Undo',
  a_guardar: 'Saving…',
  guardado_html: '<strong>Saved.</strong> Close and reopen Stremio (on every device) to see the new order.',
  guardado_demo_html: '<strong>Nothing is saved in the example</strong>, but with your account this is it: close and reopen Stremio and you’re done.',
  repor: 'Restore the previous order',
  erro_mudou: 'Your add-ons changed in the meantime (on another device?). I’ve reloaded the list: check the order and save again.',
  erro_guardar: 'Stremio didn’t accept the new order. Nothing was changed. Try again in a moment.',
  erro_ligacao: 'Couldn’t reach Stremio. Check your internet connection and try again.',
  erro_codigo: 'The code expired before it was confirmed. Click “Sign in” again to get a new one.',
  erro_senha: 'Stremio didn’t accept that email and password. If you sign in to Stremio with Facebook, Google or Apple, use the “Sign in with my Stremio account” button.',
  erro_sessao: 'Your Stremio session has ended. Please sign in again.',
  sair_alteracoes: 'You have unsaved changes. Sign out anyway?',

  como_titulo: 'What the order does',
  como_1_html: '<strong>Home screen and Discover</strong> — rows appear in the order of your add-ons (unless you’ve reordered them by hand in Stremio’s settings).',
  como_2_html: '<strong>Search</strong> — results from each add-on with search appear in the same order. The ones tagged “Search” are the ones that count.',
  como_3_html: '<strong>Movie and series details</strong> — if you have more than one metadata add-on, Stremio uses the first one in the list for plots, casts and artwork.',

  rodape: 'This page is not made by Stremio. It only changes the order of your add-ons; it never installs or removes any.',

  janela_titulo: 'Install in Stremio',
  janela_texto_html: 'The add-on doesn’t add any rows or catalogues: it just keeps this page at hand. In Stremio, open your add-ons and click <strong>Configure</strong> on Addon Order.',
  janela_local_html: '<strong>On this computer:</strong> click “Copy”, open Stremio’s add-ons (the puzzle-piece icon) and paste the link into the search box at the top.',
  abrir_no_stremio: 'Open in Stremio',
  fechar: 'Close',
  janela_se_nao: 'If the button doesn’t open Stremio, copy this link and paste it into the search on Stremio’s add-ons page:',
  link_aria: 'Add-on link',
  copiar: 'Copy',
  copiado: 'Copied',
};

const TODAS = { pt, en };

export const textos = (lingua) => TODAS[lingua] || en;

// A língua pedida (?lang= ou a guardada) ou, sem ela, a do navegador.
export function linguaDe(pedida, preferidas = []) {
  if (pedida in TODAS) return pedida;
  for (const p of preferidas) {
    const codigo = String(p).slice(0, 2).toLowerCase();
    if (codigo in TODAS) return codigo;
  }
  return 'en';
}
