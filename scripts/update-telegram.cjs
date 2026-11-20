const fs = require('node:fs');
const {execFileSync} = require('node:child_process');
const path = require('node:path');
process.chdir(path.join(__dirname, '..'));
const get = url => execFileSync('curl', ['-fsSL','--retry','2','--max-time','35',url], {maxBuffer:8*1024*1024});
const decode = s => s.replace(/&#(x[\da-f]+|\d+);/gi,(_,v)=>String.fromCodePoint(v[0].toLowerCase()==='x'?parseInt(v.slice(1),16):Number(v))).replace(/&(amp|quot|apos|lt|gt|nbsp);/g,(_,v)=>({amp:'&',quot:'"',apos:"'",lt:'<',gt:'>',nbsp:' '}[v]));
const escape = s => s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const html = process.argv[2] ? fs.readFileSync(process.argv[2],'utf8') : get('https://t.me/s/wtf_starlight').toString('utf8');
const posts = html.split('<div class="tgme_widget_message_wrap js-widget_message_wrap">').slice(1).flatMap(block=>{
 const id=block.match(/data-post="wtf_starlight\/(\d+)"/)?.[1];
 if(!id || /class="[^"]*service_message/.test(block)) return [];
 const raw=block.match(/<div class="tgme_widget_message_text[^>]*>([\s\S]*?)<\/div>/)?.[1] || '';
 const text=decode(raw.replace(/<br\s*\/?\s*>/gi,'\n').replace(/<[^>]+>/g,'')).trim();
 const image=block.match(/class="tgme_widget_message_photo_wrap[^>]+background-image:url\('([^']+)'\)/)?.[1];
 const date=block.match(/<time datetime="([^"]+)"/)?.[1];
 if(!date || (!text&&!image)) return [];
 return [{id:Number(id),url:`https://t.me/wtf_starlight/${id}`,text,date,image}];
}).sort((a,b)=>b.id-a.id).slice(0,3);
if(posts.length<3) throw Error('Incomplete Telegram response; keeping previous feed');
fs.mkdirSync('assets/blog',{recursive:true}); fs.mkdirSync('data',{recursive:true});
for(const p of posts){if(p.image){const file=`assets/blog/${p.id}.jpg`;const bytes=get(p.image);if(bytes.length<500 || bytes[0]!==255 || bytes[1]!==216) throw Error('Invalid image; keeping previous feed');fs.writeFileSync(file+'.tmp',bytes);fs.renameSync(file+'.tmp',file);p.image=file;}}
const cards=posts.map(p=>`<a class="blog-post${p.image?'':' blog-post-text'}" href="${p.url}" target="_blank" rel="noopener">${p.image?`<div class="blog-post-image"><img src="${p.image}" alt="" loading="lazy"></div>`:''}<div class="blog-post-body"><time datetime="${escape(p.date)}">${new Date(p.date).toLocaleDateString('ru-RU',{day:'numeric',month:'long',timeZone:'Europe/Moscow'})}</time><p>${escape(p.text.slice(0,500))}</p><span class="blog-post-arrow" aria-hidden="true">↗</span></div></a>`).join('');
const section=`<!-- BLOG-FEED:START --><section id="blog" class="channel blog-feed" aria-labelledby="blog-title"><div class="blog-head"><h2 id="blog-title">Блог</h2><a href="https://t.me/wtf_starlight" target="_blank" rel="noopener">@wtf_starlight ↗</a></div><div class="blog-posts">${cards}</div></section><!-- BLOG-FEED:END -->`;
let index=fs.readFileSync('index.html','utf8');
if(index.includes('<!-- BLOG-FEED:START -->')) index=index.replace(/<!-- BLOG-FEED:START -->[\s\S]*?<!-- BLOG-FEED:END -->/,section);
else index=index.replace(/<section id="blog"[\s\S]*?(?=<section id="works")/,section);
if(!index.includes(section)) throw Error('Feed insertion failed');
fs.writeFileSync('data/telegram.json',JSON.stringify({channel:'wtf_starlight',posts},null,2)+'\n');fs.writeFileSync('index.html',index);
console.log('Updated posts:',posts.map(p=>p.id).join(', '));
