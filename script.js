const $=(s,c=document)=>c.querySelector(s);const $$=(s,c=document)=>[...c.querySelectorAll(s)];

const nav=$('#siteNav');window.addEventListener('scroll',()=>nav?.classList.toggle('scrolled',scrollY>30));
const menuBtn=$('#menuBtn'),mobileMenu=$('#mobileMenu');menuBtn?.addEventListener('click',()=>mobileMenu.classList.toggle('open'));$$('#mobileMenu a').forEach(a=>a.addEventListener('click',()=>mobileMenu.classList.remove('open')));

const glow=$('#cursorGlow');window.addEventListener('pointermove',e=>{if(!glow)return;glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'});

const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');if(e.target.matches('.quick-stats article'))animateCount(e.target)}}),{threshold:.14});
$$('.reveal,.quick-stats article').forEach(el=>io.observe(el));

const counted=new WeakSet();function animateCount(card){if(counted.has(card))return;counted.add(card);const el=$('strong',card);if(!el)return;const target=Number(el.dataset.count||0),suffix=el.dataset.suffix||'',start=performance.now(),duration=1200;function tick(now){const p=Math.min((now-start)/duration,1),v=1-Math.pow(1-p,3);el.textContent=Math.round(target*v)+suffix;if(p<1)requestAnimationFrame(tick)}requestAnimationFrame(tick)}

const journey=[
['01 / SCAN','掃描真實場域，啟動數位任務。','玩家在晉江寮找到指定圖像，以 AR 掃描啟動任務，讓實體地點成為互動體驗的入口。','ar.html'],
['02 / PLAY','用操作取代單向閱讀。','透過跳格子、拼圖等小遊戲，讓使用者必須實際操作與完成挑戰，再取得下一段內容。','missions.html'],
['03 / LEARN','在探索中理解地方文化與生態。','3D 植物、地方故事與 AI NPC 共同構成知識入口，讓學習自然融入遊戲流程。','npc.html'],
['04 / COLLECT','把學習歷程變成可以蒐集的成就。','完成任務後取得徽章與進度，讓使用者能看見自己的探索歷程，並提高持續參與動機。','missions.html']
];
$$('[data-journey]').forEach(btn=>btn.addEventListener('click',()=>{$$('[data-journey]').forEach(x=>x.classList.remove('active'));btn.classList.add('active');const d=journey[Number(btn.dataset.journey)];$('#journeyNo').textContent=d[0];$('#journeyTitle').textContent=d[1];$('#journeyText').textContent=d[2];$('#journeyLink').href=d[3];$('.scanner')?.animate([{transform:'scale(.94)',opacity:.6},{transform:'scale(1)',opacity:1}],{duration:420,easing:'ease-out'})}));

async function hydrateB64Images(){for(const img of $$('.b64-image')){try{const r=await fetch(img.dataset.b64);if(!r.ok)throw 0;const b64=(await r.text()).trim();img.src='data:image/jpeg;base64,'+b64;img.onload=()=>{img.classList.add('loaded');img.parentElement.querySelector('span')?.remove()}}catch(e){const t=img.parentElement.querySelector('span');if(t)t.textContent='PREVIEW UNAVAILABLE'}}}hydrateB64Images();

const lightbox=$('#lightbox'),lightboxImg=$('#lightboxImg');$$('.screen-card').forEach(card=>card.addEventListener('click',()=>{const img=$('.b64-image',card);if(!img?.src)return;lightboxImg.src=img.src;lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false')}));$('#lightboxClose')?.addEventListener('click',()=>{lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true')});lightbox?.addEventListener('click',e=>{if(e.target===lightbox)$('#lightboxClose').click()});

$$('.plant-filter button').forEach(btn=>btn.addEventListener('click',()=>{$$('.plant-filter button').forEach(x=>x.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;$$('.plant-card').forEach(card=>card.classList.toggle('hidden',f!=='all'&&card.dataset.category!==f))}));

const modal=$('#plantModal');$$('.plant-card button').forEach(btn=>btn.addEventListener('click',e=>{const card=e.currentTarget.closest('.plant-card');$('#modalPlantName').textContent=card.dataset.name;$('#modalPlantLatin').textContent=card.dataset.latin;$('#modalArLink').href='ar.html?plant='+encodeURIComponent(card.dataset.name);modal.showModal()}));$('#plantModalClose')?.addEventListener('click',()=>modal.close());modal?.addEventListener('click',e=>{const r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)modal.close()});

const stage=$('.hero-stage');stage?.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5,d=$('.device',stage);if(d)d.style.transform=`rotate(${4+x*4}deg) translate(${x*7}px,${y*7}px)`});stage?.addEventListener('pointerleave',()=>{const d=$('.device',stage);if(d)d.style.transform='rotate(4deg)'});
