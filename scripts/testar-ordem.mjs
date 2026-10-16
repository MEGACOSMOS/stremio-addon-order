// Confirma as contas da ordem (colecao.js) com a lista do exemplo.
// Corre com: node scripts/testar-ordem.mjs

import assert from 'node:assert/strict';
import { DEMO } from '../demo.js';
import { mover, mesmaOrdem, mesmasExtensoes, reordenar, temPesquisa } from '../colecao.js';
import { textos, linguaDe } from '../textos.js';

const nomes = (lista) => lista.map((a) => a.manifest.name);

// mover() leva uma extensão para o topo e o resto fica pela mesma ordem.
const primeiro = mover(DEMO, 3, 0);
assert.equal(primeiro[0], DEMO[3]);
assert.deepEqual(nomes(primeiro).slice(1), nomes(DEMO).filter((_, i) => i !== 3));
assert.equal(nomes(DEMO)[0], 'Torrentio', 'a lista original não muda');
assert.ok(mesmaOrdem(mover(DEMO, 2, 2), DEMO));

// mover() nos limites.
assert.deepEqual(nomes(mover(DEMO, 0, 99)).at(-1), 'Torrentio');
assert.deepEqual(nomes(mover(DEMO, 7, -5))[0], 'Local Files');

// reordenar(): usa as descrições acabadas de ler, pela ordem pedida…
const lidaDeNovo = DEMO.map((a) => ({ ...a, manifest: { ...a.manifest, version: '9.9.9' } }));
const final = reordenar(lidaDeNovo, primeiro);
assert.ok(mesmaOrdem(final, primeiro));
assert.ok(final.every((a) => a.manifest.version === '9.9.9'));
// …e recusa se entretanto foi instalada ou removida alguma extensão.
assert.equal(reordenar(lidaDeNovo.slice(1), primeiro), null);
const outra = { transportUrl: 'https://exemplo.invalid/manifest.json', manifest: { name: 'Outra' } };
assert.equal(reordenar([...lidaDeNovo.slice(1), outra], primeiro), null);
assert.ok(!mesmasExtensoes(DEMO, [...DEMO.slice(1), DEMO[2]]));

// Pesquisa.
assert.deepEqual(nomes(DEMO.filter(temPesquisa)), ['The Movie Database Addon', 'Cinemeta', 'YouTube']);

// Textos: as duas línguas têm as mesmas chaves.
const pt = textos('pt');
const en = textos('en');
assert.deepEqual(Object.keys(pt).sort(), Object.keys(en).sort());
assert.equal(linguaDe(null, ['pt-BR', 'en']), 'pt');
assert.equal(linguaDe(null, ['de-DE']), 'en');

console.log('Tudo certo.');
