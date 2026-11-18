/* Public, non-sensitive settings only. Never store secrets in tp_settings. */
(async function(){
const project='https://tjlanldknskbahzxwecw.supabase.co';
const publicKey='sb_publishable_4kTdJhBYRsTwIu3UWGDhDw_BXmVrsXw';
try{
 const res=await fetch(project+'/rest/v1/tp_settings?select=key,value',{headers:{apikey:publicKey,Accept:'application/json'}});
 if(!res.ok)throw new Error('Settings unavailable: '+res.status);
 const rows=await res.json();const s=Object.fromEntries(rows.map(r=>[r.key,r.value||'']));
 const pick=(sel)=>document.querySelector(sel);
 const text=(sel,value)=>{if(value){const el=pick(sel);if(el)el.textContent=value}};
 const address=s.address||'',phone=s.phone||'',email=s.email||'',wa=(s.whatsapp||'').replace(/\D/g,'');
 if(s.seo_title)document.title=s.seo_title+(document.title.includes('About')?' — About Us':document.title.includes('Portfolio')?' — Portfolio':'');
 if(s.seo_description){const meta=pick('meta[name="description"]');if(meta)meta.setAttribute('content',s.seo_description)}
 if(/^#[0-9a-f]{6}$/i.test(s.site_accent||''))document.documentElement.style.setProperty('--gold',s.site_accent);
 if(s.logo_url&&/^https:\/\//i.test(s.logo_url))document.querySelectorAll('.brand-logo,.logo').forEach(img=>img.src=s.logo_url);
 const hero=pick('.hero-premium');if(hero&&s.hero_image_url&&/^https:\/\//i.test(s.hero_image_url))hero.style.backgroundImage='linear-gradient(90deg,#181818 0%,#191919dd 32%,#15151533 72%),url("'+s.hero_image_url.replaceAll('"','%22')+'")';
 const aboutHero=pick('.about-visual');if(aboutHero&&s.hero_image_url&&/^https:\/\//i.test(s.hero_image_url))aboutHero.style.backgroundImage='linear-gradient(150deg,#111b18aa,#181b1688),url("'+s.hero_image_url.replaceAll('"','%22')+'")';
 const heroHeadline=pick('.hero-premium h1');
 if(heroHeadline&&s.hero_title){
  const raw=s.hero_title.trim();let lines=raw.includes('|')?raw.split('|').map(x=>x.trim()).filter(Boolean):[];
  if(!lines.length&&raw.includes(',')){const at=raw.lastIndexOf(',');const start=raw.slice(0,at+1).trim(),end=raw.slice(at+1).trim();const words=start.split(/\s+/);const mid=Math.ceil(words.length/2);lines=[words.slice(0,mid).join(' '),words.slice(mid).join(' '),end].filter(Boolean)}
  if(lines.length>1){heroHeadline.replaceChildren();lines.forEach((line,i)=>{if(i)heroHeadline.append(document.createElement('br'));if(i===lines.length-1){const em=document.createElement('em');em.textContent=line;heroHeadline.append(em)}else heroHeadline.append(document.createTextNode(line))})}else heroHeadline.textContent=raw
 }
 text('.hero-premium .hero-text>p',s.hero_subtitle);text('#shop .section-head h2',s.home_catalogue_heading);
 text('.final-premium h2',s.contact_heading);text('.page-hero h1',document.title.includes('Portfolio')?s.portfolio_heading:null);
 text('.about-grid .intro',s.company_about);
 const cta=pick('.hero-premium .hero-buttons .btn-gold');
 if(cta&&s.hero_button){for(const node of cta.childNodes){if(node.nodeType===Node.TEXT_NODE){node.textContent=s.hero_button+' ';break}}}
 if(phone)document.querySelectorAll('a[href^="tel:"]').forEach(a=>{a.href='tel:'+phone.replace(/[^\d+]/g,'');a.textContent=phone});
 if(email)document.querySelectorAll('a[href^="mailto:"]').forEach(a=>{a.href='mailto:'+email;a.textContent=email});
 if(wa)document.querySelectorAll('a[href^="https://wa.me/"]').forEach(a=>{a.href='https://wa.me/'+wa+'?text='+encodeURIComponent(s.quote_auto_reply||'Hello Thabza Phenomenal, I would like a quotation.')});
 const foot=pick('footer .foot-grid>div:last-child')||pick('footer .footer-grid>div:last-child');
 if(foot){
  if(address){const p=document.createElement('p');p.textContent=address;p.className='business-address';p.style.marginTop='10px';foot.append(p)}
  if(s.business_hours){const p=document.createElement('p');p.textContent=s.business_hours;p.style.marginTop='5px';foot.append(p)}
  const social=document.createElement('div');social.className='footer-social';social.style.cssText='display:flex;gap:12px;flex-wrap:wrap;margin-top:12px';
  ['facebook','instagram','tiktok','linkedin'].forEach(key=>{const url=s[key];if(url&&/^https:\/\//i.test(url)){const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=key[0].toUpperCase()+key.slice(1);a.style.cssText='font-size:11px;text-decoration:underline;text-underline-offset:3px';social.append(a)}});foot.append(social);
 }
 if(s.website_notice&&document.body&&!document.getElementById('websiteNotice')){
  const n=document.createElement('div');n.id='websiteNotice';n.textContent=s.website_notice;n.setAttribute('role','status');n.style.cssText='background:#e8c46f;color:#252018;text-align:center;font-size:11px;font-weight:800;padding:8px 15px';
  const header=pick('header');if(header)header.insertAdjacentElement('beforebegin',n)
 }
}catch(err){console.info('Public settings could not be loaded; using website defaults.',err.message)}
})();