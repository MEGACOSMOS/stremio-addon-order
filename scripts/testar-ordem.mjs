// Confirma as contas da ordem (colecao.js) com a lista do exemplo.
// Corre com: node scripts/testar-ordem.mjs

import assert from 'node:assert/strict';
import { DEMO } from '../demo.js';
import { eCinemeta, posicaoCinemeta, cinemetaPrimeiro, mover, mesmaOrdem, mesmasExtensoes, reordenar, temPesquisa } from '../colecao.js';
import { textos, linguaDe } from '../textos.js';

const nomes = (lista) => lista.map((a) => a.manifest.name);

// O Cinemeta passa para o topo e o resto fica pela mesma ordem.
assert.equal(posicaoCinemeta(DEMO), 3);
const primeiro = cinemetaPrimeiro(DEMO);
assert.ok(eCinemeta(primeiro[0]));
assert.deepEqual(nomes(primeiro).slice(1), nomes(DEMO).filter((n) => n !== 'Cinemeta'));
assert.equal(DEMO.length, primeiro.length);
assert.equal(posicaoCinemeta(DEMO), 3, 'a lista original não muda');

// Já em primeiro: fica igual. Sem Cinemeta: fica igual.
assert.ok(mesmaOrdem(cinemetaPrimeiro(primeiro), primeiro));
const semCinemeta = DEMO.filter((a) => !eCinemeta(a));
assert.ok(mesmaOrdem(cinemetaPrimeiro(semCinemeta), semCinemeta));

// Reconhece o Cinemeta também só pelo endereço.
assert.ok(eCinemeta({ transportUrl: 'https://v3-cinemeta.strem.io/manifest.json', manifest: {} }));

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
assert.deepEqual([1, 2, 3, 4, 11, 12, 13, 21, 22, 101].map(en.lugar), ['1st', '2nd', '3rd', '4th', '11th', '12th', '13th', '21st', '22nd', '101st']);
assert.equal(pt.lugar(4), '4.º');

console.log('Tudo certo.');
