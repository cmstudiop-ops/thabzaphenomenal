/* Thabza Phenomenal customer session & cart services */
(function(){
'use strict';
const url='https://tjlanldknskbahzxwecw.supabase.co',key='sb_publishable_4kTdJhBYRsTwIu3UWGDhDw_BXmVrsXw';
const db=window.supabase.createClient(url,key);
let currentUser=null,currentProfile=null,count=0,ready=false;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const name=v=>String(v||'').trim();
const initials=(p,u)=>{const f=name(p?.first_name||u?.user_metadata?.first_name),l=name(p?.last_name||u?.user_metadata?.last_name);return (f.charAt(0)+l.charAt(0)).toUpperCase()||(u?.email||'A').charAt(0).toUpperCase()};
const accountLink='account.html';
function notice(text,error=false){let t=document.getElementById('tpNotice');if(!t){t=document.createElement('div');t.id='tpNotice';document.body.append(t)}t.textContent=text;t.className='tp-notice '+(error?'error':'');clearTimeout(notice.timer);notice.timer=setTimeout(()=>t.remove(),4500)}
async function fetchProfile(){if(!currentUser)return null;const x=await db.from('tp_customers').select('*').eq('user_id',currentUser.id).maybeSingle();if(x.error)throw x.error;if(x.data)return x.data;const meta=currentUser.user_metadata||{};const up=await db.from('tp_customers').upsert({user_id:currentUser.id,first_name:name(meta.first_name),last_name:name(meta.last_name),phone:name(meta.phone)},{onConflict:'user_id'}).select().single();if(up.error)throw up.error;return up.data}
async function refreshCart(){if(!currentUser){count=0;renderHeader();return 0}const r=await db.from('tp_cart_items').select('id,quantity').eq('user_id',currentUser.id);if(!r.error)count=(r.data||[]).reduce((n,x)=>n+Number(x.quantity||0),0);renderHeader();window.dispatchEvent(new CustomEvent('tp-cart-change',{detail:{count}}));return count}
async function refreshSession(){const r=await db.auth.getUser();currentUser=r.data?.user||null;try{currentProfile=await fetchProfile()}catch(e){currentProfile=null;console.warn('Profile loading issue',e)}await refreshCart();renderHeader();return currentUser}
function accountSurface(){const p=document.querySelector('[data-tp-account]');if(!p)return;const signed=!!currentUser;
p.innerHTML='<div class="tp-desktop-account">'+(signed?'<a href="'+accountLink+'" class="tp-avatar" title="My account">'+esc(initials(currentProfile,currentUser))+'</a><a href="cart.html" class="tp-cart-link" title="Shopping cart">'+bagSvg()+'<span class="tp-cart-count">'+count+'</span></a>':'<a href="auth.html?mode=signin" class="tp-auth-plain">Sign in</a><a href="auth.html?mode=signup" class="tp-auth-gold">Sign up</a><a href="cart.html" class="tp-cart-link" aria-label="Shopping cart">'+bagSvg()+'<span class="tp-cart-count">'+count+'</span></a>')+'</div><div class="tp-mobile-account"><button id="tpAccountToggle" type="button" class="tp-account-trigger" aria-label="Account options" aria-expanded="false">'+(signed?'<span class="tp-avatar mobile">'+esc(initials(currentProfile,currentUser))+'</span>':userSvg())+'</button><a class="tp-cart-link" href="cart.html" aria-label="Shopping cart">'+bagSvg()+'<span class="tp-cart-count">'+count+'</span></a><div id="tpAccountMenu" class="tp-account-menu" hidden>'+(signed?'<div class="tp-menu-identity"><strong>'+esc(name(currentProfile?.first_name)+' '+name(currentProfile?.last_name))+'</strong><span>'+esc(currentUser.email)+'</span></div><a href="account.html">My dashboard</a><a href="cart.html">My cart ('+count+')</a><button type="button" id="tpMenuLogout">Sign out</button>':'<strong>Your account</strong><a href="auth.html?mode=signin">Sign in</a><a href="auth.html?mode=signup" class="tp-menu-signup">Create account</a>')+'</div></div>';
const toggle=document.getElementById('tpAccountToggle'),menu=document.getElementById('tpAccountMenu');toggle?.addEventListener('click',()=>{const on=menu.hidden;menu.hidden=!on;toggle.setAttribute('aria-expanded',String(on))});document.getElementById('tpMenuLogout')?.addEventListener('click',()=>signOut());
}
function renderHeader(){accountSurface()}
function bagSvg(){return '<svg class="tp-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h16l-1 13H5L4 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></svg>'}
function userSvg(){return '<svg class="tp-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4.5 21v-2.2c0-4 3.2-6.8 7.5-6.8s7.5 2.8 7.5 6.8V21"/></svg>'}
async function addToCart(productId,qty=1){if(!currentUser){location.href='auth.html?mode=signin&next='+encodeURIComponent('index.html#shop');return false}
if(!productId)return false;
const p=await db.from('tp_products').select('id,name,active').eq('id',productId).maybeSingle();
if(p.error||!p.data?.active){notice('This product is not currently available',true);return false}
const existing=await db.from('tp_cart_items').select('id,quantity').eq('user_id',currentUser.id).eq('product_id',productId).maybeSingle();
if(existing.error){notice(existing.error.message,true);return false}
const quantity=Math.min(100000,Math.max(1,Number(qty||1))+(existing.data?.quantity||0));
const payload=existing.data?db.from('tp_cart_items').update({quantity,updated_at:new Date().toISOString()}).eq('id',existing.data.id):db.from('tp_cart_items').insert({user_id:currentUser.id,product_id:productId,quantity});
const res=await payload.select('id');
if(res.error){notice(res.error.message,true);return false}
await refreshCart();notice(p.data.name+' added to your cart');return true}
async function signOut(){await db.auth.signOut();currentUser=null;currentProfile=null;count=0;renderHeader();location.href='index.html'}
const after=async()=>{await refreshSession();window.dispatchEvent(new CustomEvent('tp-session-ready',{detail:{user:currentUser,profile:currentProfile}}));ready=true};
db.auth.onAuthStateChange((event)=>{if(event==='SIGNED_OUT'){currentUser=null;currentProfile=null;count=0;renderHeader();window.dispatchEvent(new CustomEvent('tp-session-ready',{detail:{user:null,profile:null}}))}});
document.addEventListener('click',e=>{const toggle=document.getElementById('tpAccountToggle');const menu=document.getElementById('tpAccountMenu');if(menu&&!menu.hidden&&!menu.contains(e.target)&&!toggle?.contains(e.target))menu.hidden=true});
window.TPStore={db,initials,notice,escape:esc,addToCart,refreshCart,refreshSession,signOut,getUser:()=>currentUser,getProfile:()=>currentProfile,getCount:()=>count,isReady:()=>ready};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',after);else after();
})();