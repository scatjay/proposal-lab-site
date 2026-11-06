/* 提案室·實驗工坊 共用層：Google 登入 → 白名單 → 資料存取。
   正式：Firebase（專案 gen-lang-client-0929530380，規則區塊 lab）。網址帶 ?mock=1 改用本機假資料層（測試用，不連網）。 */
(function () {
  var CFG = {
    apiKey: "AIzaSyBwPR0oE5VK0eBlqq8JY1B56UXy3R9cyng",
    authDomain: "gen-lang-client-0929530380.firebaseapp.com",
    databaseURL: "https://gen-lang-client-0929530380-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "gen-lang-client-0929530380"
  };
  var ADMINS = ['scatjay@gmail.com', 'yib@stust.edu.tw'];
  var MOCK = /[?&]mock=1/.test(location.search);
  var db = null, auth = null;
  function ek(e) { return String(e || '').toLowerCase().replace(/\./g, ','); }
  function split(p) { return p.split('/').filter(Boolean); }

  /* ---------- 資料層 ---------- */
  var D = {};
  if (MOCK) {
    var KEY = 'labmock.tree';
    var load = function () { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } };
    var save = function (t) { try { localStorage.setItem(KEY, JSON.stringify(t)); } catch (e) {} };
    D.get = function (p) { var n = load(); split(p).some(function (k) { n = (n && typeof n === 'object') ? n[k] : undefined; return n === undefined; }); return Promise.resolve(n === undefined ? null : n); };
    D.set = function (p, v) { var t = load(), parts = split(p), n = t; parts.slice(0, -1).forEach(function (k) { if (typeof n[k] !== 'object' || n[k] === null) n[k] = {}; n = n[k]; });
      if (v === null) delete n[parts[parts.length - 1]]; else n[parts[parts.length - 1]] = JSON.parse(JSON.stringify(v)); save(t); return Promise.resolve(); };
    D.remove = function (p) { return D.set(p, null); };
    /* 假資料層的「場上角色」：只在 ?mock=1 時，送出試聊後 0.7 秒自動回一句，讓整條流程可在本機走完。正式環境由楊老師電腦上的代理程式回覆。 */
    var rawSet = D.set;
    D.set = function (p, v) { var r = rawSet(p, v), m = /^lab\/u\/([^/]+)\/req\/([^/]+)$/.exec(p);
      if (m && v) { setTimeout(function () { var q = {}; try { q = JSON.parse(v); } catch (e) {} rawSet('lab/u/' + m[1] + '/out/' + m[2], JSON.stringify({ text: '（模擬回覆）我聽到你說「' + String(q.m || '').slice(0, 20) + '」。', m: 'mock', t: Date.now() })); }, 700); }
      return r; };
  } else {
    D.get = function (p) { return db.ref(p).once('value').then(function (s) { return s.val(); }); };
    D.set = function (p, v) { return db.ref(p).set(v); };
    D.remove = function (p) { return db.ref(p).remove(); };
  }

  /* ---------- 登入 ---------- */
  function start(h) {
    function resolve(email) {
      var isAdmin = ADMINS.indexOf(email) >= 0;
      D.get('lab/_wl/' + ek(email)).then(function (code) {
        if (!code && !isAdmin) { h.onDenied(email); return; }
        h.onReady({ email: email, code: code || null, isAdmin: isAdmin, db: D });
      }).catch(function (e) { h.onError('讀取白名單失敗：' + (e && e.code || e)); });
    }
    if (MOCK) {
      var m = (location.search.match(/[?&]as=([^&]+)/) || [])[1];
      var email = m ? decodeURIComponent(m) : (localStorage.getItem('labmock.email') || '');
      if (!email) { h.onSignedOut(); return; }
      var wl = load()['lab'] && load()['lab']['_wl']; if (!wl) { D.set('lab/_wl/' + ek('mock@example.com'), 'lab-mock'); }
      resolve(email); return;
    }
    firebase.initializeApp(CFG); auth = firebase.auth(); db = firebase.database();
    auth.getRedirectResult().catch(function (e) { h.onError('登入沒有完成：' + (e && e.code || e)); });
    auth.onAuthStateChanged(function (u) {
      if (!u) { h.onSignedOut(); return; }
      if (u.isAnonymous || !u.email) { auth.signOut(); return; }
      if (!u.emailVerified) { h.onError('這個 Google 帳號的信箱尚未驗證。'); auth.signOut(); return; }
      resolve(u.email.toLowerCase());
    });
  }
  function prompt0() { return null; }
  function signIn() {
    if (MOCK) { return; }
    var p = new firebase.auth.GoogleAuthProvider(); p.setCustomParameters({ prompt: 'select_account' });
    /* 手機也先彈窗，被擋再轉址（2026-10-28 手機實測轉址會丟登入結果） */
    return auth.signInWithPopup(p).catch(function (e) {
      if (e && (e.code === 'auth/popup-blocked' || e.code === 'auth/operation-not-supported-in-this-environment')) return auth.signInWithRedirect(p);
      throw e;
    });
  }
  function signOut() { if (MOCK) { try { localStorage.removeItem('labmock.email'); } catch (e) {} location.reload(); return; } auth.signOut(); }
  window.LAB = { start: start, signIn: signIn, signOut: signOut, mock: MOCK, ek: ek, admins: ADMINS };
})();
