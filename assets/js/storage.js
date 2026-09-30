/* LocalStorage data layer — designed to be replaceable by Supabase later. */
const TravelStore = (() => {
  const KEY = 'nusa_travel_demo_v1';
  const defaults = { user:null, wishlist:[], bookings:[], reviews:[], profile:{name:'',email:'',photo:''} };
  const load = () => { try{return {...defaults,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return {...defaults}} };
  const save = state => localStorage.setItem(KEY,JSON.stringify(state));
  let state=load();
  const get=()=>JSON.parse(JSON.stringify(state));
  const set=patch=>{state={...state,...patch};save(state);return get()};
  const toggleWishlist=id=>{const wishlist=state.wishlist.includes(id)?state.wishlist.filter(x=>x!==id):[...state.wishlist,id];return set({wishlist}).wishlist};
  const addBooking=booking=>{const bookings=[...state.bookings,{...booking,id:crypto.randomUUID?.()||Date.now().toString(),createdAt:new Date().toISOString()}];return set({bookings}).bookings};
  const addReview=review=>{const reviews=[...state.reviews,{...review,id:crypto.randomUUID?.()||Date.now().toString(),createdAt:new Date().toISOString()}];return set({reviews}).reviews};
  const login=(name,email)=>set({user:{name,email},profile:{...state.profile,name,email}}).user;
  const logout=()=>set({user:null});
  const updateProfile=patch=>set({profile:{...state.profile,...patch},user:state.user?{...state.user,...patch}:state.user}).profile;
  const reset=()=>{state={...defaults};save(state);return get()};
  return {get,set,toggleWishlist,addBooking,addReview,login,logout,updateProfile,reset};
})();
window.TravelStore=TravelStore;

/* NUSA Premium UI layer — demo only, still 100% LocalStorage. */
(() => {
  const LANG_KEY='nusa_language';
  const languages=[
    ['id','🇮🇩','Indonesia'],['en','🇬🇧','English'],['ja','🇯🇵','日本語'],
    ['zh','🇨🇳','中文'],['ko','🇰🇷','한국어'],['de','🇩🇪','Deutsch'],['fr','🇫🇷','Français']
  ];
  const copy={
    id:{explore:'Jelajahi',dest:'Destinasi',reviews:'Ulasan',how:'Cara kerja',wishlist:'Wishlist',login:'Masuk',account:'Akun Anda',orders:'Pesanan & Booking',journal:'Jurnal Anda',notifications:'Notifikasi',settings:'Pengaturan',help:'Bantuan',language:'Bahasa',logout:'Keluar',close:'Tutup'},
    en:{explore:'Explore',dest:'Destinations',reviews:'Reviews',how:'How it works',wishlist:'Wishlist',login:'Log in',account:'Your account',orders:'Orders & Bookings',journal:'Your journal',notifications:'Notifications',settings:'Settings',help:'Help',language:'Language',logout:'Log out',close:'Close'},
    ja:{explore:'探索',dest:'目的地',reviews:'レビュー',how:'利用方法',wishlist:'お気に入り',login:'ログイン',account:'アカウント',orders:'予約・注文',journal:'あなたの旅日記',notifications:'通知',settings:'設定',help:'ヘルプ',language:'言語',logout:'ログアウト',close:'閉じる'},
    zh:{explore:'探索',dest:'目的地',reviews:'评价',how:'使用方式',wishlist:'收藏',login:'登录',account:'我的账户',orders:'订单与预订',journal:'我的旅行日志',notifications:'通知',settings:'设置',help:'帮助',language:'语言',logout:'退出登录',close:'关闭'},
    ko:{explore:'탐색',dest:'여행지',reviews:'후기',how:'이용 방법',wishlist:'위시리스트',login:'로그인',account:'내 계정',orders:'주문 및 예약',journal:'나의 여행일지',notifications:'알림',settings:'설정',help:'도움말',language:'언어',logout:'로그아웃',close:'닫기'},
    de:{explore:'Entdecken',dest:'Reiseziele',reviews:'Bewertungen',how:'So funktioniert es',wishlist:'Wunschliste',login:'Anmelden',account:'Ihr Konto',orders:'Bestellungen & Buchungen',journal:'Ihr Reisetagebuch',notifications:'Benachrichtigungen',settings:'Einstellungen',help:'Hilfe',language:'Sprache',logout:'Abmelden',close:'Schließen'},
    fr:{explore:'Explorer',dest:'Destinations',reviews:'Avis',how:'Comment ça marche',wishlist:'Favoris',login:'Connexion',account:'Votre compte',orders:'Commandes & réservations',journal:'Votre journal',notifications:'Notifications',settings:'Paramètres',help:'Aide',language:'Langue',logout:'Déconnexion',close:'Fermer'}
  };
  const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const inject=()=>{
    const style=document.createElement('style');
    style.textContent=`
      :root{--ink:#171114;--muted:#766b70;--bg:#faf7f7;--card:#fff;--line:#eadcdf;--accent:#b51f3b;--dark:#260b13;--red:#b51f3b;--gold:#f2b900}
      body{background:var(--bg);color:var(--ink)}
      .top{background:linear-gradient(90deg,#220810,#5d1021,#220810);color:#fff1f4;letter-spacing:.04em}
      .nav{background:#fffafbef;border-bottom:1px solid #ecdfe2;box-shadow:0 8px 35px #5d10210b}
      .logo{color:#8f1530;letter-spacing:.25em}
      .links a:hover{color:var(--red)}
      .navright{gap:10px}
      .navbtn{border-color:#ead7dc;background:#fff;color:#531323}
      .premium-menu-btn{width:43px;height:43px;border-radius:50%;background:#8f1530;color:#fff;display:grid;place-items:center;font-size:21px;box-shadow:0 8px 25px #8f153044}
      .premium-account{font-size:12px;font-weight:800;color:#531323;max-width:115px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .hero{background:linear-gradient(90deg,#250812e8,#5d10216e),url('https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=2200&q=85') center/cover}
      .eyebrow,.kicker{color:#a81735}.hero .eyebrow{color:#ffd7df}
      .btn.dark{background:#8f1530;box-shadow:0 8px 24px #8f153033}.btn.dark:hover{background:#741027}
      .chip.active,.chip:hover{background:#8f1530}.detail{border-color:#8f1530}.heart.saved{color:#b51f3b}
      .rating{color:#f2b900!important}.rating span{color:var(--muted)!important}
      .range{accent-color:#8f1530}
      .steps{background:linear-gradient(135deg,#260b13,#551022)}
      .cta{background:linear-gradient(90deg,#260b13e8,#5d10218a),url('https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1800&q=85') center/cover}
      .premium-drawer{position:fixed;inset:0;z-index:1000;background:#18070ca8;backdrop-filter:blur(9px);display:none;justify-content:flex-end}
      .premium-drawer.open{display:flex}.premium-panel{width:min(390px,92vw);height:100%;background:#fffafa;box-shadow:-20px 0 70px #0004;padding:22px;overflow:auto;animation:drawerIn .24s ease}
      @keyframes drawerIn{from{transform:translateX(100%)}to{transform:none}}
      .premium-head{display:flex;align-items:center;justify-content:space-between;padding-bottom:18px;border-bottom:1px solid #eadcdf}.premium-head b{font:500 27px 'Playfair Display',serif;color:#671328}.premium-close{width:38px;height:38px;border-radius:50%;background:#f7e9ed;color:#7b1730;font-size:20px}
      .premium-user{display:flex;gap:12px;align-items:center;padding:18px 0}.premium-avatar{width:48px;height:48px;border-radius:50%;object-fit:cover;background:#eadcdf}.premium-user small{color:#8a7b81}.premium-list{display:grid;gap:6px}.premium-item{width:100%;display:flex;align-items:center;gap:13px;text-align:left;padding:13px 12px;border-radius:10px;background:transparent;color:#3e2830;font-size:13px;font-weight:700}.premium-item:hover{background:#f7e9ed;color:#8f1530}.premium-item .ico{width:24px;text-align:center;font-size:18px}.premium-divider{height:1px;background:#eadcdf;margin:12px 0}.premium-language{display:none;padding:8px 0 5px 38px}.premium-language.open{display:grid;gap:4px}.lang-option{border:0;background:transparent;text-align:left;padding:9px;border-radius:8px;font-size:12px}.lang-option.active{background:#f7e9ed;color:#8f1530;font-weight:800}
      @media(max-width:560px){.premium-account{max-width:80px}.premium-panel{width:94vw}}
    `;
    document.head.appendChild(style);
  };
  const current=()=>localStorage.getItem(LANG_KEY)||'id';
  const setLang=lang=>{localStorage.setItem(LANG_KEY,lang);applyLanguage(lang);buildDrawer();};
  const applyLanguage=lang=>{
    const c=copy[lang]||copy.id;
    const links=document.querySelectorAll('.links a');
    if(links[0])links[0].textContent=c.explore;if(links[1])links[1].textContent=c.dest;if(links[2])links[2].textContent=c.reviews;if(links[3])links[3].textContent=c.how;
    const old=document.querySelector('.navright .navbtn'); if(old)old.remove();
    const authBtn=document.getElementById('authBtn');if(authBtn)authBtn.textContent=TravelStore.get().user?TravelStore.get().user.name.split(' ')[0]:c.login;
    document.documentElement.lang=lang;
  };
  const buildDrawer=()=>{
    let d=document.getElementById('premiumDrawer');if(!d){d=document.createElement('div');d.id='premiumDrawer';d.className='premium-drawer';document.body.appendChild(d);d.addEventListener('click',e=>{if(e.target===d)toggleDrawer(false)});}
    const s=TravelStore.get(),u=s.user, c=copy[current()];
    d.innerHTML=`<aside class="premium-panel"><div class="premium-head"><b>NUSA</b><button class="premium-close" onclick="window.NUSAMenu(false)">×</button></div><div class="premium-user"><img class="premium-avatar" src="${esc(s.profile.photo||'https://i.pravatar.cc/100?u=nusa')}"><div><b>${esc(u?.name||c.account)}</b><br><small>${esc(u?.email||c.login)}</small></div></div><div class="premium-list">
      <button class="premium-item" onclick="window.NUSAProfile()"><span class="ico">👤</span>${c.account}</button>
      <button class="premium-item" onclick="window.NUSAWishlist()"><span class="ico">♥</span>${c.wishlist}</button>
      <button class="premium-item" onclick="window.NUSAOrders()"><span class="ico">🎫</span>${c.orders}</button>
      <button class="premium-item" onclick="window.NUSAJournal()"><span class="ico">📖</span>${c.journal}</button>
      <button class="premium-item" onclick="window.NUSANotify()"><span class="ico">🔔</span>${c.notifications}</button>
      <button class="premium-item" onclick="window.NUSAToggleLang()"><span class="ico">🌐</span>${c.language}<span style="margin-left:auto">⌄</span></button>
      <div id="premiumLanguages" class="premium-language ${localStorage.getItem(LANG_KEY)?'open':''}">${languages.map(x=>`<button class="lang-option ${current()===x[0]?'active':''}" onclick="window.NUSALang('${x[0]}')">${x[1]} &nbsp; ${x[2]}</button>`).join('')}</div>
      <button class="premium-item" onclick="window.NUSASettings()"><span class="ico">⚙️</span>${c.settings}</button>
      <button class="premium-item" onclick="window.NUSAHelp()"><span class="ico">❓</span>${c.help}</button>
      <div class="premium-divider"></div>
      <button class="premium-item" style="color:#a21735" onclick="window.NUSALogout()"><span class="ico">🚪</span>${c.logout}</button>
    </div></aside>`;
  };
  const toggleDrawer=open=>{const d=document.getElementById('premiumDrawer');if(d)d.classList.toggle('open',open)};
  const toastSafe=t=>{if(typeof toast==='function')toast(t);else alert(t)};
  window.NUSAMenu=toggleDrawer;
  window.NUSALang=setLang;
  window.NUSAToggleLang=()=>document.getElementById('premiumLanguages')?.classList.toggle('open');
  window.NUSAProfile=()=>{toggleDrawer(false);if(typeof auth==='function')auth()};
  window.NUSAWishlist=()=>{toggleDrawer(false);if(typeof wishlist==='function')wishlist()};
  window.NUSAOrders=()=>{toggleDrawer(false);if(typeof profile==='function')profile()};
  window.NUSAJournal=()=>{toggleDrawer(false);toastSafe('Jurnal Anda — fitur demo siap dikembangkan dan dapat dibagikan nanti.')};
  window.NUSANotify=()=>{toggleDrawer(false);toastSafe('Belum ada notifikasi baru.')};
  window.NUSASettings=()=>{toggleDrawer(false);toastSafe('Pengaturan akun tersedia di mode demo.')};
  window.NUSAHelp=()=>{toggleDrawer(false);toastSafe('Bantuan — hubungkan WhatsApp agent pada versi client.')};
  window.NUSALogout=()=>{TravelStore.logout();toggleDrawer(false);if(typeof updateAuth==='function')updateAuth();toastSafe('Berhasil keluar.')};
  const boot=()=>{
    inject();
    const nav=document.querySelector('.nav');if(!nav)return;
    const old=nav.querySelector('.navright');
    if(old){old.innerHTML=`<span class="premium-account" id="premiumAccount"></span><button class="premium-menu-btn" aria-label="Menu" onclick="window.NUSAMenu(true)">☰</button>`;}
    buildDrawer();
    applyLanguage(current());
    const update=()=>{const el=document.getElementById('premiumAccount'),u=TravelStore.get().user;if(el)el.textContent=u?.name||'Guest';};
    update();
    const observer=new MutationObserver(update);observer.observe(nav,{subtree:true,childList:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
