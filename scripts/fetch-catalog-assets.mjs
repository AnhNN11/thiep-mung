import fs from 'node:fs/promises';
import path from 'node:path';
const thumbs = [
['bloom','https://cdn.dlove.vn/uploads/happybirthday/Bo%CC%81%20hoa%20a%CC%89nh%20va%CC%80%20thu%CC%9B%20ye%CC%82u%20thu%CC%9Bo%CC%9Bng.png'],
['garden','https://cdn.dlove.vn/uploads/happybirthday/A%CC%89nh%20ma%CC%80n%20hi%CC%80nh%202026-10-16%20lu%CC%81c%2008.39.06.png'],
['wishes','https://cdn.deargift.online/uploads/ChatGPT%20Image%2023_13_56%2029%20thg%205%2C%202026.png'],
['galaxy','https://cdn.deargift.online/uploads/Screenshot%202025-06-16%20225325.png'],
['valentine','https://pub-55ae22ef68df430393b12b20b4b9bb5c.r2.dev/uploads/product-thumbnail-20260214-013133-pcgtzv.jpg'],
['birthday','https://cdn.deargift.online/uploads/Screenshot%202025-07-08%20123133.png'],
['moon','https://cdn.deargift.online/uploads/Screenshot%202025-10-04%20215125.png'],
['moon-vip','https://cdn.dlove.vn/uploads/admin/email_ece57a91eb6a6b6384c4b24d31d3bac5/img-mu7956kv-7752cd0e.jpg'],
['planet','https://pub-55ae22ef68df430393b12b20b4b9bb5c.r2.dev/uploads/Screenshot%202025-06-22%20003702.png']];
const tasks=thumbs.map(([id,url])=>({file:`public/dlove/thumbnails/${id}.jpg`,url}));
for (const [id,base,name] of [['wishes','https://womens-day-deargift.vercel.app/','women'],['valentine','https://valentine-deargift.vercel.app/','valentine']]) {
 const cfg=JSON.parse(await fs.readFile(`output/reference-${name==='women'?'women':name}-safe.json`,'utf8'));
 const images=cfg.sphereImages;
 const local=[];
 images.forEach((url,i)=>{const file=`/dlove/${id}/photo-${i+1}.jpg`;local.push(file);tasks.push({file:'public'+file,url});});
 const extra=id==='wishes'?{particle:cfg.particleImage,letter:cfg.letter.image}:{background:cfg.phoneBackground,avatar:cfg.avatar,icon:cfg.appIcon,left:cfg.heart.heartSideImageLeft,right:cfg.heart.heartSideImageRight};
 for(const [key,url] of Object.entries(extra)) tasks.push({file:`public/dlove/${id}/${key}.jpg`,url});
 tasks.push({file:`public/dlove/${id}/music.mp3`,url:new URL(cfg.bgMusic,base).href,optional:true});
 tasks.push({file:`public/dlove/${id}/fallback.mp3`,url:new URL('assets/music/bgmucsic.mp3',base).href});
 await fs.mkdir(`public/dlove/${id}`,{recursive:true});
 await fs.writeFile(`public/dlove/${id}/photos.json`,JSON.stringify(local));
}
const manifest=[];
await Promise.all(tasks.map(async ({file,url,optional})=>{
 try {const r=await fetch(url);if(!r.ok)throw Error(String(r.status));const data=Buffer.from(await r.arrayBuffer());await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,data);manifest.push({file,url,bytes:data.length});}
 catch(e){manifest.push({file,url,error:String(e),optional});}
}));
await fs.writeFile('output/catalog-asset-manifest.json',JSON.stringify(manifest,null,2));
console.log(manifest.map(x=>`${x.file}: ${x.bytes||x.error}`).join('\n'));
