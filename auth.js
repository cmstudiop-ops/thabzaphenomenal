(function(){
'use strict';
const store=window.TPStore,db=store.db;
const $=id=>document.getElementById(id);
const params=new URLSearchParams(location.search);
const rawNext=params.get('next')||'account.html';
const next=/^(index\.html(?:#[\w-]+)?|cart\.html|account\.html)$/.test(rawNext)?rawNext:'account.html';
let mode=params.get('mode')==='signup'?'signup':'signin';
function message(text,error=false){$('authMessage').innerHTML='<div class="'+(error?'auth-error':'auth-success')+'">'+store.escape(text)+'</div>'}
function setMode(value){mode=value;const up=mode==='signup';$('registerFields').hidden=!up;$('signupHint').hidden=!up;$('firstName').required=up;$('lastName').required=up;$('forgotPassword').hidden=up;$('authTitle').textContent=up?'Create your account.':'Welcome back.';$('authSubtitle').textContent=up?'A personal account for your saved cart, orders and profile.':'Sign in to continue shopping and see your orders.';$('authSubmit').textContent=up?'Create my account':'Sign in';$('password').setAttribute('autocomplete',up?'new-password':'current-password');$('password').minLength=up?12:1;$('signInTab').classList.toggle('active',!up);$('signUpTab').classList.toggle('active',up);$('signInTab').setAttribute('aria-selected',String(!up));$('signUpTab').setAttribute('aria-selected',String(up));$('authMessage').replaceChildren();history.replaceState(null,'','?mode='+mode+(rawNext!=='account.html'?'&next='+encodeURIComponent(next):''))}
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));
$('authForm').addEventListener('submit',async e=>{e.preventDefault();const btn=$('authSubmit');btn.disabled=true;const email=$('email').value.trim(),password=$('password').value;try{
 if(mode==='signup'){
 const first=$('firstName').value.trim(),last=$('lastName').value.trim(),phone=$('phone').value.trim();
 if(!first||!last)throw Error('Please provide your first and last names.');
 if(password.length<12)throw Error('Use a password with at least 12 characters.');
 const redirect=location.origin+location.pathname.replace(/auth\.html$/,'account.html');
 const r=await db.auth.signUp({email,password,options:{emailRedirectTo:redirect,data:{first_name:first,last_name:last,phone}}});
 if(r.error)throw r.error;
 if(r.data.session){await store.refreshSession();location.href=next;return}
 message('Account request received. Check your email for a confirmation link, then sign in.');$('password').value='';
 }else{
 const r=await db.auth.signInWithPassword({email,password});
 if(r.error)throw r.error;
 await store.refreshSession();location.href=next;return;
 }
}catch(err){message(err.message||'Unable to complete sign-in.',true)}finally{btn.disabled=false}});
$('forgotPassword').addEventListener('click',async()=>{const email=$('email').value.trim();if(!email){message('Enter your email address above to request a password reset.',true);return}const r=await db.auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname.replace(/auth\.html$/,'account.html')});if(r.error)message(r.error.message,true);else message('If that account exists, password reset instructions have been sent to the email address.')});
setMode(mode);
window.addEventListener('tp-session-ready',e=>{if(e.detail.user&&new URLSearchParams(location.search).get('mode')!=='signup'){location.replace(next)}},{once:true});
})();