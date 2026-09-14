const $ = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => [...c.querySelectorAll(s)];

const menuBtn = $('#menuBtn');
const nav = $('.nav');
menuBtn?.addEventListener('click', () => nav.classList.toggle('open'));
$$('.nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

const glow = $('#cursorGlow');
window.addEventListener('pointermove', e => {
  if (!glow) return;
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      if (entry.target.classList.contains('stat')) animateStat(entry.target);
    }
  });
}, { threshold: .14 });

$$('.reveal').forEach(el => observer.observe(el));

const journeyData = [
  ['01','掃描任務點','玩家在晉江寮社區找到指定圖像，以 AR 掃描啟動對應任務，讓真實地點成為遊戲入口。'],
  ['02','進入互動關卡','完成 3D 跳格子、2D 拼圖等任務，以遊戲化方式建立探索動機與挑戰感。'],
  ['03','認識植物與文化','透過 360° 植物展示與 AI NPC「晉江小精靈」，理解地方歷史、文化與生態知識。'],
  ['04','獲得徽章','完成任務後取得徽章並記錄探索進度，鼓勵玩家持續走訪不同地點與內容。']
];

$$('.journey-step').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.journey-step').forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
    const [no,title,text] = journeyData[Number(btn.dataset.step)];
    $('#panelNo').textContent = no;
    $('#panelTitle').textContent = title;
    $('#panelText').textContent = text;
    const box = $('.scan-box');
    if (box) {
      box.animate([
        {transform:'scale(.96)', opacity:.5},
        {transform:'scale(1)', opacity:1}
      ], {duration:420, easing:'ease-out'});
    }
  });
});

const animated = new WeakSet();
function animateStat(card){
  if(animated.has(card)) return;
  animated.add(card);
  const el = $('strong', card);
  const target = Number(el.dataset.count || 0);
  const suffix = el.dataset.suffix || '';
  const start = performance.now();
  const duration = 1200;
  function tick(now){
    const p = Math.min((now-start)/duration,1);
    const eased = 1 - Math.pow(1-p,3);
    el.textContent = Math.round(target*eased) + suffix;
    if(p<1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const hero = $('.hero-visual');
hero?.addEventListener('pointermove', e => {
  const r = hero.getBoundingClientRect();
  const x = (e.clientX-r.left)/r.width-.5;
  const y = (e.clientY-r.top)/r.height-.5;
  const phone = $('.phone',hero);
  if(phone) phone.style.transform = `rotate(${5+x*4}deg) translate(${x*8}px,${y*8}px)`;
});
hero?.addEventListener('pointerleave', () => {
  const phone = $('.phone',hero);
  if(phone) phone.style.transform = 'rotate(5deg)';
});