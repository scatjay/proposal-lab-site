/* 提案室·實驗工坊：起手範例與 Markdown 匯出。人物皆為化名與虛構，可直接複製後改成自己的。 */
(function () {
  var QUAD = { IF: '話少、先在意感受', IT: '話少、先在意道理', EF: '話多、先在意感受', ET: '話多、先在意道理' };
  function quadName(co) { if (!co || co.x === undefined) return '未設定'; return QUAD[(co.x < 0.5 ? 'I' : 'E') + (co.y < 0.5 ? 'F' : 'T')]; }

  var TEMPLATES = [
    { id: 'edu', name: '教育專業向：用藥小教室', desc: '對象是高中職生的用藥衛教。重點是用對話讓學生自己發現哪裡不對，不是說教。',
      project: {
        v: 1,
        chars: [
          { name: '小禾', bio: '十六歲的高二生，社團幹部，最近熬夜趕報告，頭痛時習慣自己買成藥來吃，覺得多吃一顆好得比較快。', speech: '句子短、語氣有點不耐煩，常說「還好啦」「我知道啦」，被追問才會多說一點。',
            knows: ['自己最近吃了哪些藥', '熬夜的原因', '上次頭痛是什麼時候'], unknown: ['藥的成分和劑量上限', '不同藥一起吃的風險'], rules: ['每次最多兩句', '不要主動說出自己吃過量', '被問到用藥細節要猶豫一下'], coord: { x: 0.25, y: 0.75 } },
          { name: '林護理師', bio: '三十多歲的校護，值班快十年，看過很多學生自己亂吃藥，不愛說教，習慣用問題帶學生自己想。', speech: '語氣溫和、節奏慢，常用「你覺得呢？」「後來呢？」，不下命令。',
            knows: ['常見成藥的安全劑量', '學生常見的迷思'], unknown: ['小禾私下吃了什麼'], rules: ['不直接說教或下結論', '每次最多三句', '不開藥、不做診斷，只提醒就醫'], coord: { x: 0.55, y: 0.35 } }
        ],
        scenes: [{ name: '校園保健室', mood: '午休時間安靜的保健室，窗邊有一排藥櫃，空氣裡有點消毒水味。', rooms: [{ name: '保健室', desc: '有床、藥櫃和一張小桌子，校護在這裡值班。' }, { name: '走廊', desc: '午休時間沒什麼人，可以小聲聊。' }] }],
        story: { concept: '午休的保健室裡，一個頭痛的高二生自己吃了好幾種藥，你要用問題讓他發現哪裡不對。', playerRole: '剛加入團隊的衛教設計師，隔著對話觀察，不能直接下指令',
          opening: '午休鐘剛響，小禾捧著頭走進保健室，說只是有點頭痛，書包裡露出三種不同的藥盒。', goal: '問出小禾這一週吃了什麼藥、吃了多少，並讓他自己說出該注意的地方。', ending: '小禾答應把藥盒拿給林護理師看，並約好下午再回來。', gm: '林護理師', breakWall: false }
      } },
    { id: 'ent', name: '娛樂故事向：深夜便利店', desc: '恐怖懸疑。重點是主持人（GM）怎麼引導、角色怎麼守住祕密，玩家也可以打破第四面牆。',
      project: {
        v: 1,
        chars: [
          { name: '阿德', bio: '二十出頭的夜班店員，在這間店做了三個月，沒人知道他為什麼願意值這種班，說話時會不自覺看向倉庫門。', speech: '句子很短，常說「很正常啦」「別問」，緊張時會突然轉移話題。',
            knows: ['倉庫裡有一個上鎖的櫃子', '上個月的夜班發生過什麼'], unknown: ['外面的路已經被土石流堵住了'], rules: ['不直接承認倉庫有問題', '每次最多兩句', '被逼問兩次以上才透露一點線索'], coord: { x: 0.15, y: 0.6 } },
          { name: '小雨', bio: '二十五歲的上班族，颱風夜被困在店裡，話很多，靠一直講話壓住害怕，愛吐槽也愛亂猜。', speech: '語速快，愛用誇張語氣和驚嘆號，常常自問自答。',
            knows: ['自己的手機只剩一格電', '剛才聽到倉庫有聲音'], unknown: ['阿德隱瞞的事'], rules: ['每次最多四句', '常把話題帶偏但要回到線索', '不要說出超出設定的劇情'], coord: { x: 0.9, y: 0.2 } }
        ],
        scenes: [{ name: '山腰的二十四小時便利店', mood: '颱風夜，外面風雨很大，日光燈偶爾閃一下，冷氣聲特別大。', rooms: [{ name: '櫃台', desc: '阿德待的地方，後面是通往倉庫的門。' }, { name: '冷飲區', desc: '冷氣最大聲的地方，玻璃門反光會看到身後。' }, { name: '倉庫', desc: '堆滿紙箱，角落有一個上鎖的鐵櫃。' }] }],
        story: { concept: '颱風夜被困在山上的便利店，店員好像隱瞞著倉庫裡的什麼。', playerRole: '被困的客人，也可以是看著這一切的外部玩家',
          opening: '凌晨一點，風雨把路封住了。你推開便利店的門，櫃台後的阿德抬頭看了你一眼，又很快看向倉庫的方向。', goal: '在天亮前找出倉庫裡藏的是什麼，並平安離開。', ending: '天亮時路通了，你帶著答案離開，或什麼都沒問出來。', gm: '阿德', breakWall: true }
      } }
  ];

  function fv(x) { return Array.isArray(x) ? x.join('、') : String(x == null ? '' : x); }
  function J(s) { try { return JSON.parse(s); } catch (e) { return null; } }

  /* o: { project, gens(物件，值為 JSON 字串), marks, req, out, model, cap, used } → Markdown 字串 */
  function exportMd(o) {
    var P = o.project || { chars: [], scenes: [], story: {} }, st = P.story || {}, L = [];
    L.push('# 我的提案室實驗'); L.push('');
    L.push('> 匯出時間：' + new Date().toLocaleString('zh-TW') + '。人物與地點請使用化名，不要放真實人名、學號或真實院所。'); L.push('');
    L.push('## 一、故事'); L.push('');
    L.push('- 高概念：' + (st.concept || '（未填）')); L.push('- 玩家的身分：' + (st.playerRole || '（未填）')); L.push('- 開場事件：' + (st.opening || '（未填）'));
    L.push('- 目標：' + (st.goal || '（未填）')); L.push('- 結局：' + (st.ending || '（未填）')); L.push('- 主持人（GM）：' + (st.gm || '（不設）')); L.push('- 打破第四面牆：' + (st.breakWall ? '是' : '否')); L.push('');
    L.push('## 二、場景'); L.push('');
    (P.scenes || []).forEach(function (s, i) { L.push('### 場景 ' + (i + 1) + '：' + (s.name || '（未命名）')); if (s.mood) L.push('氣氛：' + s.mood); (s.rooms || []).forEach(function (r) { L.push('- ' + (r.name || '（房間）') + (r.desc ? '：' + r.desc : '')); }); L.push(''); });
    if (!(P.scenes || []).length) { L.push('（尚未建立場景）'); L.push(''); }
    L.push('## 三、角色'); L.push('');
    (P.chars || []).forEach(function (c, i) { L.push('### 角色 ' + (i + 1) + '：' + (c.name || '（未命名）')); L.push('- 簡介：' + (c.bio || '')); L.push('- 說話方式：' + (c.speech || '')); L.push('- 性格座標：' + quadName(c.coord) + (c.coord ? '（話多程度 ' + Math.round(c.coord.x * 100) + '%，重道理程度 ' + Math.round(c.coord.y * 100) + '%）' : ''));
      L.push('- 知道：' + fv(c.knows)); L.push('- 不知道：' + fv(c.unknown)); L.push('- 規則：' + fv(c.rules)); L.push(''); });
    if (!(P.chars || []).length) { L.push('（尚未建立角色）'); L.push(''); }
    L.push('## 四、進化紀錄'); L.push('');
    var gens = Object.keys(o.gens || {}).map(function (k) { return J(o.gens[k]); }).filter(Boolean).sort(function (a, b) { return (a.g || 0) - (b.g || 0); });
    var VN = { candidate: '等待決定', accepted: '已接受', rejected: '已退回' };
    gens.forEach(function (g) { var c = (P.chars || [])[g.ci] || {}, s = g.s || {}; L.push('### 第 ' + g.g + ' 代（' + (VN[g.v] || g.v) + '）　' + (c.name || '角色') + '：' + ({ speech: '說話方式', bio: '簡介', rules: '規則' }[g.f] || g.f));
      L.push('- 為什麼改：' + (g.why || '')); L.push('- 好例子測驗：' + ((s.gold || [0, 0])[0]) + ' / ' + ((s.gold || [0, 0])[1]) + '；壞例子改善：' + ((s.improved || [0, 0])[0]) + ' / ' + ((s.improved || [0, 0])[1]) + '；紅線違反：' + (s.redline || 0) + ' 次');
      L.push(''); L.push('改之前：'); L.push(''); L.push('> ' + String(g.b || '').split('\n').join('\n> ')); L.push(''); L.push('改之後：'); L.push(''); L.push('> ' + String(g.a || '').split('\n').join('\n> ')); L.push(''); });
    if (!gens.length) { L.push('（還沒有進化紀錄）'); L.push(''); }
    var marks = Object.keys(o.marks || {}).map(function (k) { var m = J(o.marks[k]) || {}; m.id = k; return m; }), cnt = { like: 0, unlike: 0, stuck: 0 };
    marks.forEach(function (m) { if (cnt[m.v] !== undefined) cnt[m.v]++; });
    L.push('## 五、試聊標註'); L.push(''); L.push('- 像：' + cnt.like + ' 個；不像：' + cnt.unlike + ' 個；卡住：' + cnt.stuck + ' 個'); L.push('');
    var shown = 0; marks.sort(function (a, b) { return (a.t || 0) - (b.t || 0); }).forEach(function (m) { if (shown >= 12) return; var q = J((o.req || {})[m.id]) || {}, a = J((o.out || {})[m.id]) || {}; if (!a.text) return; shown++;
      L.push('- 【' + ({ like: '像', unlike: '不像', stuck: '卡住' }[m.v] || m.v) + '】玩家：' + (q.m || '') + '／角色：' + a.text + (m.n ? '／備註：' + m.n : '')); });
    L.push(''); L.push('## 六、Demo 紀錄'); L.push('');
    var dm = Object.keys(o.demos || {}).sort().map(function (k) { return J(o.demos[k]); }).filter(Boolean);
    dm.forEach(function (x, i) { L.push('### Demo ' + (i + 1) + '：' + (x.d || '') + '　' + (x.w || '') + '，約 ' + (x.m || '?') + ' 分鐘'); if (x.did) L.push('- 玩了什麼：' + x.did); if (x.like) L.push('- 喜歡：' + x.like); if (x.stuck) L.push('- 卡住或困惑：' + x.stuck); if (x.want) L.push('- 想改：' + x.want); L.push(''); });
    if (!dm.length) { L.push('（還沒有 Demo 紀錄）'); L.push(''); }
    L.push('## 七、使用的 AI'); L.push(''); L.push('- 場上角色型號：' + (o.model || '')); L.push('- 累積花費：NT$ ' + (o.used || 0) + ' ／ ' + (o.cap || '') + '（上限由老師設定）'); L.push('');
    return L.join('\n');
  }
  window.LABX = { templates: TEMPLATES, exportMd: exportMd, quadName: quadName };
})();
