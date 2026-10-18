import fs from 'node:fs/promises';
const samples=[
 ['bloom','dlove-original',['/dlove/photos/bouquet-1.webp']],
 ['garden','garden-original',[]],
 ['wishes','wishes-original',['/dlove/wishes/photo-1.jpg']],
 ['galaxy','galaxy-original',['/dlove/galaxy/demo-photo.jpg']],
 ['valentine','valentine-original',['/dlove/valentine/photo-1.jpg']],
 ['birthday','birthday-original',[]],
 ['moon','moon-default',[]],
 ['moon-vip','moon-original',['/dlove/moon-vip/photos/photo-1.webp']],
 ['planet','planet-default',['/dlove/planet/b1.png']],
];
const base='http://localhost:3000';
const checks=[];
for(const [theme,music,photos] of samples){
 const page=await fetch(`${base}/mau/${theme}`);if(!page.ok)throw Error(`Demo ${theme}: ${page.status}`);
 const payload={theme,music,photos,recipient:'Kiểm tra mẫu',sender:'Thương Studio',title:'Món quà thử nghiệm',message:'Kiểm tra lưu nội dung và mở đúng trải nghiệm.',occasion:'2023-05-27'};
 const saved=await fetch(`${base}/api/gifts`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});const data=await saved.json();if(saved.status!==201)throw Error(JSON.stringify({theme,...data}));
 const persisted=JSON.parse(await fs.readFile(`.data/gifts/${data.id}.json`,'utf8'));if(persisted.theme!==theme||persisted.music!==music)throw Error(`Persistence ${theme}`);
 const gift=await fetch(`${base}${data.path}`);if(!gift.ok)throw Error(`Gift page ${theme}`);
 await fs.unlink(`.data/gifts/${data.id}.json`);
 checks.push(`${theme}: demo200, saved201, persisted, gift200`);
}
console.log(checks.join('\n'));
