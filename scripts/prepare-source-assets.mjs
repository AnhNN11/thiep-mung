import fs from 'node:fs/promises';
import sharp from 'sharp';
import crypto from 'node:crypto';
const base='public/dlove/thumbnails';
for (const name of await fs.readdir(base)) {if(!name.endsWith('.jpg'))continue;await sharp(`${base}/${name}`).resize(900,900,{fit:'inside',withoutEnlargement:true}).webp({quality:84}).toFile(`${base}/${name.replace('.jpg','.webp')}`);}
const url='https://valentine-deargift.vercel.app/musics/tinhyeugiuamuadong.mp3';
try{const r=await fetch(url,{signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error(String(r.status));const b=Buffer.from(await r.arrayBuffer());await fs.writeFile('public/dlove/valentine/music.mp3',b);console.log('Valentine music',b.length,crypto.createHash('sha256').update(b).digest('hex'));}catch(e){console.log('Valentine configured music unavailable:',String(e));}
const references=JSON.parse(await fs.readFile('output/catalog-asset-manifest.json','utf8'));
const extra=JSON.parse(await fs.readFile('output/reference-moon/assets.json','utf8'));
const garden=JSON.parse(await fs.readFile('output/reference-garden-downloads.json','utf8'));
await fs.writeFile('public/dlove/catalog-provenance.json',JSON.stringify({checked:'2026-10-18',catalog:references,moon:extra,garden},null,2));
console.log('Thumbnails optimized; source provenance written');
