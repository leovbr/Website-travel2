/* NUSA auth UI fix — loaded by index.html when included. */
(function(){
  const K='nusa_auth_v1';
  const LANG={id:{login:'Masuk',register:'Daftar',has:'Sudah punya akun?',no:'Belum punya akun?',logout:'Keluar',notin:'Belum masuk',guest:'Tamu',welcome:'Selamat datang kembali',newAccount:'Buat akun baru'},en:{login:'Sign in',register:'Sign up',has:'Already have an account?',no:'Don\'t have an account?',logout:'Log out',notin:'Not signed in',guest:'Guest',welcome:'Welcome back',newAccount:'Create an account'},ja:{login:'ログイン',register:'登録',has:'アカウントをお持ちですか？',no:'アカウントをお持ちでないですか？',logout:'ログアウト',notin:'未ログイン',guest:'ゲスト',welcome:'おかえりなさい',newAccount:'アカウントを作成'},zh:{login:'登录',register:'注册',has:'已有账号？',no:'还没有账号？',logout:'退出',notin:'尚未登录',guest:'访客',welcome:'欢迎回来',newAccount:'创建账号'},ko:{login:'로그인',register:'가입',has:'이미 계정이 있나요?',no:'계정이 없나요?',logout:'로그아웃',notin:'로그인하지 않음',guest:'게스트',welcome:'다시 오신 것을 환영합니다',newAccount:'계정 만들기'},de:{login:'Anmelden',register:'Registrieren',has:'Bereits ein Konto?',no:'Noch kein Konto?',logout:'Abmelden',notin:'Nicht angemeldet',guest:'Gast',welcome:'Willkommen zurück',newAccount:'Konto erstellen'},fr:{login:'Se connecter',register:"S’inscrire",has:'Vous avez déjà un compte ?',no:"Vous n’avez pas encore de compte ?",logout:'Se déconnecter',notin:'Non connecté',guest:'Invité',welcome:'Bon retour',newAccount:'Créer un compte'}};
  function auth(){try{return JSON.parse(localStorage.getItem(K)||'null')}catch(e){return null}}
  function save(a){localStorage.setItem(K,JSON.stringify(a))}
  function lang(){return (window.state&&state.lang)||'id'}
  function L(k){return (LANG[lang()]||LANG.id)[k]}
  function setProfile(a){if(!window.state)return;state.profile=Object.assign({name:'',email:'',photo:'',password:''},state.profile||{},a);saveState();if(typeof updateUser==='function')updateUser()}
  function saveState(){if(typeof save==='function')save()}
  function isIn(){return !!auth()}
  window.NUSA_AUTH={
    loggedIn:isIn,
    logout:function(){localStorage.removeItem(K);setProfile({name:'',email:'',photo:'',password:''});if(typeof openMenu==='function')openMenu(false);if(typeof updateAuthUI==='function')updateAuthUI();toast(L('logout'));},
    open:function(mode){
      const a=auth();
      modalContent.innerHTML='<div style="max-width:520px;margin:auto;text-align:center;padding:25px 10px"><div class="kicker">NUSA ACCOUNT</div><h2 style="font:500 42px Playfair Display,serif;color:#671328;margin:8px 0 10px">'+(mode==='register'?L('newAccount'):L('welcome'))+'</h2><p class="mini">'+(mode==='register'?L('no'):L('has'))+'</p>'+
      (mode==='register'?'<div class="formGroup" style="text-align:left"><label>Username</label><input id="authName" autocomplete="username" placeholder="leovebriansyh"></div><div class="formGroup" style="text-align:left"><label>Email</label><input id="authEmail" type="email" autocomplete="email"></div><div class="formGroup" style="text-align:left"><label>Password</label><input id="authPass" type="password" autocomplete="new-password"></div><button class="btn dark" style="width:100%" onclick="NUSA_AUTH.register()">'+L('register')+'</button><button class="outline" style="width:100%;margin-top:8px" onclick="NUSA_AUTH.open(\'login\')">'+L('login')+'</button>':'<div class="formGroup" style="text-align:left"><label>Username / Email</label><input id="authName" autocomplete="username" value="'+(a&&a.name?esc(a.name):'')+'"></div><div class="formGroup" style="text-align:left"><label>Password</label><input id="authPass" type="password" autocomplete="current-password"></div><button class="btn dark" style="width:100%" onclick="NUSA_AUTH.login()">'+L('login')+'</button><button class="outline" style="width:100%;margin-top:8px" onclick="NUSA_AUTH.open(\'register\')">'+L('register')+'</button>')+'</div>';
      modal.classList.add('open')
    },
    register:function(){const n=authName.value.trim(),e=authEmail.value.trim(),p=authPass.value;if(!n||!e||p.length<6)return toast('Isi username, email dan password minimal 6 karakter.');save({name:n,email:e,password:p});setProfile({name:n,email:e,password:p});closeModal();if(typeof updateAuthUI==='function')updateAuthUI();toast(L('login')+' berhasil.');},
    login:function(){const n=authName.value.trim(),p=authPass.value,a=auth();if(!a||((n!==a.name&&n!==a.email)||p!==a.password))return toast('Username/email atau password salah.');setProfile({name:a.name,email:a.email,password:a.password});closeModal();if(typeof updateAuthUI==='function')updateAuthUI();toast(L('login')+' berhasil.')}
  };
  window.updateAuthUI=function(){
    const a=auth(), logged=!!a;
    const acc=document.getElementById('accountName');if(acc){acc.textContent=logged?a.name:L('login');acc.style.cursor='pointer';acc.onclick=function(){logged?openMenu(true):NUSA_AUTH.open('login')}}
    const mn=document.getElementById('menuName'),me=document.getElementById('menuEmail'),mp=document.getElementById('menuPhoto');
    if(mn)mn.textContent=logged?a.name:L('guest');
    if(me)me.textContent=logged?(a.email||''):L('notin');
    if(mp)mp.src=logged&&a.photo?a.photo:'https://i.pravatar.cc/100?u=nusa';
    const authBtn=document.getElementById('authMenuBtn');if(authBtn){authBtn.innerHTML='<span class="ico">'+(logged?'🚪':'🔑')+'</span>'+(logged?L('logout'):L('login'));authBtn.onclick=logged?NUSA_AUTH.logout:function(){openMenu(false);NUSA_AUTH.open('login')}}
  };
  window.renderAuthLang=function(){if(typeof renderLang==='function')renderLang();updateAuthUI()}
  const oldLogout=window.logout;window.logout=NUSA_AUTH.logout;
  const oldRenderLang=window.renderLang;
  window.renderLang=function(){if(typeof langs==='undefined')return;langs.innerHTML=LANGS.map(x=>'<button class="lang '+(state.lang===x[0]?'active':'')+'" onclick="state.lang=\''+x[0]+'\';save();renderLang();toast(\'Bahasa: '+x[2]+'\')">'+x[1]+' '+x[2]+'</button>').join('');updateAuthUI()};
  setTimeout(updateAuthUI,0);
})();