/* NUSA AUTH v2 — user + private owner authentication (demo/localStorage) */
(function(){
  const USER_KEY='nusa_users_v2', SESSION_KEY='nusa_session_v2', OWNER_KEY='nusa_owner_v2', OWNER_SESSION='nusa_owner_session_v2', IMG_KEY='nusa_custom_images_v1';
  const OWNER_ACCESS='NUSA-OWNER';
  const get=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(d))}catch(e){return d}};
  const put=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const users=()=>get(USER_KEY,[]);
  const owner=()=>get(OWNER_KEY,null);
  const session=()=>get(SESSION_KEY,null);
  const ownerSession=()=>get(OWNER_SESSION,null);
  const close=()=>{if(typeof closeModal==='function')closeModal()};
  const toastMsg=m=>{if(typeof toast==='function')toast(m);else alert(m)};
  const esc2=s=>String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  function setUserState(a){
    if(!window.state)return;
    state.profile=Object.assign({},state.profile||{},a||{});
    if(typeof save==='function')save();
    if(typeof updateUser==='function')updateUser();
  }
  function saveSession(a){put(SESSION_KEY,a)}
  function normalLoginPage(){location.href='user.html'}
  function ownerLoginPage(){location.href='owner.html'}
  function authCard(title,sub,body){
    modalContent.innerHTML='<div style="max-width:500px;margin:auto;text-align:center;padding:24px 10px"><div class="kicker">NUSA PRIVATE</div><h2 style="font:500 40px Playfair Display,serif;color:#671328;margin:7px 0 10px">'+title+'</h2><p class="mini">'+sub+'</p>'+body+'</div>';
    modal.classList.add('open');
  }
  function ownerAccess(){
    authCard('Owner Access','Akses pengelola NUSA. Belum memiliki akun Owner? Daftar terlebih dahulu.',
      '<div style="display:flex;gap:8px;margin:18px 0 12px"><button id="ownerLoginTab" class="btn dark" style="flex:1">Login</button><button id="ownerRegTab" class="outline" style="flex:1">Daftar</button></div><div id="ownerAuthBox"></div>');
    renderOwnerLogin();
    ownerAuthTabs();
  }
  function ownerAuthTabs(){
    const a=document.getElementById('ownerLoginTab'),b=document.getElementById('ownerRegTab');
    if(a)a.onclick=()=>{renderOwnerLogin();ownerAuthTabs()};
    if(b)b.onclick=()=>{renderOwnerRegister();ownerAuthTabs()};
  }
  function field(id,label,type,extra=''){return '<div class="formGroup" style="text-align:left"><label>'+label+'</label><input id="'+id+'" type="'+type+'" '+extra+'></div>'}
  function renderOwnerLogin(){
    const box=document.getElementById('ownerAuthBox');if(!box)return;
    box.innerHTML=field('oUser','Username','text','autocomplete="username" placeholder="username"')+
      field('oPass','Kata Sandi','password','autocomplete="current-password" placeholder="••••••••"')+
      field('oPin','PIN','password','inputmode="numeric" maxlength="6" placeholder="6 digit PIN"')+
      '<button class="btn dark" style="width:100%" onclick="NUSA_OWNER.login()">Masuk sebagai Owner</button>'+
      '<div style="display:flex;justify-content:center;gap:16px;margin-top:14px;font-size:12px"><button class="linkBtn" onclick="NUSA_OWNER.recover(\'password\')">Lupa kata sandi?</button><button class="linkBtn" onclick="NUSA_OWNER.recover(\'pin\')">Lupa PIN?</button></div>';
  }
  function renderOwnerRegister(){
    const box=document.getElementById('ownerAuthBox');if(!box)return;
    box.innerHTML=field('oWa','Nomor WhatsApp','tel','placeholder="+62 8xx xxxx xxxx"')+
      field('oUser','Username','text','autocomplete="username" placeholder="username"')+
      field('oEmail','Email','email','autocomplete="email" placeholder="email@example.com"')+
      field('oPass','Kata Sandi','password','autocomplete="new-password" placeholder="minimal 6 karakter"')+
      field('oPin','PIN','password','inputmode="numeric" maxlength="6" placeholder="6 digit PIN"')+
      '<button class="btn dark" style="width:100%" onclick="NUSA_OWNER.register()">Buat Owner Account</button>'+
      '<p class="mini" style="margin-top:12px">Verifikasi email akan terhubung saat backend aktif.</p>';
  }
  function renderRecovery(kind){
    authCard(kind==='pin'?'Lupa PIN':'Lupa Kata Sandi','Verifikasi menggunakan email Owner.',
      field('recEmail','Email','email','autocomplete="email" placeholder="email@example.com"')+
      '<button class="btn dark" style="width:100%" onclick="NUSA_OWNER.sendRecovery(\''+kind+'\')">Kirim Verifikasi</button>'+
      '<button class="outline" style="width:100%;margin-top:8px" onclick="NUSA_OWNER.open()">Kembali ke Login</button>');
  }
  window.NUSA_OWNER={
    open:ownerAccess,
    login:function(){
      const a=owner(),u=(document.getElementById('oUser')||{}).value?.trim(),p=(document.getElementById('oPass')||{}).value||'',pin=(document.getElementById('oPin')||{}).value||'';
      if(!a)return toastMsg('Owner belum terdaftar. Pilih Daftar terlebih dahulu.');
      if(a.username!==u||a.password!==p||a.pin!==pin)return toastMsg('Username, kata sandi, atau PIN Owner salah.');
      put(OWNER_SESSION,{username:a.username,name:a.name||a.username,email:a.email});
      close();toastMsg('Owner berhasil masuk.');setTimeout(ownerLoginPage,120);
    },
    register:function(){
      const wa=(document.getElementById('oWa')||{}).value?.trim(),u=(document.getElementById('oUser')||{}).value?.trim(),e=(document.getElementById('oEmail')||{}).value?.trim(),p=(document.getElementById('oPass')||{}).value||'',pin=(document.getElementById('oPin')||{}).value||'';
      if(!wa||!u||!e||p.length<6||!/^[0-9]{6}$/.test(pin))return toastMsg('Lengkapi semua data. Password minimal 6 karakter dan PIN harus 6 digit.');
      if(owner())return toastMsg('Owner Account sudah terdaftar di perangkat ini.');
      put(OWNER_KEY,{name:u,wa,username:u,email:e,password:p,pin,verified:false,createdAt:Date.now()});
      toastMsg('Owner Account berhasil dibuat. Silakan login.');
      renderOwnerLogin();ownerAuthTabs();
    },
    recover:function(kind){renderRecovery(kind)},
    sendRecovery:function(kind){
      const e=(document.getElementById('recEmail')||{}).value?.trim(),a=owner();
      if(!a||!e||e!==a.email)return toastMsg('Email Owner tidak ditemukan.');
      authCard('Verifikasi Email','Demo mode: email verification disimulasikan di perangkat ini.',
        '<p class="mini">Verifikasi untuk '+esc2(e)+' berhasil.</p><button class="btn dark" style="width:100%" onclick="NUSA_OWNER.reset(\''+kind+'\')">Lanjutkan</button>');
    },
    reset:function(kind){
      const a=owner(); if(!a)return;
      const label=kind==='pin'?'PIN baru (6 digit)':'Kata sandi baru';
      authCard(kind==='pin'?'Atur Ulang PIN':'Atur Ulang Kata Sandi','Buat kredensial baru untuk Owner.',
        field('resetVal',label,kind==='pin'?'password':'password',kind==='pin'?'inputmode="numeric" maxlength="6" placeholder="6 digit PIN"':'autocomplete="new-password" placeholder="minimal 6 karakter"')+
        '<button class="btn dark" style="width:100%" onclick="NUSA_OWNER.saveReset(\''+kind+'\')">Simpan</button>');
    },
    saveReset:function(kind){
      const v=(document.getElementById('resetVal')||{}).value||'',a=owner();
      if(kind==='pin'&&!/^[0-9]{6}$/.test(v))return toastMsg('PIN harus 6 digit.');
      if(kind==='password'&&v.length<6)return toastMsg('Password minimal 6 karakter.');
      a[kind==='pin'?'pin':'password']=v;put(OWNER_KEY,a);toastMsg('Berhasil diperbarui.');renderOwnerLogin();ownerAuthTabs();
    },
    logout:function(){localStorage.removeItem(OWNER_SESSION);location.href='index.html'}
  };

  window.NUSA_AUTH={
    open:function(mode){
      if(mode==='register')return userRegister();
      return userLogin();
    },
    login:function(){
      const u=(document.getElementById('authUser')||{}).value?.trim(),p=(document.getElementById('authPass')||{}).value||'',arr=users(),a=arr.find(x=>(x.username===u||x.email===u)&&x.password===p);
      if(!a)return toastMsg('Username/email atau password salah.');
      saveSession({username:a.username,name:a.name,email:a.email,photo:a.photo||''});setUserState(a);close();toastMsg('Login berhasil.');setTimeout(normalLoginPage,120);
    },
    register:function(){
      const n=(document.getElementById('authName')||{}).value?.trim(),u=(document.getElementById('authUser')||{}).value?.trim(),wa=(document.getElementById('authWa')||{}).value?.trim(),e=(document.getElementById('authEmail')||{}).value?.trim(),p=(document.getElementById('authPass')||{}).value||'',arr=users();
      if(!n||!u||!wa||!e||p.length<6)return toastMsg('Lengkapi semua data. Password minimal 6 karakter.');
      if(arr.some(x=>x.username===u||x.email===e))return toastMsg('Username atau email sudah digunakan.');
      const a={name:n,username:u,wa,email:e,password:p,photo:'',createdAt:Date.now()};arr.push(a);put(USER_KEY,arr);saveSession({username:u,name:n,email:e,photo:''});setUserState(a);close();toastMsg('Akun berhasil dibuat.');setTimeout(normalLoginPage,120);
    },
    logout:function(){localStorage.removeItem(SESSION_KEY);setUserState({name:'',email:'',photo:'',password:''});if(typeof openMenu==='function')openMenu(false);updateAuthUI();toastMsg('Keluar berhasil.')},
    loggedIn:()=>!!session()
  };
  function userLogin(){
    authCard('Login','Masuk sebagai pengguna NUSA.',
      field('authUser','Username / Email','text','autocomplete="username" placeholder="username atau email"')+
      field('authPass','Kata Sandi','password','autocomplete="current-password" placeholder="••••••••"')+
      '<button class="btn dark" style="width:100%" onclick="NUSA_AUTH.login()">Masuk</button>'+
      '<div style="margin-top:12px"><button class="linkBtn" onclick="NUSA_AUTH.forgot()">Lupa kata sandi?</button></div>'+
      '<p class="mini" style="margin-top:15px">Belum memiliki akun? <button class="linkBtn" onclick="NUSA_AUTH.open(\'register\')">Daftar</button></p>');
  }
  function userRegister(){
    authCard('Buat Akun','Daftar sebagai pengguna NUSA.',
      field('authName','Nama','text','autocomplete="name" placeholder="Nama kamu"')+
      field('authUser','Username','text','autocomplete="username" placeholder="username"')+
      field('authWa','Nomor WhatsApp','tel','placeholder="+62 8xx xxxx xxxx"')+
      field('authEmail','Email','email','autocomplete="email" placeholder="email@example.com"')+
      field('authPass','Kata Sandi','password','autocomplete="new-password" placeholder="minimal 6 karakter"')+
      '<button class="btn dark" style="width:100%" onclick="NUSA_AUTH.register()">Daftar</button>'+
      '<p class="mini" style="margin-top:15px">Sudah memiliki akun? <button class="linkBtn" onclick="NUSA_AUTH.open(\'login\')">Login</button></p>');
  }
  NUSA_AUTH.forgot=function(){
    authCard('Lupa Kata Sandi','Masukkan email akun untuk verifikasi.',
      field('forgotEmail','Email','email','placeholder="email@example.com"')+
      '<button class="btn dark" style="width:100%" onclick="NUSA_AUTH.recover()">Kirim Verifikasi</button>');
  };
  NUSA_AUTH.recover=function(){
    const e=(document.getElementById('forgotEmail')||{}).value?.trim(),arr=users(),a=arr.find(x=>x.email===e);
    if(!a)return toastMsg('Email tidak ditemukan.');
    authCard('Verifikasi Email','Demo mode: verifikasi email disimulasikan di perangkat ini.',
      '<p class="mini">Verifikasi untuk '+esc2(e)+' berhasil.</p><button class="btn dark" style="width:100%" onclick="NUSA_AUTH.reset(\''+esc2(e)+'\')">Atur Ulang Password</button>');
  };
  NUSA_AUTH.reset=function(e){
    authCard('Password Baru','Buat password baru.',
      field('newPass','Password Baru','password','autocomplete="new-password" placeholder="minimal 6 karakter"')+
      '<button class="btn dark" style="width:100%" onclick="NUSA_AUTH.saveReset(\''+esc2(e)+'\')">Simpan</button>');
  };
  NUSA_AUTH.saveReset=function(e){
    const p=(document.getElementById('newPass')||{}).value||'',arr=users(),a=arr.find(x=>x.email===e);
    if(p.length<6)return toastMsg('Password minimal 6 karakter.');
    a.password=p;put(USER_KEY,arr);toastMsg('Password berhasil diubah.');userLogin();
  };

  NUSA_OWNER.panel=function(){
    if(!ownerSession())return ownerAccess();
    const data=Object.assign({},window.NUSA_CATALOG||{}),im=get(IMG_KEY,{});
    const html=Object.keys(data).map(function(k){
      const safe=esc2(k);
      return '<div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #ddd"><img src="'+esc2(im[k]||data[k]||'')+'" style="width:72px;height:58px;object-fit:cover;border-radius:9px;background:#eee"><div style="flex:1;min-width:0"><b>'+safe+'</b><div style="font-size:11px;opacity:.55">'+(im[k]?'Foto custom':'Foto default')+'</div></div><label class="outline" style="cursor:pointer">Ganti foto<input type="file" accept="image/*" data-owner-image="'+safe+'" style="display:none"></label></div>';
    }).join('');
    authCard('Kelola Katalog','Owner · ganti foto katalog langsung dari perangkat.','<div id="ownerCatalogBox" style="text-align:left;max-height:58vh;overflow:auto">'+(html||'<p class="mini">Katalog belum siap.</p>')+'</div><button class="outline" style="width:100%;margin-top:12px" onclick="NUSA_OWNER.logout()">Keluar Owner</button>');
    document.querySelectorAll('input[data-owner-image]').forEach(function(inp){
      inp.addEventListener('change',function(){
        const file=this.files&&this.files[0];if(!file)return;
        if(file.size>4*1024*1024)return toastMsg('Foto maksimal 4 MB untuk mode demo.');
        const rd=new FileReader();rd.onload=function(){const all=get(IMG_KEY,{});all[inp.getAttribute('data-owner-image')]=rd.result;put(IMG_KEY,all);NUSA_OWNER.panel();NUSA_OWNER_APPLY();toastMsg('Foto berhasil diganti.')};rd.readAsDataURL(file);
      });
    });
  };
  window.updateAuthUI=function(){
    const a=session(),logged=!!a,acc=document.getElementById('accountName');
    if(acc){acc.textContent=logged?a.name:'Login';acc.onclick=function(){logged?location.href='user.html':NUSA_AUTH.open('login')}}
    const mn=document.getElementById('menuName'),me=document.getElementById('menuEmail'),mp=document.getElementById('menuPhoto');
    if(mn)mn.textContent=logged?a.name:'Tamu';
    if(me)me.textContent=logged?(a.email||''):'Belum masuk';
    if(mp)mp.src=logged&&a.photo?a.photo:'https://i.pravatar.cc/100?u=nusa';
    const btn=document.getElementById('authMenuBtn');if(btn){btn.innerHTML='<span class="ico">'+(logged?'🚪':'🔑')+'</span>'+(logged?'Keluar':'Login');btn.onclick=logged?NUSA_AUTH.logout:function(){if(typeof openMenu==='function')openMenu(false);NUSA_AUTH.open('login')}}
  };
  window.NUSA_OWNER_APPLY=function(){
    const im=get(IMG_KEY,{});document.querySelectorAll('.nusaFallbackCard').forEach(c=>{const t=c.querySelector('strong'),i=c.querySelector('img');if(t&&i&&im[t.textContent])i.src=im[t.textContent]});
  };
  function wireOwner(){
    const logo=document.querySelector('.logo');if(!logo)return;
    let taps=0,timer=null;
    logo.addEventListener('click',function(e){
      taps++;clearTimeout(timer);timer=setTimeout(()=>taps=0,2500);
      if(taps>=7){e.preventDefault();e.stopPropagation();taps=0;ownerAccess()}
    },true);
  }
  window.addEventListener('load',function(){updateAuthUI();wireOwner();setTimeout(NUSA_OWNER_APPLY,400)});
})();