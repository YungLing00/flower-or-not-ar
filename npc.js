const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const messages=$('#messages'),suggestions=$('#suggestions'),input=$('#chatInput');
const answers=[
{keys:['專題','做什麼','概念'],text:'《花非花？》聚焦臺中沙鹿晉江寮的地方生態與文化記憶保存，透過手機 AR 植物互動遊戲、任務與數位內容，引導使用者在探索中理解地方文化、生態與永續。'},
{keys:['怎麼玩','流程','遊戲'],text:'核心流程是：掃描任務點 → 接收挑戰 → 完成闖關 → 獲取徽章與知識。原專題包含 3D 跳格子、2D 拼圖、植物展示、植物自訂與 AI NPC 等內容。'},
{keys:['AI','NPC','小精靈'],text:'AI NPC「晉江小精靈」是文化與生態知識的互動入口。原報告描述玩家可以透過與 NPC 對話，理解晉江寮的歷史、文化與生態資訊。這個網站版是安全的本地互動示範，不會把 API 金鑰放在前端。'},
{keys:['研究','結果','測試','88','56'],text:'專題簡報記錄清水測試共 56 位不同年齡層測試者，超過 88% 認為遊戲設計新穎且有趣，並能激發對地方的好奇心。原報告也指出部分掃描任務有圖像辨識不準確的問題。'},
{keys:['未來','發展','展望'],text:'原報告的未來方向包括：增加居民深度訪談、更多生態知識問答與互動內容，並探索其他具有文化意涵的社區，把這種模式延伸到更多地方。'},
{keys:['郭蘊苓','蘊苓','負責','角色'],text:'郭蘊苓在原報告中的工作包含：進度規劃、關卡與功能發想、故事腳本、植物模型、NPC 模型、UI 與視覺、音樂音效、徽章模型、簡報與報告、ChatGPT API、影片拍攝與剪輯。'},
{keys:['植物'],text:'這個專題收錄 10 種植物展示。你可以回到首頁的 Digital Herbarium 查看名稱，或前往 AR Garden 進行植物放置、縮放與旋轉互動。'},
{keys:['問題','缺點','辨識'],text:'原報告提到的主要技術問題之一，是掃描社區指定圖像啟動任務時可能遇到辨識不準確，因此後續需要提高圖像辨識準確度並優化程式效能。'}
];
const quick=['這個專題在做什麼？','遊戲怎麼玩？','AI NPC 的作用是什麼？','這個專題的研究結果呢？'];
function add(text,type='bot'){const d=document.createElement('div');d.className='msg '+type;d.innerHTML='<small>'+(type==='bot'?'JINJIANG SPIRIT':'YOU')+'</small>'+text;messages.appendChild(d);messages.scrollTop=messages.scrollHeight}
function reply(q){const s=q.replace(/\s/g,'').toLowerCase();let a=answers.find(x=>x.keys.some(k=>s.includes(k.toLowerCase())));if(!a)a={text:'這個問題目前沒有在專題文件中找到足夠資訊，所以我不會自行補寫。你可以問我：專題概念、遊戲流程、AI NPC、使用者測試、未來展望或郭蘊苓的工作內容。'};setTimeout(()=>add(a.text),380)}
function ask(q){if(!q.trim())return;add(q,'user');input.value='';reply(q)}
function renderSuggestions(){suggestions.innerHTML='';quick.forEach(q=>{const b=document.createElement('button');b.textContent=q;b.onclick=()=>ask(q);suggestions.appendChild(b)})}
$('#chatForm').addEventListener('submit',e=>{e.preventDefault();ask(input.value)});
$('#resetChat').addEventListener('click',()=>{messages.innerHTML='';start()});
$$('[data-question]').forEach(b=>b.addEventListener('click',()=>{ask(b.dataset.question);document.querySelector('.chat-shell').scrollIntoView({behavior:'smooth'})}));
function start(){add('嗨！我是晉江小精靈 🌱 你可以問我關於《花非花？》的專題概念、玩法、AR、AI NPC、研究結果或未來發展。');renderSuggestions()}start();