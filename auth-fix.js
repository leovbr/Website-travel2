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

  /* NUSA hidden owner mode — demo/CMS layer (localStorage only) */
  (function(){
    const OK='nusa_owner_v1', IK='nusa_custom_images_v1', OWNER_PIN='NUSA-OWNER';
    let taps=0,timer=null;
    function owner(){return localStorage.getItem(OK)==='1'}
    function imgs(){try{return JSON.parse(localStorage.getItem(IK)||'{}')}catch(e){return {}}}
    function saveImgs(x){localStorage.setItem(IK,JSON.stringify(x))}
    function openOwnerLogin(){
      if(owner()) return openOwnerPanel();
      modalContent.innerHTML='<div style="max-width:480px;margin:auto;text-align:center;padding:30px 12px"><div class="kicker">NUSA PRIVATE</div><h2 style="font:500 40px Playfair Display,serif;color:#671328;margin:8px 0">Owner Access</h2><p class="mini">Masukkan access key untuk membuka mode pengelola.</p><div class="formGroup" style="text-align:left"><label>Access key</label><input id="ownerPin" type="password" autocomplete="off" placeholder="••••••••"></div><button class="btn dark" style="width:100%" onclick="NUSA_OWNER.login()">Masuk sebagai Owner</button><p style="font-size:11px;opacity:.55;margin:14px 0 0">Demo mode · data tersimpan di perangkat ini.</p></div>';
      modal.classList.add('open');
      setTimeout(function(){var x=document.getElementById('ownerPin');if(x)x.focus()},50);
    }
    function openOwnerPanel(){
      const im=imgs();
      modalContent.innerHTML='<div style="max-width:720px;margin:auto;padding:22px 8px"><div class="kicker">NUSA OWNER</div><div style="display:flex;justify-content:space-between;align-items:center;gap:12px"><div><h2 style="font:500 38px Playfair Display,serif;color:#671328;margin:5px 0">Kelola katalog</h2><p class="mini" style="margin:0">Ganti foto kartu langsung dari website.</p></div><button class="outline" onclick="NUSA_OWNER.logout()">Keluar</button></div><div id="ownerCatalog" style="margin-top:20px"></div></div>';
      modal.classList.add('open');
      setTimeout(renderOwnerCatalog,0);
    }
    function renderOwnerCatalog(){
      const box=document.getElementById('ownerCatalog'); if(!box)return;
      const data=Object.assign({},window.NUSA_CATALOG||{});
      const im=imgs(), keys=Object.keys(data);
      if(!keys.length){box.innerHTML='<p class="mini">Katalog belum siap.</p>';return}
      box.innerHTML=keys.map(function(k){
        const safe=String(k).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
        return '<div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #ddd"><img src="'+(im[k]||data[k]||'')+'" style="width:72px;height:58px;object-fit:cover;border-radius:9px;background:#eee"><div style="flex:1;min-width:0"><b style="font:600 15px DM Sans,sans-serif">'+safe+'</b><div style="font-size:11px;opacity:.55">Foto '+(im[k]?'custom':'default')+'</div></div><label class="outline" style="cursor:pointer;white-space:nowrap">Ganti foto<input type="file" accept="image/*" data-owner-image="'+safe+'" style="display:none"></label></div>';
      }).join('');
      box.querySelectorAll('input[data-owner-image]').forEach(function(inp){
        inp.addEventListener('change',function(){
          const f=this.files&&this.files[0]; if(!f)return;
          if(f.size>4*1024*1024)return toast('Foto maksimal 4 MB untuk mode demo.');
          const reader=new FileReader();
          reader.onload=function(){
            const all=imgs(); all[inp.getAttribute('data-owner-image')]=reader.result; saveImgs(all);
            applyCustomImages(); renderOwnerCatalog(); toast('Foto berhasil diganti.');
          };
          reader.readAsDataURL(f);
        });
      });
    }
    function applyCustomImages(){
      const im=imgs();
      document.querySelectorAll('.nusaFallbackCard').forEach(function(card){
        const t=card.querySelector('strong'); const img=card.querySelector('img');
        if(t&&img&&im[t.textContent]){img.src=im[t.textContent];img.dataset.nusaCustom='1'}
      });
    }
    window.NUSA_OWNER={login:function(){
      const pin=(document.getElementById('ownerPin')||{}).value||'';
      if(pin!==OWNER_PIN)return toast('Access key salah.');
      localStorage.setItem(OK,'1');closeModal();toast('Owner mode aktif.');setTimeout(openOwnerPanel,120);
    },open:openOwnerLogin,panel:openOwnerPanel,logout:function(){localStorage.removeItem(OK);closeModal();toast('Owner mode ditutup.')}};
    window.addEventListener('load',function(){
      const logo=document.querySelector('.logo'); if(!logo)return;
      logo.addEventListener('click',function(e){
        if(owner()){e.preventDefault();openOwnerPanel();return}
        taps++;clearTimeout(timer);timer=setTimeout(function(){taps=0},2500);
        if(taps>=7){e.preventDefault();taps=0;openOwnerLogin();}
      },true);
      window.NUSA_OWNER.open=window.NUSA_OWNER.open||openOwnerLogin;
      setTimeout(applyCustomImages,400);
    });
    window.NUSA_OWNER_APPLY=applyCustomImages;
  })();
})();